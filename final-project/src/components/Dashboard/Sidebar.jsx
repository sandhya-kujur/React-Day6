import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdDashboard, MdHistory, MdAccountBalanceWallet, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdPersonAdd } from 'react-icons/md';
import { FaUserCog, FaFileInvoiceDollar } from 'react-icons/fa';
import bankLogo from '../../assets/bank.png';
import './Sidebar.css';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const [userMenuOpen, setUserMenuOpen] = React.useState(location.pathname.startsWith('/dashboard/users'));
    const isUsersActive = location.pathname.startsWith('/dashboard/users');

    React.useEffect(() => {
        setUserMenuOpen(isUsersActive);
    }, [isUsersActive, location.pathname]);

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <img src={bankLogo} alt="NSDL Payments Bank" className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                <NavLink 
                    to="/dashboard" 
                    end 
                    className={({ isActive }) => (isActive && !userMenuOpen) ? 'nav-item active' : 'nav-item'}
                >
                    <MdDashboard className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Dashboard</span>}
                </NavLink>

                <button
                    type="button"
                    className={(isUsersActive || userMenuOpen) ? 'nav-item active' : 'nav-item'}
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                >
                    <FaUserCog className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">User Management</span>}
                </button>

                {/* Sub Menu */}
                {userMenuOpen && !isCollapsed && (
                        <div className="sub-menu">
                            <NavLink to="/dashboard/users/create" className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}>
                                <MdPersonAdd className="nav-icon sub-nav-icon" />
                                <span className="nav-text">Create CBC User</span>
                            </NavLink>
                            
                            <NavLink to="/dashboard/users/requests" className={({ isActive }) => isActive ? 'sub-nav-item active' : 'sub-nav-item'}>
                                <FaFileInvoiceDollar className="nav-icon sub-nav-icon" />
                                <span className="nav-text">User Request</span>
                            </NavLink>
                        </div>
                    )}

                <NavLink to="/dashboard/audit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <MdHistory className="nav-icon" />
                    {!isCollapsed && <span className="nav-text">Audit Trail</span>}
                </NavLink>

                <NavLink to="/dashboard/wallet" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
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
