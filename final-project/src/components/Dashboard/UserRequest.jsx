import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import CustomDatePicker from './CustomDatePicker';
import './UserRequest.css';
import '../LoginPage/LoginPage.css'; // Reuse some layout logic if needed, or just icons

const UserRequest = () => {
    const [searchType, setSearchType] = useState('dateRange');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const [formData, setFormData] = useState({
        fromDate: '2026-04-19',
        toDate: '2026-04-19',
        userType: 'CBC',
        status: 'Approved'
    });

    const [isUserTypeOpen, setIsUserTypeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

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

    return (
        <div className="user-request-container">
            <div className="search-card">
                <div className="radio-group">
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            name="searchType" 
                            value="dateRange" 
                            checked={searchType === 'dateRange'}
                            onChange={() => setSearchType('dateRange')}
                        />
                        <span className="custom-radio"></span>
                        Search by Date Range
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio" 
                            name="searchType" 
                            value="userName" 
                            checked={searchType === 'userName'}
                            onChange={() => setSearchType('userName')}
                        />
                        <span className="custom-radio"></span>
                        Search by User Name
                    </label>
                </div>

                {searchType === 'dateRange' ? (
                    <div className="search-form">
                        <div className="form-field date-field">
                            <CustomDatePicker 
                                label="From Date*"
                                selectedDate={formData.fromDate}
                                onChange={(date) => handleDateChange('fromDate', date)}
                            />
                        </div>

                        <div className="form-field date-field">
                            <CustomDatePicker 
                                label="To Date*"
                                selectedDate={formData.toDate}
                                onChange={(date) => handleDateChange('toDate', date)}
                            />
                        </div>

                        <div className="form-field custom-dropdown-container">
                            <label>User Type</label>
                            <div className="custom-dropdown-header" onClick={() => setIsUserTypeOpen(!isUserTypeOpen)}>
                                <span className="selected-value red-text">{formData.userType}</span>
                                <FiChevronDown className={`dropdown-arrow-icon ${isUserTypeOpen ? 'open' : ''}`} />
                            </div>
                            {isUserTypeOpen && (
                                <div className="custom-dropdown-list">
                                    <div 
                                        className={`dropdown-item ${formData.userType === 'CBC' ? 'selected' : ''}`}
                                        onClick={() => handleSelectChange('userType', 'CBC')}
                                    >
                                        CBC {formData.userType === 'CBC' && <span className="check-icon">✓</span>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-field custom-dropdown-container">
                            <label>Status</label>
                            <div className="custom-dropdown-header" onClick={() => setIsStatusOpen(!isStatusOpen)}>
                                <span className="selected-value">{formData.status}</span>
                                <FiChevronDown className={`dropdown-arrow-icon ${isStatusOpen ? 'open' : ''}`} />
                            </div>
                            {isStatusOpen && (
                                <div className="custom-dropdown-list">
                                    {['ALL', 'Approved', 'Pending', 'Rejected'].map(opt => (
                                        <div 
                                            key={opt}
                                            className={`dropdown-item ${formData.status === opt ? 'selected' : ''}`}
                                            onClick={() => handleSelectChange('status', opt)}
                                        >
                                            {opt} {formData.status === opt && <span className="check-icon">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="button" className="submit-btn">Submit</button>
                    </div>
                ) : (
                    <div className="search-form-username">
                        <div className={`form-field floating-label-field ${usernameError ? 'has-error' : ''} ${(username || isFocused) ? 'floated' : ''}`}>
                            <input 
                                type="text" 
                                id="username"
                                value={username}
                                onChange={handleUsernameChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                placeholder="Enter Username"
                            />
                            <label htmlFor="username">Username*</label>
                            {usernameError && <span className="error-message">{usernameError}</span>}
                        </div>
                        <button type="button" className="submit-btn">Submit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserRequest;
