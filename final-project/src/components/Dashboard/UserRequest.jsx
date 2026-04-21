import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiDownload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdCalendarToday, MdSwapVert, MdClose, MdCheck } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import CustomDatePicker from './CustomDatePicker';
import { fetchUserList } from '../../actions/dashboardActions';
import './UserRequest.css';

const UserRequest = () => {
    // --- Original Logic States ---
    const [searchType, setSearchType] = useState('dateRange');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('error');
    const [searchResults, setSearchResults] = useState([]);

    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const sessionUserType = userData?.userType || userData?.userInfo?.userType || '';
    const isMaker = sessionUserType.toLowerCase().endsWith('_maker');

    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        userType: isMaker ? 'CBC' : 'User Type',
        status: 'Status'
    });

    const [isUserTypeOpen, setIsUserTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    // --- Original Logic Handlers ---
    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setIsUserTypeOpen(false);
        setIsStatusOpen(false);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsTouched(true);
        if (!username.trim()) {
            setUsernameError('Username is required');
        } else {
            setUsernameError('');
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (isTouched) {
            if (!e.target.value.trim()) {
                setUsernameError('Username is required');
            } else {
                setUsernameError('');
            }
        }
    };

    const handleSubmit = async () => {
        const loggedInUser = sessionStorage.getItem('username') || 'Guest';
        let payload = {};

        if (searchType === 'dateRange') {
            payload = {
                status: formData.status === 'Status' ? 'ALL' : formData.status.toUpperCase(),
                username: loggedInUser,
                startDate: formData.fromDate,
                endDate: formData.toDate,
                role: formData.userType === 'User Type' ? 'ALL' : formData.userType
            };
        } else {
            if (!username.trim()) {
                setUsernameError('Username is required');
                return;
            }
            payload = {
                username: username,
                role: username.startsWith("CBCM") ? "CBC Maker" : username.startsWith("CBC") ? "CBC" : "Retailer"
            };
        }

        const result = await fetchUserList(payload);
        
        if (result && (result.status === 200 || result.status === "SUCCESS")) {
            setSearchResults(result.data || []);
            setShowToast(false);
        } else {
            const errorMsg = result?.msg || result?.message || "Failed to fetch user list";
            setToastMessage(errorMsg);
            setToastType('error');
            setShowToast(true);
        }
    };

    // Dummy data fallback
    const displayData = searchResults.length > 0 ? searchResults : [
        { id: 1, date: '12.05.2025', createdBy: 'Carson Darrin', email: 'johndoe@gmail.co', empId: 'EMP92198', empName: 'Carson Darrin', mobile: '+91 9238732872' },
        { id: 2, date: '12.05.2025', createdBy: 'Ashy Handgun', email: 'johndoe@gmail.co', empId: 'EMP92198', empName: 'Ashy Handgun', mobile: '+91 9238732872' },
        { id: 3, date: '12.05.2025', createdBy: 'Larry Doe', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Larry Doe', mobile: '+91 9238732872' },
        { id: 4, date: '12.05.2025', createdBy: 'Carson Darrin', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Carson Darrin', mobile: '+91 9238732872' },
        { id: 5, date: '12.05.2025', createdBy: 'Sara Soudan', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Sara Soudan', mobile: '+91 9238732872' },
        { id: 6, date: '12.05.2025', createdBy: 'Joseph William', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Joseph William', mobile: '+91 9238732872' },
        { id: 7, date: '12.05.2025', createdBy: 'Penjani Inyene', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Penjani Inyene', mobile: '+91 9238732872' },
        { id: 8, date: '12.05.2025', createdBy: 'Omar Darobe', email: 'johndoe@gmail.com', empId: 'EMP92198', empName: 'Omar Darobe', mobile: '+91 9238732872' },
    ];

    return (
        <div className="user-request-page">
            <div className="breadcrumb">
                <span>Bank User Management</span> / <span className="active-breadcrumb">User Request</span>
            </div>

            <h1 className="page-title">User Request</h1>

            <div className="request-card">
                <div className="search-mode-selector">
                    <label className="mode-option">
                        <input 
                            type="radio" 
                            name="searchMode" 
                            checked={searchType === 'dateRange'} 
                            onChange={() => setSearchType('dateRange')} 
                        />
                        <span className="radio-custom"></span>
                        Search by Date Range
                    </label>
                    <label className="mode-option">
                        <input 
                            type="radio" 
                            name="searchMode" 
                            checked={searchType === 'userName'} 
                            onChange={() => setSearchType('userName')} 
                        />
                        <span className="radio-custom"></span>
                        Search by User Name
                    </label>
                </div>

                <div className="filter-toolbar">
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search here" 
                            value={username}
                            onChange={handleUsernameChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>

                    <div className="unified-date-picker">
                        <div className="date-pick-item">
                            <CustomDatePicker 
                                selectedDate={formData.fromDate}
                                onChange={(date) => handleDateChange('fromDate', date)}
                                placeholder="Start date"
                            />
                        </div>
                        <span className="date-arrow">→</span>
                        <div className="date-pick-item">
                            <CustomDatePicker 
                                selectedDate={formData.toDate}
                                onChange={(date) => handleDateChange('toDate', date)}
                                placeholder="End date"
                            />
                        </div>
                        <MdCalendarToday className="unified-calendar-icon" />
                    </div>

                    <div className="dropdown-wrapper">
                        <div className="dropdown-header" onClick={() => setIsUserTypeOpen(!isUserTypeOpen)}>
                            <span>{formData.userType}</span>
                            <FiChevronDown className={isUserTypeOpen ? 'open' : ''} />
                        </div>
                        {isUserTypeOpen && (
                            <div className="dropdown-menu">
                                {(isMaker ? ['CBC'] : ['Bank User', 'CBC', 'CBC Maker', 'MDS', 'DS', 'Agent', 'ALL']).map(opt => (
                                    <div 
                                        key={opt} 
                                        className={`dropdown-item ${formData.userType === opt ? 'selected' : ''}`}
                                        onClick={() => handleSelectChange('userType', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-wrapper">
                        <div className="dropdown-header" onClick={() => setIsStatusOpen(!isStatusOpen)}>
                            <span>{formData.status}</span>
                            <FiChevronDown className={isStatusOpen ? 'open' : ''} />
                        </div>
                        {isStatusOpen && (
                            <div className="dropdown-menu">
                                {['Approved', 'Pending', 'Rejected', 'ALL'].map(opt => (
                                    <div 
                                        key={opt} 
                                        className={`dropdown-item ${formData.status === opt ? 'selected' : ''}`}
                                        onClick={() => handleSelectChange('status', opt)}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="submit-action-btn" onClick={handleSubmit}>
                        Submit
                    </button>
                    
                    <button className="download-excel-btn">
                        <FiDownload /> Download Excel
                    </button>
                </div>

                <div className="table-container">
                    <table className="user-request-table">
                        <thead>
                            <tr>
                                <th>S. No. <MdSwapVert /></th>
                                <th>Created Date <MdSwapVert /></th>
                                <th>Created By <MdSwapVert /></th>
                                <th>Email ID <MdSwapVert /></th>
                                <th>Employee ID <MdSwapVert /></th>
                                <th>Employee Name <MdSwapVert /></th>
                                <th>Mobile Number <MdSwapVert /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((row, index) => (
                                <tr key={row.id || index}>
                                    <td>{index + 1}</td>
                                    <td>{row.date || row.createdDate || 'N/A'}</td>
                                    <td>
                                        <div className="user-cell">
                                            <FaUserCircle className="user-avatar" />
                                            {row.createdBy || row.creatorName || 'N/A'}
                                        </div>
                                    </td>
                                    <td>{row.email || 'N/A'}</td>
                                    <td>{row.empId || 'N/A'}</td>
                                    <td>
                                        <div className="user-cell">
                                            <FaUserCircle className="user-avatar" />
                                            {row.empName || row.employeeName || 'N/A'}
                                        </div>
                                    </td>
                                    <td>{row.mobile || row.mobileNumber || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-footer">
                    <div className="rows-selector">
                        Row per page 
                        <select defaultValue="10">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    
                    <div className="go-to-page">
                        Go to <input type="text" defaultValue="9" />
                    </div>

                    <div className="pagination-controls">
                        <button className="page-arrow"><FiChevronLeft /></button>
                        <button className="page-number">1</button>
                        <span className="page-dots">...</span>
                        <button className="page-number">4</button>
                        <button className="page-number">5</button>
                        <button className="page-number active">6</button>
                        <button className="page-number">7</button>
                        <button className="page-number">8</button>
                        <span className="page-dots">...</span>
                        <button className="page-number">50</button>
                        <button className="page-arrow"><FiChevronRight /></button>
                    </div>
                </div>
            </div>

            {showToast && (
                <div className={`wallet-toast ${toastType}-toast`} style={{ zIndex: 3000 }}>
                    {toastType === 'success' ? <MdCheck className="toast-icon" /> : <MdClose className="toast-icon" />}
                    <span className="toast-message">{toastMessage}</span>
                    <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default UserRequest;
