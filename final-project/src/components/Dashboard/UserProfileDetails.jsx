import React, { useState } from 'react';
import { FiArrowLeft, FiMail, FiPhone, FiCheck, FiX, FiLink } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import './UserProfileDetails.css';

const UserProfileDetails = ({ user, onBack }) => {
    const [activeTab, setActiveTab] = useState('Basic Details');

    // Extract data from nested structure or fallback to flat structure (for dummy data)
    const raw = user.originalData || {};
    const info1 = raw["1"] || {};
    const info2 = raw["2"] || {};
    const info3 = raw["3"] || {};
    const info4 = raw["4"] || {};
    const info5 = raw["5"] || {};
    const info6 = raw["6"] || {};

    // Helper to get value from any nested object or root, matching keys from initialCbcFormState
    const getVal = (key, fallback = 'N/A') => {
        const val = info1[key] || info2[key] || info3[key] || info4[key] || info5[key] || info6[key] || raw[key];
        return (val !== undefined && val !== null && val !== '') ? val : fallback;
    };

    const fullName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : (getVal('firstName', '') ? `${getVal('firstName', '')} ${getVal('lastName', '')}` : (user.username || 'N/A'));

    const handleLinkClick = (key) => {
        const url = getVal(key, null);
        if (url && url !== 'NA' && url !== 'N/A') {
            window.open(url, '_blank');
        }
    };

    const addressParts = (user.address || '').split(',');
    const cityPart = addressParts[0] || 'N/A';
    const statePart = addressParts[1] || 'N/A';

    const tabs = [
        'Basic Details', 
        'Admin Details',
        'Business Details',
        'Bank Details',
        'PAN Details', 
        'Aadhar Details', 
        'Matching Details', 
        'Geo-Tagging Analysis', 
        'Agreement Details',
        'Browser Data'
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Basic Details':
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Name :</span>
                            <span className="detail-value">{fullName}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">City :</span>
                            <span className="detail-value">{getVal('city', cityPart)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">GSTIN :</span>
                            <span className="detail-value">{getVal('gstNumber', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">State :</span>
                            <span className="detail-value">{getVal('state', statePart)}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">PIN :</span>
                            <span className="detail-value">{getVal('pinCode', getVal('pin', 'NA'))}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Address :</span>
                            <span className="detail-value">{getVal('businessAddressLine', user.address || 'N/A')}</span>
                        </div>
                    </div>
                );
            case 'Admin Details':
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Admin Name :</span>
                            <span className="detail-value">{getVal('adminName', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Admin Email :</span>
                            <span className="detail-value">{getVal('adminEmail', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Admin Mobile Number :</span>
                            <span className="detail-value">{getVal('adminMobileNumber', 'NA')}</span>
                        </div>
                    </div>
                );
            case 'Business Details':
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">CEO Name :</span>
                            <span className="detail-value">{getVal('ceoName', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">GSTIN :</span>
                            <span className="detail-value">{getVal('gstNumber', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Company Name :</span>
                            <span className="detail-value">{getVal('companyName', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Number Of Staff :</span>
                            <span className="detail-value">{getVal('numberOfStaff', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Fax Number :</span>
                            <span className="detail-value">{getVal('faxNumber', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Address :</span>
                            <span className="detail-value">{getVal('businessAddress', 'NA')}</span>
                        </div>
                    </div>
                );
            case 'Bank Details':
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Account Number :</span>
                            <span className="detail-value">{getVal('accountNumber', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Bank Resolution :</span>
                            {getVal('bankResolution', null) ? (
                                <span className="detail-value link-style" onClick={() => handleLinkClick('bankResolution')}>
                                    <FiLink className="link-icon" /> Click Here
                                </span>
                            ) : (
                                <span className="detail-value">NA</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Bank Code :</span>
                            <span className="detail-value">{raw.bankCode || 'NA'}</span>
                        </div>
                    </div>
                );
            case 'PAN Details':
                return (
                    <div className="pan-details-container">
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Name :</span>
                                <span className="detail-value">{fullName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">PAN Number :</span>
                                <span className="detail-value">{info2.pan || 'NA'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">DOI :</span>
                                <span className="detail-value">{info2.doi || 'NA'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'Aadhar Details':
                return (
                    <div className="aadhar-details-container">
                        <div className="details-row-with-images">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Name :</span>
                                    <span className="detail-value">{fullName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Father Name :</span>
                                    <span className="detail-value">{info3.fatherName || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Aadhaar Number :</span>
                                    <span className="detail-value">{info3.aadhar || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">DOB :</span>
                                    <span className="detail-value">{info3.dob || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">DOI :</span>
                                    <span className="detail-value">{info3.doi || 'NA'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Matching Details':
                return (
                    <div className="matching-details-container">
                        <div className="details-row-with-images">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">PAN Name :</span>
                                    <span className="detail-value">{fullName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Aadhaar Name :</span>
                                    <span className="detail-value">{fullName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Match Score :</span>
                                    <span className="detail-value">{info5.matchScore || '100%'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Geo-Tagging Analysis':
                return (
                    <div className="geo-details-container">
                        <div className="details-row-with-images">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">IP :</span>
                                    <span className="detail-value">{info5.ip || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Lattitude :</span>
                                    <span className="detail-value">{info5.lat || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Longitude :</span>
                                    <span className="detail-value">{info5.lng || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">PIN :</span>
                                  <span className="detail-value">{getVal('pin', getVal('pinCode', 'NA'))}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">City :</span>
                                  <span className="detail-value">{info5.city || 'Bhubaneswar'}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="detail-label">State :</span>
                                  <span className="detail-value">{info5.state || 'Odisha'}</span>
                                </div>
                                <div className="detail-item full-width">
                                  <span className="detail-label">Address :</span>
                                  <span className="detail-value">{info5.address || info1.businessAddressLine || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Agreement Details':
                return (
                    <div className="details-grid">
                        <div className="detail-item">
                            <span className="detail-label">Affiliation Fee :</span>
                            <span className="detail-value">{getVal('affiliationFee', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Certificate Of Incorporation :</span>
                            {getVal('certificateOfIncorporationDocumentPdf', null) ? (
                                <span className="detail-value link-style" onClick={() => handleLinkClick('certificateOfIncorporationDocumentPdf')}>
                                    <FiLink className="link-icon" /> Click Here
                                </span>
                            ) : (
                                <span className="detail-value">NA</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Start Date :</span>
                            <span className="detail-value">{getVal('agreementStartDate', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">First Page Agreement :</span>
                            {getVal('firstAndLastPageAgreement', null) ? (
                                <span className="detail-value link-style" onClick={() => handleLinkClick('firstAndLastPageAgreement')}>
                                    <FiLink className="link-icon" /> Click Here
                                </span>
                            ) : (
                                <span className="detail-value">NA</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">End Date :</span>
                            <span className="detail-value">{getVal('agreementEndDate', 'NA')}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Last Page Agreement :</span>
                            {getVal('lastPageAgreement', null) ? (
                                <span className="detail-value link-style" onClick={() => handleLinkClick('lastPageAgreement')}>
                                    <FiLink className="link-icon" /> Click Here
                                </span>
                            ) : (
                                <span className="detail-value">NA</span>
                            )}
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Authorized Signatory :</span>
                            {getVal('authorizedSignatoryKyc', null) ? (
                                <span className="detail-value link-style" onClick={() => handleLinkClick('authorizedSignatoryKyc')}>
                                    <FiLink className="link-icon" /> Click Here
                                </span>
                            ) : (
                                <span className="detail-value">NA</span>
                            )}
                        </div>
                        <div className="detail-item full-width">
                            <span className="detail-label">Features :</span>
                            <span className="detail-value">
                                {(() => {
                                    const features = getVal('productFeatures', 'NA');
                                    if (Array.isArray(features)) {
                                        return features.map(f => f.featureName || f).join(', ');
                                    }
                                    return features;
                                })()}
                            </span>
                        </div>
                    </div>
                );
            case 'Browser Data':
                return (
                    <div className="browser-details-container">
                        <div className="details-row-with-images">
                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Browser :</span>
                                    <span className="detail-value">{info5.browser || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">User OS :</span>
                                    <span className="detail-value">{info5.os || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Platform :</span>
                                    <span className="detail-value">{info5.platform || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Browser Language :</span>
                                    <span className="detail-value">{info5.lang || 'NA'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Cookie Enable :</span>
                                    <span className="detail-value">{info5.cookie || 'NA'}</span>
                                </div>
                            </div>
                            <div className="browser-icon-section">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" alt="Chrome" className="browser-logo" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="empty-tab">
                        <p>No data available for {activeTab}</p>
                    </div>
                );
        }
    };

    return (
        <div className="profile-details-page">
            <div className="details-header">
                <button className="back-btn" onClick={onBack}>
                    <FiArrowLeft />
                </button>
                <h2>Profile Details</h2>
            </div>

            <div className="details-top-section">
                <div className="profile-main-card">
                    <div className="status-badge-container">
                        <span className="status-badge-pill active">Active</span>
                    </div>
                    <div className="profile-avatar-section">
                        <FaUserCircle className="large-avatar" />
                        <h3>{fullName}</h3>
                        <p className="subtitle">User Name : {user.username}</p>
                    </div>
                    <div className="profile-contact-info">
                        <div className="contact-item">
                            <FiMail className="contact-icon" />
                            <span>{user.email}</span>
                        </div>
                        <div className="contact-item">
                            <FiPhone className="contact-icon" />
                            <span>{user.mobile}</span>
                        </div>
                    </div>
                </div>

                <div className="personal-details-card">
                    <h4 className="section-title">Personal Details</h4>
                    <div className="personal-grid">
                        <div className="grid-item">
                            <span className="grid-label">PAN</span>
                            <span className="grid-value">{info2.pan || 'NA'}</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">Aadhaar</span>
                            <span className="grid-value">{info3.aadhar || 'NA'}</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">Created Date</span>
                            <span className="grid-value">{user.dateCreated || '12/09/2025'}</span>
                        </div>
                        <div className="grid-item">
                            <span className="grid-label">Submission Date</span>
                            <span className="grid-value">{user.updatedDate || '15/09/2025'}</span>
                        </div>
                        <div className="grid-item full-width">
                            <span className="grid-label">Address</span>
                            <p className="grid-value">{info1.businessAddressLine || user.address || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="details-bottom-section">
                <div className="tabs-container">
                    <div className="tabs-header">
                        {tabs.map(tab => (
                            <button 
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfileDetails;
