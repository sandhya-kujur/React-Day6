import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { handleLogin, handleLogout, sendForgotPasswordOtp, verifyOtpAndSendTempPassword } from '../../actions/loginActions';
import { IoEye, IoEyeOff, IoCloseCircleOutline } from "react-icons/io5";
import { MdCheck, MdClose } from 'react-icons/md';
import nsdlLogo from '../../assets/bank.png';

const LoginPage = () => {
    // view state: 'login' or 'forgot'
    const [view, setView] = useState('login');
    
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        mobileNumber: '',
        otp: '',
        rememberMe: false
    });

    // State for validation errors
    const [errors, setErrors] = useState({});

    // State for loading status
    const [isLoading, setIsLoading] = useState(false);

    // State for modals/toast
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('success'); 
    const [apiErrorMessage, setApiErrorMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle input focus
    const handleFocus = (e) => {
        setFocusedField(e.target.name);
    };

    // Handle input blur for real-time validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFocusedField(null);
        if (!value) {
            setErrors(prev => ({
                ...prev,
                [name]: `${name === 'username' ? 'Username' : name === 'password' ? 'Password' : 'Mobile Number'} is required.`
            }));
        }
    };

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (view === 'login') {
            let validationErrors = {};
            if (!formData.username) {
                validationErrors.username = 'Username is required.';
            }
            if (!formData.password) {
                validationErrors.password = 'Password is required.';
            }

            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                setIsLoading(true);
                const response = await handleLogin(formData);
                setIsLoading(false);
                if (response.success) {
                    sessionStorage.setItem('username', formData.username);
                    if (response.data && response.data.access_token) {
                        sessionStorage.setItem('access_token', response.data.access_token);
                    }
                    setToastType('success');
                    setToastMessage('Login Successful!!');
                    setShowSuccessModal(true);
                    setShowToast(true);
                } else {
                    const errorMsg = response.error || 'Invalid Username or Password. You have 2 attempt(s) remaining';
                    setApiErrorMessage(errorMsg);
                    setToastMessage(errorMsg);
                    setToastType('error');
                    setShowErrorModal(true);
                    setShowToast(true);
                    setErrors(prev => ({
                        ...prev,
                        general: response.error || 'Invalid username or password.'
                    }));
                }
            }
        } else if (view === 'forgot') {
            if (!formData.username) {
                setErrors({ username: 'Username is required.' });
                return;
            }
            setIsLoading(true);
            const response = await sendForgotPasswordOtp(formData.username.trim());
            setIsLoading(false);

            if (response.ok && (response.data.status === 'Success' || response.data.status === 'SUCCESS')) {
                setToastType('success');
                setToastMessage(response.data.statusDesc || response.data.message || 'OTP sent successfully!');
                setShowToast(true);
                setView('otp');
            } else {
                setApiErrorMessage(response.data.statusDesc || response.data.message || 'Failed to send OTP.');
                setShowErrorModal(true);
            }
        } else if (view === 'otp') {
            if (!formData.otp) {
                setErrors({ otp: 'OTP is required.' });
                return;
            }
            setIsLoading(true);
            const response = await verifyOtpAndSendTempPassword({
                userName: formData.username.trim(),
                otp: formData.otp
            });
            setIsLoading(false);

            if (response.ok && (response.data.status === 'Success' || response.data.status === 'SUCCESS')) {
                setToastType('success');
                setToastMessage(response.data.statusDesc || 'OTP Verified successfully!');
                setShowToast(true);
                setTimeout(() => {
                    setView('login');
                    setShowToast(false);
                }, 3000);
            } else {
                setToastType('error');
                setToastMessage(response.data.statusDesc || response.data.message || 'OTP Verification failed.');
                setShowToast(true);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-form-section">
                    <div className="form-wrapper">
                        <img src={nsdlLogo} alt="NSDL Payments Bank" className="logo" />
                        
                        {view === 'login' ? (
                            <>
                                <h2>Login to your Account</h2>

                                <form onSubmit={onSubmit} noValidate>
                                    <div className={`input-group ${focusedField === 'username' ? 'focused' : ''} ${errors.username ? 'error' : ''}`}>
                                        <label className="input-label">Username</label>
                                        <input
                                            id="username"
                                            type="text"
                                            name="username"
                                            placeholder="Enter your Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {errors.username && <div className="error-message">{errors.username}</div>}
                                    </div>

                                    <div className={`input-group password-group ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
                                        <label className="input-label">Password</label>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        <button 
                                            type="button" 
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <IoEyeOff /> : <IoEye />}
                                        </button>
                                        {errors.password && <div className="error-message">{errors.password}</div>}
                                    </div>

                                    <div className="form-actions">
                                        <label className="remember-me">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={formData.rememberMe}
                                                onChange={handleChange}
                                            />
                                            Remember Me
                                        </label>
                                        <span onClick={() => setView('forgot')} className="forgot-password" style={{cursor: 'pointer'}}>Forgot Password?</span>
                                    </div>

                                    <button type="submit" className="login-button" disabled={isLoading}>
                                        {isLoading ? 'Please wait...' : 'Login'}
                                    </button>
                                </form>
                            </>
                        ) : view === 'forgot' ? (
                            <>
                                <h2>Forgot Password</h2>
                                <p className="forgot-description">
                                    Lost your password? No worries. Enter your Username, and we'll help you reset it .
                                </p>

                                <form onSubmit={onSubmit} noValidate>
                                    <div className={`input-group ${focusedField === 'username' ? 'focused' : ''} ${errors.username ? 'error' : ''}`}>
                                        <label className="input-label">Username</label>
                                        <input
                                            id="username-forgot"
                                            type="text"
                                            name="username"
                                            placeholder="Please enter your Username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            required
                                        />
                                        {errors.username && <div className="error-message">{errors.username}</div>}
                                    </div>

                                    <button type="submit" className="login-button" style={{marginTop: '10px'}} disabled={isLoading}>
                                        {isLoading ? 'Sending...' : 'Send OTP'}
                                    </button>

                                    <div className="forgot-footer-link">
                                        Remembered Password? <span onClick={() => setView('login')} className="red-link">Log In</span>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2>Phone Verification</h2>
                                <p className="forgot-description">
                                    To ensure your account security, please verify your Mobile Number by entering the OTP (One-Time Password) sent to your mobile device.
                                </p>

                                <form onSubmit={onSubmit} noValidate>
                                    <div className={`input-group ${focusedField === 'otp' ? 'focused' : ''} ${errors.otp ? 'error' : ''}`}>
                                        <label className="input-label">OTP</label>
                                        <input
                                            id="otp-input"
                                            type="text"
                                            name="otp"
                                            placeholder="Please enter OTP"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            maxLength={6}
                                            required
                                        />
                                        {errors.otp && <div className="error-message">{errors.otp}</div>}
                                    </div>

                                    <button type="submit" className="login-button" style={{marginTop: '10px'}} disabled={isLoading}>
                                        {isLoading ? 'Verifying...' : 'Verify'}
                                    </button>

                                    <div className="forgot-footer-link" style={{marginTop: '25px'}}>
                                        Remembered Password? <span onClick={() => setView('login')} className="red-link">Log In</span>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <footer className="login-footer">
                <a href="#terms" className="footer-link">Terms and Conditions</a>
                <a href="#privacy" className="footer-link">Privacy Policy</a>
                <a href="#notice" className="footer-link">CA Privacy Notice</a>
            </footer>

            {/* Success Toast */}
            {showToast && (
                <div className={`login-toast ${toastType}-toast`}>
                    {toastType === 'success' ? <MdCheck className="toast-icon" /> : <MdClose className="toast-icon" />}
                    <span className="toast-message">{toastMessage}</span>
                    <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>Close</button>
                </div>
            )}

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="login-modal-overlay">
                    <div className="login-success-modal">
                        <h3 className="modal-title">Congratulations!!! Login Successfull</h3>
                        <div className="modal-actions-success">
                            <button type="button" className="modal-btn-ok-red" onClick={() => navigate('/dashboard')}>OK</button>
                            <button type="button" className="modal-btn-no-outline" onClick={async () => { 
                                await handleLogout();
                                setShowSuccessModal(false); 
                                setShowToast(false); 
                            }}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="login-modal-overlay">
                    <div className="login-error-modal">
                        <button className="modal-close-x" onClick={() => setShowErrorModal(false)}>
                            <MdClose />
                        </button>
                        <div className="error-icon-wrapper">
                            <IoCloseCircleOutline className="error-circle-icon" />
                            <div className="error-status-text">FAILED</div>
                        </div>
                        <p className="error-detail-text">{apiErrorMessage}</p>
                        <button type="button" className="modal-btn-okay" onClick={() => { setShowErrorModal(false); setShowToast(false); }}>Okay</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
