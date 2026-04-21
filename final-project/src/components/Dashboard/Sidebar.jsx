import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    MdKeyboardDoubleArrowLeft, 
    MdKeyboardDoubleArrowRight, 
    MdExpandMore,
    MdExpandLess,
    MdAccountBalanceWallet
} from 'react-icons/md';
import { FaUsersCog } from 'react-icons/fa';
import { IoSpeedometerOutline, IoDocumentTextOutline } from 'react-icons/io5';
import bankLogo from '../../assets/bank.png';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [visualActive, setVisualActive] = useState('');
    
    // Read username and userType from sessionStorage
    const storedUsername = sessionStorage.getItem('username') || '';
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userType = userData?.userType || userData?.userInfo?.userType || '';
    
    // Check if user is a Maker (for showing Create User)
    const isMaker = storedUsername.toLowerCase().endsWith('_maker') || userType.toLowerCase().endsWith('_maker');
    // Check if user is a Checker (for restricting to User Request only)
    const isChecker = storedUsername.toLowerCase().endsWith('_checker');

    // Sync menu state and visual active state when navigation section changes
    useEffect(() => {
        const path = location.pathname;
        if (path.startsWith('/dashboard/users')) {
            setVisualActive('users');
            setUserMenuOpen(true);
        } else if (path === '/dashboard') {
            setVisualActive('dashboard');
            setUserMenuOpen(false);
        } else if (path.startsWith('/dashboard/audit')) {
            setVisualActive('audit');
            setUserMenuOpen(false);
        } else if (path.startsWith('/dashboard/wallet')) {
            setVisualActive('wallet');
            setUserMenuOpen(false);
        }
    }, [location.pathname]);

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <img src={bankLogo} alt="NSDL Payments Bank" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    end
                    className={() => visualActive === 'dashboard' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setVisualActive('dashboard')}
                >
                    <IoSpeedometerOutline className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Dashboard</span>}
                </NavLink>

                {!isCollapsed && <div className="sidebar-section-label">Widgets</div>}

                <div className="menu-group">
                    <button
                        type="button"
                        className={visualActive === 'users' ? 'nav-item active' : 'nav-item'}
                        onClick={() => {
                            setUserMenuOpen(!userMenuOpen);
                            setVisualActive('users');
                        }}
                    >
                        <FaUsersCog className="nav-icon" />
                        {!isCollapsed && (
                            <>
                                <span className="nav-text">User Management</span>
                                {userMenuOpen ? <MdExpandLess className="arrow-icon" /> : <MdExpandMore className="arrow-icon" />}
                            </>
                        )}
                    </button>

                    {userMenuOpen && !isCollapsed && (
                        <div className="sub-menu">
                            {isMaker && (
                                <NavLink
                                    to="/dashboard/users/create"
                                    className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}
                                    onClick={() => setVisualActive('users')}
                                >
                                    <span className="nav-text">Create CBC User</span>
                                </NavLink>
                            )}

                            <NavLink
                                to="/dashboard/users/requests"
                                className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}
                                onClick={() => setVisualActive('users')}
                            >
                                <span className="nav-text">User Request</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/dashboard/audit"
                    className={() => visualActive === 'audit' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setVisualActive('audit')}
                >
                    <IoDocumentTextOutline className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Audit Trail</span>}
                </NavLink>

                <NavLink
                    to="/dashboard/wallet"
                    className={() => visualActive === 'wallet' ? 'nav-item active' : 'nav-item'}
                    onClick={() => setVisualActive('wallet')}
                >
                    <MdAccountBalanceWallet className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Wallet Adjustment</span>}
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
