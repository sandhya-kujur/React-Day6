import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    MdDashboard, 
    MdOutlineListAlt, 
    MdAccountBalanceWallet, 
    MdKeyboardDoubleArrowLeft, 
    MdKeyboardDoubleArrowRight, 
    MdPersonAdd,
    MdExpandMore,
    MdExpandLess,
    MdOutlineInsertChart
} from 'react-icons/md';
import { FaUserCog, FaFileInvoiceDollar, FaFileAlt } from 'react-icons/fa';
import bankLogo from '../../assets/bank.png';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const isDashboardActive = location.pathname === '/dashboard';
    const isUsersActive = location.pathname.startsWith('/dashboard/users');
    const isAuditActive = location.pathname.startsWith('/dashboard/audit');
    const isReportsActive = location.pathname.startsWith('/dashboard/reports');
    const isWalletActive = location.pathname.startsWith('/dashboard/wallet');
    
    const [userMenuOpen, setUserMenuOpen] = useState(isUsersActive);
    const [reportsMenuOpen, setReportsMenuOpen] = useState(isReportsActive);

    // Read userType from sessionStorage
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userType = userData?.userType || userData?.userInfo?.userType || '';
    const isMaker = userType.toLowerCase().endsWith('_maker');

    // Sync menu state when navigation section changes
    useEffect(() => {
        if (isUsersActive) setUserMenuOpen(true);
        if (isReportsActive) setReportsMenuOpen(true);
    }, [isUsersActive, isReportsActive]);

    const handleLinkClick = () => {
        if (!isUsersActive) setUserMenuOpen(false);
        if (!isReportsActive) setReportsMenuOpen(false);
    };

    const isAnyMenuOpen = userMenuOpen || reportsMenuOpen;

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <img src={bankLogo} alt="NSDL Payments Bank" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <NavLink
                    to="/dashboard"
                    end
                    className={() => (isDashboardActive && !isAnyMenuOpen) ? 'nav-item active' : 'nav-item'}
                    onClick={handleLinkClick}
                >
                    <MdDashboard className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Dashboard</span>}
                </NavLink>

                {!isCollapsed && <div className="sidebar-section-label">Widgets</div>}

                <div className="menu-group">
                    <button
                        type="button"
                        className={(userMenuOpen) ? 'nav-item active' : 'nav-item'}
                        onClick={() => {
                            setUserMenuOpen(!userMenuOpen);
                            if (!userMenuOpen) setReportsMenuOpen(false);
                        }}
                    >
                        <FaUserCog className="nav-icon" />
                        {!isCollapsed && (
                            <>
                                <span className="nav-text">Bank User Management</span>
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
                                >
                                    <MdPersonAdd className="nav-icon sub-nav-icon" />
                                    <span className="nav-text">Create User</span>
                                </NavLink>
                            )}

                            <NavLink
                                to="/dashboard/users/requests"
                                className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}
                            >
                                <FaFileInvoiceDollar className="nav-icon sub-nav-icon" />
                                <span className="nav-text">User Request</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/users/list"
                                className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}
                            >
                                <FaFileAlt className="nav-icon sub-nav-icon" />
                                <span className="nav-text">User List Report</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <NavLink
                    to="/dashboard/audit"
                    className={() => (isAuditActive && !isAnyMenuOpen) ? 'nav-item active' : 'nav-item'}
                    onClick={handleLinkClick}
                >
                    <MdOutlineListAlt className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Audit Trail</span>}
                </NavLink>

                <div className="menu-group">
                    <button
                        type="button"
                        className={(reportsMenuOpen) ? 'nav-item active' : 'nav-item'}
                        onClick={() => {
                            setReportsMenuOpen(!reportsMenuOpen);
                            if (!reportsMenuOpen) setUserMenuOpen(false);
                        }}
                    >
                        <MdOutlineInsertChart className="nav-icon" />
                        {!isCollapsed && (
                            <>
                                <span className="nav-text">Reports</span>
                                {reportsMenuOpen ? <MdExpandLess className="arrow-icon" /> : <MdExpandMore className="arrow-icon" />}
                            </>
                        )}
                    </button>
                </div>

                <NavLink
                    to="/dashboard/wallet"
                    className={() => (isWalletActive && !isAnyMenuOpen) ? 'nav-item active' : 'nav-item'}
                    onClick={handleLinkClick}
                >
                    <MdAccountBalanceWallet className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Wallet Adjustment</span>}
                </NavLink>
            </nav>

            <button
                className="collapse-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle Sidebar"
            >
                {isCollapsed ? <MdKeyboardDoubleArrowRight /> : <MdKeyboardDoubleArrowLeft />}
            </button>
        </div>
    );
};

export default Sidebar;
