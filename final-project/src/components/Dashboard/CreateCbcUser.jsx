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
  productFeatures: ['ACCOUNT_OPENING'],
};

const CreateCbcUser = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [productFeaturesOpen, setProductFeaturesOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    bankResolution: null,
    kyc: null,
    incorporation: null,
    firstPage: null,
    lastPage: null,
    proposal: null,
  });
  const productFeaturesRef = useRef(null);

  const PRODUCT_FEATURE_OPTIONS = [
    'DMT', 'BBPS', 'WALLETCASHOUT_IMPS', 'CASHOUT', 'UnifiedAEPS', 'ACCOUNT_OPENING','Wallet Topup','MAMT'
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (productFeaturesRef.current && !productFeaturesRef.current.contains(e.target)) {
        setProductFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const bankResolutionRef = useRef(null);
  const kycRef = useRef(null);
  const incorporationRef = useRef(null);
  const firstPageRef = useRef(null);
  const lastPageRef = useRef(null);
  const proposalRef = useRef(null);

  const requiredFields = [
    'firstName', 'lastName', 'ceoName', 'companyName', 'email', 'pan', 
    'mobileNumber', 'adminName', 'adminEmail', 'adminMobileNumber', 
    'businessAddressLine', 'country', 'pinCode', 'state', 'district', 
    'city', 'accountNumber', 'gstNumber', 'institutionType', 'stdCode', 
    'telephoneNumber', 'affiliateFee', 'numberOfStaff', 'entityPanCard', 
    'incorporationAddressLine1'
  ];

  const handleUploadClick = (ref) => {
    if (ref.current) ref.current.click();
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual File object (not just the name) so it can be used in FormData for API calls
      setUploadedFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setTouched({});
    setIsSubmitted(false);
    setIsAgreed(false);
    setShowAlert(false);
    setProductFeaturesOpen(false);
    setUploadedFiles({
      bankResolution: null, kyc: null, incorporation: null,
      firstPage: null, lastPage: null, proposal: null,
    });
    // Clear hidden file inputs
    [bankResolutionRef, kycRef, incorporationRef, firstPageRef, lastPageRef, proposalRef].forEach(ref => {
      if (ref.current) ref.current.value = '';
    });
  };

  const handleProductFeatureToggle = (option) => {
    setFormData((prev) => {
      const current = prev.productFeatures;
      if (current.includes(option)) {
        return { ...prev, productFeatures: current.filter(f => f !== option) };
      } else {
        return { ...prev, productFeatures: [...current, option] };
      }
    });
  };

  const validateForm = () => {
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  const isFieldInvalid = (fieldName) => {
    const isEmpty = !formData[fieldName] || formData[fieldName].toString().trim() === '';
    return (isSubmitted || touched[fieldName]) && isEmpty;
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsAgreed(checked);
    if (checked && !validateForm()) {
      // Mark all required fields as touched so errors show
      const allTouched = {};
      requiredFields.forEach(f => { allTouched[f] = true; });
      setTouched(allTouched);
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Mark all required fields as touched on submit
    const allTouched = {};
    requiredFields.forEach(f => { allTouched[f] = true; });
    setTouched(allTouched);

    if (!validateForm() || !isAgreed) {
      console.log('Validation failed');
      return;
    }
    
    console.log('Create CBC user success:', formData);
  };

  return (
    <div className="create-cbc-user-page">
      {/* Red Alert Popup */}
      {showAlert && (
        <div className="error-alert-bar">
          <span className="error-close-icon">&#10005;</span>
          <p>Please Enter all required fields!!!</p>
          <button className="error-close-btn" onClick={() => setShowAlert(false)}>Close</button>
        </div>
      )}
      <div className="create-cbc-card">
        <form className="create-cbc-form" onSubmit={handleSubmit}>
          <div className="fields-grid">
            {/* First Name */}
            <div className={`field-item ${isFieldInvalid('firstName') ? 'has-error' : ''}`}>
              <label>First Name <span className="required">*</span></label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter First Name"
              />
              {isFieldInvalid('firstName') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Middle Name */}
            <div className="field-item">
              <label>Middle Name</label>
              <input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Middle Name"
              />
            </div>

            {/* Last Name */}
            <div className={`field-item ${isFieldInvalid('lastName') ? 'has-error' : ''}`}>
              <label>Last Name <span className="required">*</span></label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Last Name"
              />
              {isFieldInvalid('lastName') && <span className="error-text">This field is required.</span>}
            </div>

            {/* CEO Name */}
            <div className={`field-item ${isFieldInvalid('ceoName') ? 'has-error' : ''}`}>
              <label>CEO Name <span className="required">*</span></label>
              <input
                name="ceoName"
                value={formData.ceoName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter CEO Name"
              />
              {isFieldInvalid('ceoName') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Company Name */}
            <div className={`field-item ${isFieldInvalid('companyName') ? 'has-error' : ''}`}>
              <label>Company Name <span className="required">*</span></label>
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Company Name"
              />
              {isFieldInvalid('companyName') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Email */}
            <div className={`field-item ${isFieldInvalid('email') ? 'has-error' : ''}`}>
              <label>Email ID <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Email ID"
              />
              {isFieldInvalid('email') && <span className="error-text">This field is required.</span>}
            </div>

            {/* PAN */}
            <div className={`field-item ${isFieldInvalid('pan') ? 'has-error' : ''}`}>
              <label>PAN <span className="required">*</span></label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter PAN"
              />
              {isFieldInvalid('pan') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Mobile Number */}
            <div className={`field-item ${isFieldInvalid('mobileNumber') ? 'has-error' : ''}`}>
              <label>Mobile Number <span className="required">*</span></label>
              <input
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Mobile Number"
              />
              {isFieldInvalid('mobileNumber') && <span className="error-text">This field is required.</span>}
            </div>

            {/* FAX Number */}
            <div className="field-item">
              <label>FAX Number</label>
              <input
                name="faxNumber"
                value={formData.faxNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter FAX Number"
              />
            </div>

            {/* Admin Name */}
            <div className={`field-item ${isFieldInvalid('adminName') ? 'has-error' : ''}`}>
              <label>Admin Name <span className="required">*</span></label>
              <input
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Admin Name"
              />
              {isFieldInvalid('adminName') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Admin Email */}
            <div className={`field-item ${isFieldInvalid('adminEmail') ? 'has-error' : ''}`}>
              <label>Admin Email <span className="required">*</span></label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Admin Email"
              />
              {isFieldInvalid('adminEmail') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Admin Mobile */}
            <div className={`field-item ${isFieldInvalid('adminMobileNumber') ? 'has-error' : ''}`}>
              <label>Admin Mobile Number <span className="required">*</span></label>
              <input
                name="adminMobileNumber"
                value={formData.adminMobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Admin Mobile Number"
              />
              {isFieldInvalid('adminMobileNumber') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Business Address */}
            <div className={`field-item ${isFieldInvalid('businessAddressLine') ? 'has-error' : ''}`}>
              <label>Business Address Line <span className="required">*</span></label>
              <input
                name="businessAddressLine"
                value={formData.businessAddressLine}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Business Address Line"
              />
              {isFieldInvalid('businessAddressLine') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Country */}
            <div className={`field-item ${isFieldInvalid('country') ? 'has-error' : ''}`}>
              <label>Country <span className="required">*</span></label>
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="India"
              />
              {isFieldInvalid('country') && <span className="error-text">This field is required.</span>}
            </div>

            {/* PIN Code */}
            <div className={`field-item ${isFieldInvalid('pinCode') ? 'has-error' : ''}`}>
              <label>PIN Code <span className="required">*</span></label>
              <input
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter PIN Code"
              />
              {isFieldInvalid('pinCode') && <span className="error-text">This field is required.</span>}
            </div>

            {/* State */}
            <div className={`field-item ${isFieldInvalid('state') ? 'has-error' : ''}`}>
              <label>State <span className="required">*</span></label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter State"
              />
              {isFieldInvalid('state') && <span className="error-text">This field is required.</span>}
            </div>

            {/* District */}
            <div className={`field-item ${isFieldInvalid('district') ? 'has-error' : ''}`}>
              <label>District <span className="required">*</span></label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter District"
              />
              {isFieldInvalid('district') && <span className="error-text">This field is required.</span>}
            </div>

            {/* City */}
            <div className={`field-item ${isFieldInvalid('city') ? 'has-error' : ''}`}>
              <label>City <span className="required">*</span></label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter City"
              />
              {isFieldInvalid('city') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Account Number */}
            <div className={`field-item ${isFieldInvalid('accountNumber') ? 'has-error' : ''}`}>
              <label>Account Number <span className="required">*</span></label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Account Number"
              />
              {isFieldInvalid('accountNumber') && <span className="error-text">This field is required.</span>}
            </div>

            {/* GST Number */}
            <div className={`field-item ${isFieldInvalid('gstNumber') ? 'has-error' : ''}`}>
              <label>GST Number <span className="required">*</span></label>
              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter GST Number"
              />
              {isFieldInvalid('gstNumber') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Institution Type */}
            <div className={`field-item ${isFieldInvalid('institutionType') ? 'has-error' : ''}`}>
              <label>Institution Type <span className="required">*</span></label>
              <div className="select-input">
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select Institution Type</option>
                  <option value="INDIVIDUAL">INDIVIDUAL</option>
                  <option value="NON-INDIVIDUAL">NON-INDIVIDUAL</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
              {isFieldInvalid('institutionType') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Telephone Number */}
            <div className={`field-item telephone-group ${isFieldInvalid('stdCode') || isFieldInvalid('telephoneNumber') ? 'has-error' : ''}`}>
              <label>Telephone Number <span className="required">*</span></label>
              <div className="telephone-row">
                <input
                  className="telephone-field"
                  name="stdCode"
                  value={formData.stdCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="STD Code"
                />
                <input
                  className="telephone-field"
                  name="telephoneNumber"
                  value={formData.telephoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Telephone Number"
                />
              </div>
              {(isFieldInvalid('stdCode') || isFieldInvalid('telephoneNumber')) && <span className="error-text">This field is required.</span>}
            </div>

            {/* Affiliate Fee */}
            <div className={`field-item ${isFieldInvalid('affiliateFee') ? 'has-error' : ''}`}>
              <label>Affiliate Fee <span className="required">*</span></label>
              <input
                name="affiliateFee"
                value={formData.affiliateFee}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Affiliate Fee"
              />
              {isFieldInvalid('affiliateFee') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Number of Staff */}
            <div className={`field-item ${isFieldInvalid('numberOfStaff') ? 'has-error' : ''}`}>
              <label>Number of Staff <span className="required">*</span></label>
              <input
                name="numberOfStaff"
                value={formData.numberOfStaff}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Number of Staff"
              />
              {isFieldInvalid('numberOfStaff') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Dates */}
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

            {/* Entity PAN */}
            <div className={`field-item ${isFieldInvalid('entityPanCard') ? 'has-error' : ''}`}>
              <label>Entity PAN Card <span className="required">*</span></label>
              <input
                name="entityPanCard"
                value={formData.entityPanCard}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Entity PAN Card"
              />
              {isFieldInvalid('entityPanCard') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Incorporation Address */}
            <div className={`field-item ${isFieldInvalid('incorporationAddressLine1') ? 'has-error' : ''}`}>
              <label>Incorporation Address Line 1 <span className="required">*</span></label>
              <input
                name="incorporationAddressLine1"
                value={formData.incorporationAddressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Incorporation Address Line 1"
              />
              {isFieldInvalid('incorporationAddressLine1') && <span className="error-text">This field is required.</span>}
            </div>

            {/* Product Features - Multi-checkbox dropdown */}
            <div className="field-item full-span" ref={productFeaturesRef} style={{ position: 'relative' }}>
              <label>Product Features <span className="required">*</span></label>
              <div
                className="select-input multi-select-trigger"
                onClick={() => setProductFeaturesOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
              >
                <div className="multi-select-display">
                  {formData.productFeatures.length > 0
                    ? formData.productFeatures.join(', ')
                    : 'Select Product Features'}
                </div>
                <FiChevronDown className="select-icon" style={{ transform: productFeaturesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              {productFeaturesOpen && (
                <div className="multi-select-dropdown">
                  {PRODUCT_FEATURE_OPTIONS.map(option => (
                    <div
                      key={option}
                      className={`multi-select-option ${formData.productFeatures.includes(option) ? 'selected' : ''}`}
                      onClick={() => handleProductFeatureToggle(option)}
                    >
                      <span className="multi-select-checkbox">
                        {formData.productFeatures.includes(option) && <span className="multi-select-check">✓</span>}
                      </span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="upload-grid">
            <div className="upload-item">
              <label>Bank Resolution <span className="required">*</span></label>
              <input type="file" ref={bankResolutionRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'bankResolution')} />
              <div className="upload-box" onClick={() => handleUploadClick(bankResolutionRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.bankResolution?.name || 'Upload Bank Resolution (.pdf Only)'}</p>
              </div>
            </div>
            <div className="upload-item">
              <label>Authorized Signatory KYC <span className="required">*</span></label>
              <input type="file" ref={kycRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'kyc')} />
              <div className="upload-box" onClick={() => handleUploadClick(kycRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.kyc?.name || 'Upload Authorized Signatory KYC (.pdf Only)'}</p>
              </div>
            </div>

            <div className="upload-item">
              <label>Certificate of Incorporation <span className="required">*</span></label>
              <input type="file" ref={incorporationRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'incorporation')} />
              <div className="upload-box" onClick={() => handleUploadClick(incorporationRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.incorporation?.name || 'Upload Certificate of Incorporation (.pdf Only)'}</p>
              </div>
            </div>
            <div className="upload-item">
              <label>First Page of Agreement <span className="required">*</span></label>
              <input type="file" ref={firstPageRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'firstPage')} />
              <div className="upload-box" onClick={() => handleUploadClick(firstPageRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.firstPage?.name || 'Upload First Page of Agreement (.pdf Only)'}</p>
              </div>
            </div>

            <div className="upload-item">
              <label>Last Page of Agreement <span className="required">*</span></label>
              <input type="file" ref={lastPageRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'lastPage')} />
              <div className="upload-box" onClick={() => handleUploadClick(lastPageRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.lastPage?.name || 'Upload Last Page of Agreement (.pdf Only)'}</p>
              </div>
            </div>
            <div className="upload-item">
              <label>Business Proposal <span className="required">*</span></label>
              <input type="file" ref={proposalRef} style={{ display: 'none' }} accept=".pdf"
                onChange={(e) => handleFileChange(e, 'proposal')} />
              <div className="upload-box" onClick={() => handleUploadClick(proposalRef)}>
                <FiPaperclip className="upload-icon" />
                <p>{uploadedFiles.proposal || 'Upload Business Proposal (.pdf Only)'}</p>
              </div>
            </div>
          </div>

          <div className={`terms-row ${isSubmitted && !isAgreed ? 'has-error' : ''}`}>
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
          {isSubmitted && !isAgreed && <p className="terms-error-text">Please agree to the terms and conditions.</p>}

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
