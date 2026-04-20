import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdNotifications, MdArrowDropDown, MdClose, MdCheck } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { HiOutlineKey } from 'react-icons/hi';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { sendChangePasswordOtp } from '../../actions/dashboardActions';
import './Header.css';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('error');
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [userData, setUserData] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const username = sessionStorage.getItem('username') || 'Guest';

    const headerTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/dashboard/users/create')) {
            return 'User Management / Create CBC User';
        }
        if (path.startsWith('/dashboard/users/requests')) {
            return 'User Management / User Request';
        }
        if (path.startsWith('/dashboard/audit')) {
            return 'Audit Trail';
        }
        if (path.startsWith('/dashboard/wallet')) {
            return 'Wallet Adjustment';
        }
        return 'Dashboard';
    };

    // Load user data from session storage for profile
    useEffect(() => {
        const storedData = sessionStorage.getItem('user_data');
        if (storedData) {
            try {
                setUserData(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
            }
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        navigate('/');
    };

    const handleProfileClick = () => {
        // Refresh data from sessionStorage in case it was just loaded
        const storedData = sessionStorage.getItem('user_data');
        if (storedData) setUserData(JSON.parse(storedData));
        setDropdownOpen(false);
        setShowProfileModal(true);
    };

    return (
        <>
            <header className="dashboard-header">
                <div className="header-left">
                    <h1 className="header-title">{headerTitle()}</h1>
                </div>
                <div className="header-right">
                    <button className="notification-btn" aria-label="Notifications">
                        <MdNotifications />
                    </button>
                    <div className="user-profile-container" ref={dropdownRef}>
                        <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <FaUserCircle className="user-avatar" />
                            <span className="user-name">{username}</span>
                            <div className="dropdown-circle-btn">
                                <MdArrowDropDown />
                            </div>
                        </div>

                        {dropdownOpen && (
                            <div className="profile-dropdown-menu">
                                <div className="dropdown-item" onClick={handleProfileClick}>
                                    <FiUser className="dropdown-item-icon" />
                                    <span>Profile</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item" onClick={() => { setDropdownOpen(false); setShowChangePasswordModal(true); }}>
                                    <HiOutlineKey className="dropdown-item-icon" />
                                    <span>Change Password</span>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item" onClick={handleLogout}>
                                    <FiLogOut className="dropdown-item-icon" />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* User Profile Modal */}
            {showProfileModal && (
                <div className="profile-modal-overlay">
                    <div className="profile-modal-content">
                        <div className="profile-modal-header">
                            <h2>User Profile</h2>
                            <p>View personal information</p>
                        </div>

                        <div className="profile-details-grid">
                            <div className="detail-row">
                                <span className="detail-label">Name</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.firstName} {userData?.userInfo.userProfile.lastName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Phone No.</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.mobileNumber || userData?.phone || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email ID</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.email || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Address</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.address || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">State</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.state || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">User ID</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.userName || userData?.user_name || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Pan ID</span>
                                <span className="detail-value">{userData?.userInfo.userProfile.panCard || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">User Type</span>
                                <span className="detail-value">{userData?.userInfo.userType || userData?.userType || 'ROLE_OPS_CHECKER'}</span>
                            </div>
                        </div>

                        <button className="profile-modal-close-btn" onClick={() => setShowProfileModal(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <div className="profile-modal-overlay">
                    <div className="change-password-modal-content">
                        <div className="change-password-header">
                            <h2>Change Password</h2>
                            <p>Enter your old password and new password</p>
                        </div>

                        <div className="change-password-form">
                            <div className="password-input-group">
                                <input
                                    type={showPasswords.old ? "text" : "password"}
                                    placeholder="Old Password*"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                >
                                    {showPasswords.old ? <IoEye /> : <IoEyeOff />}
                                </button>
                            </div>

                            <div className="password-input-group">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    placeholder="New Password*"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                >
                                    {showPasswords.new ? <IoEye /> : <IoEyeOff />}
                                </button>
                            </div>

                            <div className="password-input-group">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    placeholder="Confirm Password*"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                >
                                    {showPasswords.confirm ? <IoEye /> : <IoEyeOff />}
                                </button>
                            </div>
                        </div>

                        <div className="change-password-actions">
                            <button className="cancel-btn" onClick={() => {
                                setShowChangePasswordModal(false);
                                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                            }}>
                                Cancel
                            </button>
                            <button className="verify-btn" onClick={async () => {
                                const { oldPassword, newPassword, confirmPassword } = passwordData;
                                if (!oldPassword || !newPassword || !confirmPassword) {
                                    setToastMessage("Please fill all password fields.");
                                    setToastType('error');
                                    setShowToast(true);
                                    return;
                                }
                                if (newPassword !== confirmPassword) {
                                    setToastMessage("New Password and Confirm Password do not match.");
                                    setToastType('error');
                                    setShowToast(true);
                                    return;
                                }

                                const result = await sendChangePasswordOtp(oldPassword, newPassword);
                                if (result.ok) {
                                    setToastMessage("OTP sent successfully!");
                                    setToastType('success');
                                    setShowToast(true);
                                    // You can trigger your OTP verification screen/logic here
                                } else {
                                    setToastMessage(result.data?.message || result.error || 'Unknown error occurred.');
                                    setToastType('error');
                                    setShowToast(true);
                                }
                            }}>
                                Verify Otp
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error/Success Toast */}
            {showToast && (
                <div className={`header-toast ${toastType}-toast`} style={{ zIndex: 2000 }}>
                    {toastType === 'success' ? <MdCheck className="toast-icon" /> : <MdClose className="toast-icon" />}
                    <span className="toast-message">{toastMessage}</span>
                    <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>Close</button>
                </div>
            )}
        </>
    );
};

export default Header;
