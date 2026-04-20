import { decryptResponseData, encryptData } from './loginActions';

export const initialCbcFormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  ceoName: '',
  companyName: '',
  email: '',
  pan: '',
  mobileNumber: '',
  faxNumber: '',
  adminName: '',
  adminEmail: '',
  adminMobileNumber: '',
  businessAddressLine: '',
  country: 'India',
  pinCode: '',
  state: '',
  district: '',
  city: '',
  accountNumber: '',
  gstNumber: '',
  institutionType: '',
  stdCode: '',
  telephoneNumber: '',
  affiliateFee: '',
  numberOfStaff: '',
  agreementFromDate: '2026-04-19',
  agreementToDate: '2026-04-19',
  entityPanCard: '',
  incorporationAddressLine1: '',
  productFeatures: 'ACCOUNT_OPENING',
};

export const validateCbcForm = (formData) => {
    const requiredFields = [
      'firstName', 'lastName', 'ceoName', 'companyName', 'email', 'pan', 
      'mobileNumber', 'adminName', 'adminEmail', 'adminMobileNumber', 
      'businessAddressLine', 'country', 'pinCode', 'state', 'district', 
      'city', 'accountNumber', 'gstNumber', 'institutionType', 'stdCode', 
      'telephoneNumber', 'affiliateFee', 'numberOfStaff', 'entityPanCard', 
      'incorporationAddressLine1'
    ];
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
};

export const initialUserRequestState = {
    fromDate: '2026-04-19',
    toDate: '2026-04-19',
    userType: 'CBC',
    status: 'Approved'
};

export const validateUsername = (username) => {
    if (!username || !username.trim()) {
        return 'Username is required';
    }
    return '';
};

export const fetchDashboardData = async () => {
    const DASHBOARD_URL = 'https://services-encr.iserveu.online/dev/nsdlab-internal/user-mgmt/user/dashboard';
    const TOKEN = sessionStorage.getItem('access_token');
    
    if (!TOKEN) {
        console.error("No access token found in session.");
        return null;
    }
    try {
        const response = await fetch(DASHBOARD_URL, {
            method: 'GET',
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Dashboard API error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result && result.ResponseData) {
            try {
                const decryptedString = decryptResponseData(result.ResponseData);
                const userData = JSON.parse(decryptedString);
                console.log("Decrypted dashboard data:", userData);
                // Store user data for profile display
                sessionStorage.setItem('user_data', JSON.stringify(userData));
                return userData;
            } catch (e) {
                console.error("Failed to decrypt dashboard response:", e);
            }
        }
        return result;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return null;
    }
};

export const fetchUserDetails = async (username) => {
    const FETCH_USER_URL = 'https://apidev.iserveu.online/NSDL/user_onboarding/fetch-user-details';
    const TOKEN = sessionStorage.getItem('access_token');
    
    try {
        const response = await fetch(FETCH_USER_URL, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                userRole: username.startsWith("CBCM") ? "CBC Maker" : username.startsWith("CBC") ? "CBC" : "Agent"
            })
        });
        
        const result = await response.json();
        return { 
            status: response.status, 
            ok: response.ok, 
            data: result 
        };
    } catch (error) {
        console.error("Fetch user details API failed:", error);
        return { ok: false, error: error.message };
    }
};
export const fetchUserList = async (searchParams) => {
    const USER_LIST_URL = 'https://apidev-sdk.iserveu.online/NSDL/user_onboarding_report/fetch-user-list';
    const TOKEN = sessionStorage.getItem('access_token');
    const PASS_KEY = 'QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA';
    
    try {
        const encryptedBody = encryptData(searchParams);
        const response = await fetch(USER_LIST_URL, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
                'pass_key': PASS_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ RequestData: encryptedBody })
        });
        
        const result = await response.json();
        if (result && result.ResponseData) {
            try {
                const decryptedString = decryptResponseData(result.ResponseData);
                return JSON.parse(decryptedString);
            } catch (e) {
                console.error("Failed to decrypt user list response:", e);
            }
        }
        return result;
    } catch (error) {
        console.error("Fetch user list API failed:", error);
        return null;
    }
};
export const submitWalletAdjustment = async (payload) => {
    const ADJUSTMENT_URL = 'https://services-v2.iserveu.online/NSDLAB/wallet_topup/admin/payDebit';
    const TOKEN = sessionStorage.getItem('access_token');
    
    try {
        const response = await fetch(ADJUSTMENT_URL, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        return { 
            status: response.status, 
            ok: response.ok, 
            data: result 
        };
    } catch (error) {
        console.error("Wallet adjustment API failed:", error);
        return { ok: false, error: error.message };
    }
};

export const sendChangePasswordOtp = async (oldPassword, newPassword) => {
    const URL = 'https://bankpratinidhi.nsdlbank.co.in/NSDLAB/user-mgmt-internal/user/send-change-password-otp';
    const TOKEN = sessionStorage.getItem('access_token');
    
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });
        
        const result = await response.json().catch(() => null); // Handle non-JSON responses gracefully
        return { 
            status: response.status, 
            ok: response.ok, 
            data: result 
        };
    } catch (error) {
        console.error("Change Password OTP API failed:", error);
        return { ok: false, error: error.message };
    }
};
