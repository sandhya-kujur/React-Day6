import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { handleLogin, handleLogout } from '../../actions/loginActions';
import { IoEye, IoEyeOff, IoCloseCircleOutline } from "react-icons/io5";
import { MdCheck, MdClose } from 'react-icons/md';
// Assets are commented as placeholders. Place your actual images in the src/assets folder
import nsdlLogo from '../../assets/bank.png';
import leftImage from '../../assets/nsdl_watermark.png';

const LoginPage = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
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
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'
    const [apiErrorMessage, setApiErrorMessage] = useState('');
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
                [name]: `${name === 'username' ? 'Username' : 'Password'} is required.`
            }));
        }
    };

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        
        let validationErrors = {};
        if (!formData.username) {
            validationErrors.username = 'Username is required.';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required.';
        }

        setErrors(validationErrors);

        // If no errors, proceed with login
        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            const response = await handleLogin(formData);
            setIsLoading(false);
            if (response.success) {
                sessionStorage.setItem('username', formData.username);
                // Extract and store the dynamic access token from decrypted data
                if (response.data && response.data.access_token) {
                    sessionStorage.setItem('access_token', response.data.access_token);
                }
                setToastType('success');
                setShowSuccessModal(true);
                setShowToast(true);
            } else {
                setApiErrorMessage(response.error || 'Invalid username or password.');
                setToastType('error');
                setShowErrorModal(true);
                setShowToast(true);
                setErrors(prev => ({
                    ...prev,
                    general: response.error || 'Invalid username or password.'
                }));
            }
        }
    };

    return (
        <div className="login-container">
            {/* Header containing the Logo */}
            <header className="login-header">
                <img src={nsdlLogo} alt="NSDL Payments Bank Symbol" className="logo" />
            </header>

            <div className="login-content">
                {/* Left side image/watermark section */}
                <div className="login-image-section">
                    <div className="image-placeholder">
                        <img src={leftImage} alt="Decorative" />
                    </div>
                </div>

                {/* Right side login form section */}
                <div className="login-form-section">
                    <div className="form-wrapper">
                        <h2>Welcome Back!</h2>
                        <p className="subtitle">Please enter your details</p>

                        <form onSubmit={onSubmit} noValidate>
                            {/* Username Input Field */}
                            <div className={`input-group ${formData.username ? 'filled' : ''} ${focusedField === 'username' ? 'focused' : ''} ${errors.username ? 'error' : ''}`}>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                                <label htmlFor="username" className="input-label">Username*</label>
                                {errors.username && <div className="error-message">{errors.username}</div>}
                            </div>

                            {/* Password Input Field with toggle visibility */}
                            <div className={`input-group password-group ${formData.password ? 'filled' : ''} ${focusedField === 'password' ? 'focused' : ''} ${errors.password ? 'error' : ''}`}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                />
                                <label htmlFor="password" className="input-label">Password*</label>
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <IoEye /> : <IoEyeOff />}
                                </button>
                                {errors.password && <div className="error-message">{errors.password}</div>}
                            </div>

                            {/* Remember Me and Forgot Password Links */}
                            <div className="form-actions">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    Remember me
                                </label>
                                <a href="#forgot" className="forgot-password">Forgot Password?</a>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="login-button" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                                {isLoading ? 'Please wait...' : 'Login'}
                            </button>
                            
                            {/* General Error Message from API */}
                            {errors.general && (
                                <div className="error-message" style={{ textAlign: 'center', marginTop: '16px', marginLeft: 0 }}>
                                    {errors.general}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            {showToast && (
                <div className={`login-toast ${toastType}-toast`}>
                    {toastType === 'success' ? <MdCheck className="toast-icon" /> : <MdClose className="toast-icon" />}
                    <span className="toast-message">{toastType === 'success' ? 'Login Successful!!' : apiErrorMessage}</span>
                    <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>Close</button>
                </div>
            )}

            {/* Success Modal Overlay */}
            {showSuccessModal && (
                <div className="login-modal-overlay">
                    <div className="login-success-modal">
                        <h3>Congratulations!!! Login Successfull</h3>
                        <div className="modal-actions">
                            <button type="button" className="modal-btn-ok" onClick={() => navigate('/dashboard')}>OK</button>
                            <button type="button" className="modal-btn-no" onClick={async () => { 
                                await handleLogout();
                                setShowSuccessModal(false); 
                                setShowToast(false); 
                            }}>NO</button>
                        </div>
                    </div>
                </div>
            )}

            {showErrorModal && (
                <div className="login-modal-overlay">
                    <div className="login-error-modal">
                        <button className="modal-close-x" onClick={() => setShowErrorModal(false)}>
                            <MdClose />
                        </button>
                        <div className="error-icon-wrapper">
                            <IoCloseCircleOutline className="error-circle-icon" />
                            <span className="error-status-text">FAILED</span>
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
