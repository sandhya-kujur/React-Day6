import React, { useState } from 'react';
import './WalletAdjustment.css';
import { fetchUserDetails, submitWalletAdjustment } from '../../actions/dashboardActions';
import { MdClose, MdCheck, MdCheckCircle } from 'react-icons/md';
import bankLogo from '../../assets/bank.png';

const WalletAdjustment = () => {
    const [userName, setUserName] = useState('');
    const [error, setError] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState('error'); // 'success' or 'error'
    const [toastMessage, setToastMessage] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        operationType: '',
        amount: '',
        remark: ''
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!userName.trim()) {
            setError(true);
        } else {
            setError(false);
            console.log('Searching for user:', userName);
            const response = await fetchUserDetails(userName);
            const role = userName.startsWith("CBCM") ? "CBC Maker" : userName.startsWith("CBC") ? "CBC" : "Agent";
            if (!response.ok) {
                // Exact message from screenshot
                const msg = response.data?.message || `No user found with the username provided ${userName} in this user role ${role}`;
                setToastMessage(msg);
                setToastType('error');
                setShowToast(true);
                setUserDetails(null);
            } else {
                console.log('User details loaded:', response.data);
                setUserDetails(response.data);
                setToastMessage('User details fetched successfully');
                setToastType('success');
                setShowToast(true);
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        
        // Only allow numbers for the amount field
        if (name === 'amount') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCancel = () => {
        setUserDetails(null);
        setUserName('');
        setFormData({
            operationType: '',
            amount: '',
            remark: ''
        });
        setShowToast(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        const payload = {
            userName: userName,
            amount: formData.amount,
            remarks: formData.remark,
            api_user: "WEBUSER",
            transaction: "PAY"
        };

        console.log('Sending wallet adjustment request:', payload);
        const response = await submitWalletAdjustment(payload);

        if (response.ok) {
            setToastMessage('Wallet adjustment successful');
            setToastType('success');
            setShowToast(true);
            setShowSuccessModal(true);
        } else {
            const errorMsg = response.data?.message || 'Wallet adjustment failed';
            setToastMessage(errorMsg);
            setToastType('error');
            setShowToast(true);
        }
    };

    const handleDone = () => {
        setShowSuccessModal(false);
        handleCancel(); // Reset everything
    };

    const handleChange = (e) => {
        setUserName(e.target.value);
        if (e.target.value.trim()) {
            setError(false);
        }
    };

    return (
        <div className="wallet-adjustment-page">
            <h1 className="page-title">Wallet Adjustment</h1>
            <div className="search-card">
                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-input-group">
                        <input
                            type="text"
                            className={`search-input ${error ? 'error' : ''}`}
                            id="userName"
                            placeholder="Enter User Name"
                            value={userName}
                            onChange={handleChange}
                        />
                        <label htmlFor="userName" className="floating-label">User Name*</label>
                        {error && <span className="error-message">Username is required</span>}
                    </div>
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>

            {/* User Details Form Section */}
            {userDetails && (
                <div className="details-section-card">
                    <h3 className="section-subtitle">Please Enter all the Details</h3>
                    <form className="adjustment-details-form" onSubmit={handleSave}>
                        <div className="details-grid">
                            {/* Read-only User Name */}
                            <div className="detail-input-group readonly">
                                <input type="text" value={userName} readOnly placeholder="User Name" />
                                <label className="floating-label">User Name</label>
                            </div>

                            {/* Read-only Name from API resultObj.data.1 */}
                            <div className="detail-input-group readonly">
                                <input 
                                    type="text" 
                                    value={`${userDetails.resultObj.data?.['1']?.firstName || ''} ${userDetails.resultObj.data?.['1']?.lastName || ''}`.trim() || 'N/A'} 
                                    readOnly 
                                    placeholder="Name" 
                                />
                                <label className="floating-label">Name</label>
                            </div>

                            {/* Editable Types of Operations Dropdown */}
                            <div className="detail-input-group select-group">
                                <select 
                                    name="operationType" 
                                    value={formData.operationType} 
                                    onChange={handleFormChange}
                                    className={formData.operationType ? 'filled' : ''}
                                    required
                                >
                                    <option value="" disabled hidden></option>
                                    <option value="Credit">Credit</option>
                                    <option value="Debit">Debit</option>
                                </select>
                                <label className="floating-label">Types of Operations*</label>
                            </div>

                            {/* Editable Amount */}
                            <div className="detail-input-group">
                                <input 
                                    type="text" 
                                    name="amount"
                                    value={formData.amount} 
                                    onChange={handleFormChange}
                                    placeholder="Amount"
                                    required
                                />
                                <label className="floating-label">Amount*</label>
                            </div>

                            {/* Read-only Wallet - Hardcoded to 0.00 */}
                            <div className="detail-input-group readonly">
                                <input type="text" value="Wallet" readOnly placeholder="Wallet" />
                                <label className="floating-label">Wallet</label>
                            </div>

                            {/* Editable Remark */}
                            <div className="detail-input-group">
                                <input 
                                    type="text" 
                                    name="remark"
                                    value={formData.remark} 
                                    onChange={handleFormChange}
                                    placeholder="Remark"
                                    required
                                />
                                <label className="floating-label">Remark*</label>
                            </div>
                        </div>

                        <div className="form-footer-actions">
                            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className="save-btn">Save</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Error/Success Toast */}
            {showToast && (
                <div className={`wallet-toast ${toastType}-toast`}>
                    {toastType === 'success' ? <MdCheck className="toast-icon" /> : <MdClose className="toast-icon" />}
                    <span className="toast-message">{toastMessage}</span>
                    <button type="button" className="toast-close-btn" onClick={() => setShowToast(false)}>Close</button>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="modal-logo-container">
                            <img src={bankLogo} alt="NSDL Payments Bank" className="modal-bank-logo" />
                        </div>
                        <div className="success-icon-container">
                            <MdCheckCircle />
                        </div>
                        <h2 className="success-modal-title">Wallet Updated Successfully!</h2>
                        <button type="button" className="done-btn" onClick={handleDone}>Done</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletAdjustment;
