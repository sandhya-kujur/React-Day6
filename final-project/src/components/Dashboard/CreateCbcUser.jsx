import React, { useState, useRef } from 'react';
import { FiPaperclip, FiChevronDown } from 'react-icons/fi';
import CustomDatePicker from './CustomDatePicker';
import './CreateCbcUser.css';

const initialFormState = {
  firstName: '',
  middleName: '',
  lastName: '',
  ceoName: '',
  companyName: '',
  email: '',
  pan: '',
  mobileNumber: '',
  faxNumber: '',
  adminName: '',
  adminEmail: '',
  adminMobileNumber: '',
  businessAddressLine: '',
  country: 'India',
  pinCode: '',
  state: '',
  district: '',
  city: '',
  accountNumber: '',
  gstNumber: '',
  institutionType: '',
  stdCode: '',
  telephoneNumber: '',
  affiliateFee: '',
  numberOfStaff: '',
  agreementFromDate: '2026-04-18',
  agreementToDate: '2026-04-18',
  entityPanCard: '',
  incorporationAddressLine1: '',
  productFeatures: 'ACCOUNT_OPENING',
};

const CreateCbcUser = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [showError, setShowError] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const bankResolutionRef = useRef(null);
  const kycRef = useRef(null);
  const incorporationRef = useRef(null);
  const firstPageRef = useRef(null);
  const lastPageRef = useRef(null);
  const proposalRef = useRef(null);

  const handleUploadClick = (ref) => {
    if (ref.current) ref.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'ceoName', 'companyName', 'email', 'pan', 
      'mobileNumber', 'adminName', 'adminEmail', 'adminMobileNumber', 
      'businessAddressLine', 'country', 'pinCode', 'state', 'district', 
      'city', 'accountNumber', 'gstNumber', 'institutionType', 'stdCode', 
      'telephoneNumber', 'affiliateFee', 'numberOfStaff', 'entityPanCard', 
      'incorporationAddressLine1'
    ];
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsAgreed(checked);
    if (checked && !validateForm()) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAgreed) {
      alert('Please agree to the terms and conditions');
      return;
    }
    if (!validateForm()) {
      setShowError(true);
      return;
    }
    console.log('Create CBC user', formData);
  };

  return (
    <div className="create-cbc-user-page">
      {showError && (
        <div className="error-alert-bar">
          <span className="error-close-icon" onClick={() => setShowError(false)}>✕</span>
          <p>Please Enter all required fields!!!</p>
          <button type="button" className="error-close-btn" onClick={() => setShowError(false)}>Close</button>
        </div>
      )}
      <div className="create-cbc-card">
        <form className="create-cbc-form" onSubmit={handleSubmit}>
          <div className="fields-grid">
            <div className="field-item">
              <label>First Name <span className="required">*</span></label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
              />
            </div>
            <div className="field-item">
              <label>Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Enter Middle Name"
              />
            </div>

            <div className="field-item">
              <label>Last Name <span className="required">*</span></label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
              />
            </div>
            <div className="field-item">
              <label>CEO Name <span className="required">*</span></label>
              <input
                name="ceoName"
                value={formData.ceoName}
                onChange={handleChange}
                placeholder="Enter CEO Name"
                required
              />
            </div>

            <div className="field-item">
              <label>Company Name <span className="required">*</span></label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                required
              />
            </div>
            <div className="field-item">
              <label>Email ID <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email ID"
                required
              />
            </div>

            <div className="field-item">
              <label>PAN <span className="required">*</span></label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="Enter PAN"
                required
              />
            </div>
            <div className="field-item">
              <label>Mobile Number <span className="required">*</span></label>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            <div className="field-item">
              <label>FAX Number</label>
              <input
                name="faxNumber"
                value={formData.faxNumber}
                onChange={handleChange}
                placeholder="Enter FAX Number"
              />
            </div>
            <div className="field-item">
              <label>Admin Name <span className="required">*</span></label>
              <input
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Enter Admin Name"
                required
              />
            </div>

            <div className="field-item">
              <label>Admin Email <span className="required">*</span></label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="Enter Admin Email"
                required
              />
            </div>
            <div className="field-item">
              <label>Admin Mobile Number <span className="required">*</span></label>
              <input
                name="adminMobileNumber"
                value={formData.adminMobileNumber}
                onChange={handleChange}
                placeholder="Enter Admin Mobile Number"
                required
              />
            </div>

            <div className="field-item">
              <label>Business Address Line <span className="required">*</span></label>
              <input
                name="businessAddressLine"
                value={formData.businessAddressLine}
                onChange={handleChange}
                placeholder="Enter Business Address Line"
                required
              />
            </div>
            <div className="field-item">
              <label>Country <span className="required">*</span></label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="India"
                required
              />
            </div>

            <div className="field-item">
              <label>PIN Code <span className="required">*</span></label>
              <input
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter PIN Code"
                required
              />
            </div>
            <div className="field-item">
              <label>State <span className="required">*</span></label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
                required
              />
            </div>

            <div className="field-item">
              <label>District <span className="required">*</span></label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter District"
                required
              />
            </div>
            <div className="field-item">
              <label>City <span className="required">*</span></label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                required
              />
            </div>

            <div className="field-item">
              <label>Account Number <span className="required">*</span></label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter Account Number"
                required
              />
            </div>
            <div className="field-item">
              <label>GST Number <span className="required">*</span></label>
              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST Number"
                required
              />
            </div>

            <div className="field-item">
              <label>Institution Type <span className="required">*</span></label>
              <div className="select-input">
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Institution Type</option>
                  <option value="Bank">Bank</option>
                  <option value="NBFC">NBFC</option>
                  <option value="Microfinance">Microfinance</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>
            <div className="field-item telephone-group">
              <label>Telephone Number <span className="required">*</span></label>
              <div className="telephone-row">
                <input
                  className="telephone-field"
                  name="stdCode"
                  value={formData.stdCode}
                  onChange={handleChange}
                  placeholder="STD Code"
                  required
                />
                <input
                  className="telephone-field"
                  name="telephoneNumber"
                  value={formData.telephoneNumber}
                  onChange={handleChange}
                  placeholder="Telephone Number"
                  required
                />
              </div>
            </div>

            <div className="field-item">
              <label>Affiliate Fee <span className="required">*</span></label>
              <input
                name="affiliateFee"
                value={formData.affiliateFee}
                onChange={handleChange}
                placeholder="Enter Affiliate Fee"
                required
              />
            </div>
            <div className="field-item">
              <label>Number of Staff <span className="required">*</span></label>
              <input
                name="numberOfStaff"
                value={formData.numberOfStaff}
                onChange={handleChange}
                placeholder="Enter Number of Staff"
                required
              />
            </div>

            <div className="field-item">
              <CustomDatePicker 
                label="Agreement From Date *"
                selectedDate={formData.agreementFromDate}
                onChange={(date) => handleDateChange('agreementFromDate', date)}
              />
            </div>
            <div className="field-item">
              <CustomDatePicker 
                label="Agreement To Date *"
                selectedDate={formData.agreementToDate}
                onChange={(date) => handleDateChange('agreementToDate', date)}
              />
            </div>

            <div className="field-item">
              <label>Entity PAN Card <span className="required">*</span></label>
              <input
                name="entityPanCard"
                value={formData.entityPanCard}
                onChange={handleChange}
                placeholder="Enter Entity PAN Card"
                required
              />
            </div>
            <div className="field-item">
              <label>Incorporation Address Line 1 <span className="required">*</span></label>
              <input
                name="incorporationAddressLine1"
                value={formData.incorporationAddressLine1}
                onChange={handleChange}
                placeholder="Enter Incorporation Address Line 1"
                required
              />
            </div>

            <div className="field-item full-span">
              <label>Product Features <span className="required">*</span></label>
              <div className="select-input">
                <select
                  name="productFeatures"
                  value={formData.productFeatures}
                  onChange={handleChange}
                  required
                >
                  <option value="ACCOUNT_OPENING">ACCOUNT_OPENING</option>
                  <option value="PAYMENTS">PAYMENTS</option>
                  <option value="REPORTING">REPORTING</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>
          </div>

          <div className="upload-grid">
            <div className="upload-item">
              <label>Bank Resolution <span className="required">*</span></label>
              <input type="file" ref={bankResolutionRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(bankResolutionRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload Bank Resolution (.pdf Only)</p>
              </div>
            </div>
            <div className="upload-item">
              <label>Authorized Signatory KYC <span className="required">*</span></label>
              <input type="file" ref={kycRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(kycRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload Authorized Signatory KYC (.pdf Only)</p>
              </div>
            </div>

            <div className="upload-item">
              <label>Certificate of Incorporation <span className="required">*</span></label>
              <input type="file" ref={incorporationRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(incorporationRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload Certificate of Incorporation (.pdf Only)</p>
              </div>
            </div>
            <div className="upload-item">
              <label>First Page of Agreement <span className="required">*</span></label>
              <input type="file" ref={firstPageRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(firstPageRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload First Page of Agreement (.pdf Only)</p>
              </div>
            </div>

            <div className="upload-item">
              <label>Last Page of Agreement <span className="required">*</span></label>
              <input type="file" ref={lastPageRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(lastPageRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload Last Page of Agreement (.pdf Only)</p>
              </div>
            </div>
            <div className="upload-item">
              <label>Business Proposal <span className="required">*</span></label>
              <input type="file" ref={proposalRef} style={{ display: 'none' }} accept=".pdf" />
              <div className="upload-box" onClick={() => handleUploadClick(proposalRef)}>
                <FiPaperclip className="upload-icon" />
                <p>Upload Business Proposal (.pdf Only)</p>
              </div>
            </div>
          </div>

          <div className="terms-row">
            <label className="terms-checkbox">
              <input 
                type="checkbox" 
                checked={isAgreed}
                onChange={handleCheckboxChange}
              />
              <span />
            </label>
            <p>
              By using our services, you confirm that you are at least 18 years old and legally capable of entering into agreements. You are responsible for securing your account details and for any activity under your account. Fees may apply to certain services, which will be disclosed at the time of use. Services are provided for personal, lawful purposes only. Your personal data will be handled in accordance with our Privacy Policy. We may update these terms from time to time, and your continued use of the services constitutes acceptance of any changes. We are not liable for any damages arising from the use of our services, except where required by law. We reserve the right to suspend or terminate your access if you violate these terms.
            </p>
          </div>

          <div className="actions-row">
            <button type="submit" className="primary-button">Create</button>
            <button type="button" className="secondary-button" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCbcUser;
