import React, { useState } from 'react';
import CustomDatePicker from './CustomDatePicker';
import './UserRequest.css';

const UserRequest = () => {
    const [searchType, setSearchType] = useState('dateRange');
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const [formData, setFormData] = useState({
        fromDate: '2026-04-18',
        toDate: '2026-04-18',
        userType: 'CBC',
        status: 'ALL'
    });

    const handleDateChange = (name, date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

                        <div className="form-field">
                            <label>User Type</label>
                            <select name="userType" value={formData.userType} onChange={handleChange}>
                                <option value="CBC">CBC</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="USER">USER</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="ALL">ALL</option>
                                <option value="PENDING">PENDING</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
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
