import CryptoJS from 'crypto-js';

const API_URL = 'https://services-encr.iserveu.online/dev/nsdlab-internal/user-authorization/user/login';
const AUTHORIZATION = 'bnNkbGFiLWludGVybmFsLWNsaWVudDpuc2RsYWItaW50ZXJuYWwtcGFzc3dvcmQ=';
const AES_KEY='a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU='

const getDecodedKey = () => {
    return CryptoJS.enc.Base64.parse(AES_KEY);
};

export const encryptData = (requestBody) => {
    const serializedBody = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody ?? {});
    const iv = CryptoJS.lib.WordArray.random(16);
    const decodedKey = getDecodedKey();
    
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(serializedBody), decodedKey, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    
    const combined = iv.clone().concat(encrypted.ciphertext);
    return CryptoJS.enc.Base64.stringify(combined);
};

export const decryptResponseData = (responseBody) => {
    if (!responseBody || typeof responseBody !== 'string') {
        return responseBody;
    }

    const byteCipherText = CryptoJS.enc.Base64.parse(responseBody);
    const iv = CryptoJS.lib.WordArray.create(byteCipherText.words.slice(0, 4), 16);
    const cipherText = CryptoJS.lib.WordArray.create(
        byteCipherText.words.slice(4),
        byteCipherText.sigBytes - 16,
    );
    const decodedKey = getDecodedKey();
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, decodedKey, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    return decryptedString;
};

export const sendForgotPasswordOtp = async (username) => {
    const URL = `https://services.iserveu.online/dev/nsdlab-internal/user-mgmt/utility/send-forgot-password-otp?userName=${username}`;
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data: result
        };
    } catch (error) {
        console.error("Forgot Password OTP API failed:", error);
        return { ok: false, error: error.message };
    }
};

export const verifyOtpAndSendTempPassword = async (payload) => {
    const URL = `https://services.iserveu.online/dev/nsdlab-internal/user-mgmt/utility/verify-otp-send-temporary-password`;
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            data: result
        };
    } catch (error) {
        console.error("OTP Verification API failed:", error);
        return { ok: false, error: error.message };
    }
};

export const handleLogin = async (credentials) => {
    try {
        console.log("Starting encrypted login process...");
        
        const payload = {
            grant_type: 'password',
            username: credentials.username,
            password: credentials.password
        };
        const encryptedString = encryptData(payload);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${AUTHORIZATION}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ RequestData: encryptedString })
        });

        const result = await response.json();
        
        let decryptedData = null;
        if (result && result.ResponseData) {
            try {
                const decryptedString = decryptResponseData(result.ResponseData);
                decryptedData = JSON.parse(decryptedString);
                console.log("Decrypted response:", decryptedData);
            } catch (e) {
                console.error("Failed to decrypt or parse response:", e);
            }
        }

        // Logic: Treat HTTP 200 as success 
        const isSuccess = response.status === 200;

        if (isSuccess) {
            // Save credentials for logout process
            sessionStorage.setItem('login_password', credentials.password);
            
            return { 
                success: true, 
                data: decryptedData || result.data || { user: credentials.username } 
            };
        } else {
            // Get the message from decrypted data if available, else from raw result, else fallback
            const errorMessage = (decryptedData && decryptedData.message) || 
                                (result && result.message) || 
                                `Login failed (Status: ${response.status})`;
            return { success: false, error: errorMessage };
        }

    } catch (error) {
        console.error("Login process failed:", error);
        return { success: false, error: error.message };
    }
};

export const handleLogout = async () => {
    const logoutUrl = 'https://services-encr.iserveu.online/dev/nsdlab-internal/user-authorization/logout';
    const TOKEN = sessionStorage.getItem('access_token');
    const PASS_KEY = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA';
    
    // Retrieve stored credentials from session
    const username = sessionStorage.getItem('username');
    const password = sessionStorage.getItem('login_password');

    const payload = {
        grant_type: 'password',
        username: username || 'NA',
        password: password || 'NA'
    };

    try {
        const encryptedBody = encryptData(payload);
        const response = await fetch(logoutUrl, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
                'pass_key': PASS_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ RequestData: encryptedBody })
        });
        
        const result = await response.json();
        let decryptedData = result;

        if (result && result.ResponseData) {
            try {
                const decryptedString = decryptResponseData(result.ResponseData);
                decryptedData = JSON.parse(decryptedString);
            } catch (e) {
                console.error("Failed to decrypt logout response:", e);
            }
        }

        //Success if status is 'Success' or status_code 200
        const isSuccess = decryptedData.status === 'Success' || decryptedData.status === 'SUCCESS' || response.status === 200;
        
        return { 
            success: isSuccess, 
            statusDesc: decryptedData.statusDesc || decryptedData.message || (isSuccess ? "Logout successful" : "Logout failed")
        };
    } catch (error) {
        console.error("Logout failed:", error);
        return { success: false, statusDesc: error.message };
    }
};
