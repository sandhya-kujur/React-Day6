import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown, FiDownload, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { MdCalendarToday, MdClose, MdCheck } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { TiArrowUnsorted } from 'react-icons/ti';
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
    const [selectedItems, setSelectedItems] = useState(new Set([3])); // Default select ID 3 as per screenshot

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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(6);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [goToPage, setGoToPage] = useState('9');
    const totalPages = 50; // As per screenshot

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSearchChange = (e) => setUsername(e.target.value);
    
    const handleDownloadExcel = () => {
        const dataToExport = searchResults.length > 0 ? searchResults : [dummyRow];
        const headers = ["S. No.", "Username", "Employee ID", "Employee Name", "User Role", "Email ID", "Updated By", "Updated On", "Status", "Operation Type", "Created By", "Creation Date", "Mobile Number", "Remarks"];
        
        const csvContent = [
            headers.join(","),
            ...dataToExport.map((row, index) => [
                index + 1,
                row.username,
                row.empId,
                row.empName,
                row.role,
                row.email,
                row.updatedBy,
                row.updatedOn,
                row.status,
                row.opType,
                row.createdBy,
                row.creationDate,
                row.mobile,
                row.remarks
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `User_Requests_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        // Sorting logic would go here for real data
    };

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

    const handleSelectItem = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = displayData.map(item => item.id);
            setSelectedItems(new Set(allIds));
        } else {
            setSelectedItems(new Set());
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
            const trimmedUsername = username.trim();
            if (!trimmedUsername) {
                setUsernameError('Username is required');
                return;
            }
            payload = {
                username: trimmedUsername,
                role: (trimmedUsername.startsWith("CBCM") || trimmedUsername.toLowerCase().endsWith("_maker")) 
                    ? "CBC Maker" 
                    : (trimmedUsername.startsWith("CBC") || trimmedUsername.toLowerCase().endsWith("_checker")) 
                        ? "CBC" 
                        : "Retailer"
            };
        }

        const result = await fetchUserList(payload);

        if (result && result.success) {
            // Mapping the specific nested structure provided: result.data.resultObj.result
            const apiResult = result.data.resultObj?.result || [];
            console.log("Mapping API Data:", apiResult);
            
            const mappedResults = apiResult.map((item, index) => {
                const info1 = item["1"] || {};
                const info2 = item["2"] || {};
                const info3 = item["3"] || {};
                const info5 = item["5"] || {};

                return {
                    id: item._id || `api-${index}`,
                    username: item.username || 'N/A',
                    userType: item.userRole === 'ROLE_ADMIN' ? 'Admin' : (item.userRole || 'User'),
                    firstName: info1.firstName || 'N/A',
                    lastName: info1.lastName || 'N/A',
                    dateCreated: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'N/A',
                    createdBy: item.createdBy || 'N/A',
                    updatedDate: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-GB') : 'N/A',
                    updatedBy: item.updatedBy || 'N/A',
                    mobile: info1.mobileNumber || 'N/A',
                    email: info1.email || 'N/A',
                    parentUsername: item.superAdmin || 'N/A',
                    cbcName: item.createdBy || 'N/A',
                    mdsName: 'N/A',
                    dsName: 'N/A',
                    address: `${info1.city || ''}, ${info1.state || ''}`.trim() || 'N/A',
                    role: item.userRole || 'N/A',
                    status: item.status || 'N/A',
                    updatedStatus: 'Select',
                    updatePhone: info1.mobileNumber || 'N/A',
                    updateEmail: info1.email || 'N/A',
                    action: 'Update'
                };
            });

            setSearchResults(mappedResults);
            setShowToast(false);
        } else {
            const errorMsg = result?.msg || "Failed to fetch user list";
            setToastMessage(errorMsg);
            setToastType('error');
            setShowToast(true);
        }
    };

    // Expanded dummy data from latest screenshot
    const dummyRows = [
        {
            id: 1,
            username: 'Carson Darrin',
            userType: 'Maker',
            firstName: 'Krishna',
            lastName: 'Das',
            dateCreated: '19/06/2024',
            createdBy: 'Carson',
            updatedDate: '19/06/2024',
            updatedBy: 'Carson',
            mobile: '8096238119',
            email: 'krishna@gmail.com',
            parentUsername: 'Krishna Das',
            cbcName: 'Krishna Das',
            mdsName: 'Krishna Das',
            dsName: 'Krishna Das',
            address: 'Krishna Das',
            role: 'Maker',
            status: 'Active',
            updatedStatus: 'Select',
            updatePhone: '+91 9383764393',
            updateEmail: 'johndoe@gmail.com',
            action: 'Update'
        },
        {
            id: 2,
            username: 'Ashy Handgun',
            userType: 'Maker',
            firstName: 'Krishna',
            lastName: 'Das',
            dateCreated: '19/06/2024',
            createdBy: 'Ashy',
            updatedDate: '19/06/2024',
            updatedBy: 'Ashy',
            mobile: '8096238119',
            email: 'krishna@gmail.com',
            parentUsername: 'Krishna Das',
            cbcName: 'Krishna Das',
            mdsName: 'Krishna Das',
            dsName: 'Krishna Das',
            address: 'Krishna Das',
            role: 'Checker',
            status: 'Active',
            updatedStatus: 'Select',
            updatePhone: '+91 9383764393',
            updateEmail: 'johndoe@gmail.com',
            action: 'Update'
        },
        {
            id: 3,
            username: 'Ashy Handgun',
            userType: 'Maker',
            firstName: 'Krishna',
            lastName: 'Das',
            dateCreated: '19/06/2024',
            createdBy: 'Ashy',
            updatedDate: '19/06/2024',
            updatedBy: 'Ashy',
            mobile: '8096238119',
            email: 'krishna@gmail.com',
            parentUsername: 'Krishna Das',
            cbcName: 'Krishna Das',
            mdsName: 'Krishna Das',
            dsName: 'Krishna Das',
            address: 'Krishna Das',
            role: 'Checker',
            status: 'Active',
            updatedStatus: 'Select',
            updatePhone: '+91 9383764393',
            updateEmail: 'johndoe@gmail.com',
            action: 'Update'
        }
    ];

    const displayData = searchResults.length > 0 ? searchResults : dummyRows;
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
                    {searchType === 'userName' ? (
                        <div className="username-search-group">
                            <div className="username-search-large">
                                <FiSearch className="large-search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search by User Name" 
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </div>
                            <button className="submit-action-btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    ) : (
                        <>
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
                                        {(isMaker ? ['CBC'] : ['Bank User', 'CBC', 'CBC Maker', 'MDS', 'DS', 'Agent']).map(opt => (
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

                            <button className="download-excel-btn" onClick={handleDownloadExcel}>
                                <FiDownload /> Download Sample File
                            </button>
                        </>
                    )}
                </div>

                <div className="table-container">
                    <table className="user-request-table">
                        <thead>
                            <tr>
                                <th>
                                    <input 
                                        type="checkbox" 
                                        onChange={handleSelectAll}
                                        checked={displayData.length > 0 && selectedItems.size === displayData.length}
                                    />
                                </th>
                                <th>User Name <TiArrowUnsorted /></th>
                                <th>User Type <TiArrowUnsorted /></th>
                                <th>First Name <TiArrowUnsorted /></th>
                                <th>Last Name <TiArrowUnsorted /></th>
                                <th>Date Created <TiArrowUnsorted /></th>
                                <th>Created By <TiArrowUnsorted /></th>
                                <th>Updated Date <TiArrowUnsorted /></th>
                                <th>Updated By <TiArrowUnsorted /></th>
                                <th>Mobile No. <TiArrowUnsorted /></th>
                                <th>Email ID <TiArrowUnsorted /></th>
                                <th>Parent Username <TiArrowUnsorted /></th>
                                <th>CBC Name <TiArrowUnsorted /></th>
                                <th>MDS Name <TiArrowUnsorted /></th>
                                <th>DS Name <TiArrowUnsorted /></th>
                                <th>Address <TiArrowUnsorted /></th>
                                <th>Role <TiArrowUnsorted /></th>
                                <th>Status <TiArrowUnsorted /></th>
                                <th>Updated Status <TiArrowUnsorted /></th>
                                <th>Update Phone <TiArrowUnsorted /></th>
                                <th>Update Email <TiArrowUnsorted /></th>
                                <th>Action <TiArrowUnsorted /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedItems.has(item.id)} 
                                            onChange={() => handleSelectItem(item.id)} 
                                        />
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <FaUserCircle className="user-avatar" />
                                            {item.username}
                                        </div>
                                    </td>
                                    <td>{item.userType}</td>
                                    <td>{item.firstName}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.dateCreated}</td>
                                    <td>{item.createdBy}</td>
                                    <td>{item.updatedDate}</td>
                                    <td>{item.updatedBy}</td>
                                    <td>{item.mobile}</td>
                                    <td>{item.email}</td>
                                    <td>{item.parentUsername}</td>
                                    <td>{item.cbcName}</td>
                                    <td>{item.mdsName}</td>
                                    <td>{item.dsName}</td>
                                    <td>{item.address}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <span className="status-badge active">{item.status}</span>
                                    </td>
                                    <td>
                                        <div className="table-select-wrapper">
                                            <select defaultValue="Select">
                                                <option>Select</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>{item.updatePhone}</td>
                                    <td>{item.updateEmail}</td>
                                    <td className="action-cell-update">
                                        {item.action}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-footer">
                    <div className="pagination-left">
                        <div className="rows-selector">
                            Row per page 
                            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                        
                        <div className="go-to-page">
                            Go to 
                            <input 
                                type="text" 
                                value={goToPage} 
                                onChange={(e) => setGoToPage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const page = parseInt(goToPage);
                                        if (page > 0 && page <= totalPages) setCurrentPage(page);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="pagination-controls">
                        <button 
                            className="page-arrow" 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <FiChevronLeft />
                        </button>
                        
                        <button className={`page-number ${currentPage === 1 ? 'active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
                        
                        {currentPage > 4 && <span className="page-dots">...</span>}
                        
                        {[currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2].map(num => (
                            num > 1 && num < totalPages && (
                                <button 
                                    key={num} 
                                    className={`page-number ${currentPage === num ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(num)}
                                >
                                    {num}
                                </button>
                            )
                        ))}
                        
                        {currentPage < totalPages - 3 && <span className="page-dots">...</span>}
                        
                        <button className={`page-number ${currentPage === totalPages ? 'active' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                        
                        <button 
                            className="page-arrow" 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <FiChevronRight />
                        </button>
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="toast-container">
                    <div className={toastType === 'success' ? "success-popup-toast" : "error-popup-toast"}>
                        {toastType === 'success' ? <MdCheck className="toast-icon" /> : <FiX className="toast-icon" />}
                        <span className="toast-message">{toastMessage}</span>
                        <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>
                            CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserRequest;
