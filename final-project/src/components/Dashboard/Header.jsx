import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdNotifications, MdArrowDropDown } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { HiOutlineKey } from 'react-icons/hi';
import './Header.css';

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

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

    // Close dropdown if clicked outside
    useEffect(() => {
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

    return (
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
                        <span className="user-name">OPSMISU</span>
                        <div className="dropdown-circle-btn">
                            <MdArrowDropDown />
                        </div>
                    </div>
                    
                    {dropdownOpen && (
                        <div className="profile-dropdown-menu">
                            <div className="dropdown-item">
                                <FiUser className="dropdown-item-icon" />
                                <span>Profile</span>
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item">
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
    );
};

export default Header;
