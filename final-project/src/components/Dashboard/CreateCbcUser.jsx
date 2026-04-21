import React, { useState, useRef, useEffect } from 'react';
import { FiPaperclip, FiChevronDown, FiDownload, FiX, FiCheckCircle, FiCheck } from 'react-icons/fi';
import './CreateCbcUser.css';
import { uploadFile, fetchAddressByPincode, cbcOnboard } from '../../actions/dashboardActions';
import bankLogo from '../../assets/bank.png';


const initialFormState = {
  //first page rendering
  firstName: '',
  lastName: '',
  username: '',
  mobileNumber: '',
  email: '',
  adminName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  pin: '',
  //second page rendering
  ceoName: '',
  companyName: '',
  faxNumber: '',
  step2AdminName: '',
  adminEmail: '',
  step2AdminMobileNumber: '',
  businessAddressLine1: '',
  businessAddressLine2: '',
  country: '',
  step2State: '',
  step2City: '',
  step2District: '',
  step2PinBottom: '',
  accountNumber: '',
  gstNumber: '',
  telephoneNumber: '',
  affiliationFee: '',
  entityIdReferrer: '',
  numberOfStaff: '',
  agreementFromDate: '',
  agreementToDate: '',
  entityPanCard: '',

  // Incorporation Address
  sameAsBusiness: false,
  incAddressLine1: '',
  incAddressLine2: '',
  incCountry: '',
  incState: '',
  incCity: '',
  incDistrict: '',
  incPin: '',

  productFeatures: ['ACCOUNT_OPENING'],
  isAgreed: false
};

const CreateCbcUser = () => {
  const [step, setStep] = useState(1);
  const [productOptions, setProductOptions] = useState([
    'DMT', 'BBPS', 'WALLETCASHOUT_IMPS', 'CASHOUT', 'UnifiedAEPS', 'ACCOUNT_OPENING', 'Wallet Topup', 'MATM'
  ]);
  const [formData, setFormData] = useState(initialFormState);
  const [productFeaturesOpen, setProductFeaturesOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState({ show: false, message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const productFeaturesRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState({
    bankResolution: null,
    kyc: null,
    incorporation: null,
    firstPage: null,
    lastPage: null,
    proposal: null
  });

  const bankResolutionRef = useRef(null);
  const kycRef = useRef(null);
  const incorporationRef = useRef(null);
  const firstPageRef = useRef(null);
  const lastPageRef = useRef(null);
  const proposalRef = useRef(null);

  const fileRefsMap = {
    bankResolution: bankResolutionRef,
    kyc: kycRef,
    incorporation: incorporationRef,
    firstPage: firstPageRef,
    lastPage: lastPageRef,
    proposal: proposalRef
  };

  // Pre-fill username from session
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userName = userData?.userInfo?.userProfile?.userName || 'admin';
    if (userName) {
      setFormData(prev => ({ ...prev, username: userName }));
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productFeaturesRef.current && !productFeaturesRef.current.contains(event.target)) {
        setProductFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateMandatory = () => {
    // Temporarily disabled for testing
    return true
    // const required = [
    //   'firstName', 'lastName', 'username', 'mobileNumber', 'email', 'adminName',
    //   'addressLine1', 'city', 'pin', 'ceoName', 'companyName',
    //   'step2AdminName', 'adminEmail', 'step2AdminMobileNumber', 'businessAddressLine1',
    //   'step2City', 'step2PinBottom', 'accountNumber', 'gstNumber', 'numberOfStaff',
    //   'agreementFromDate', 'agreementToDate', 'entityPanCard'
    // ];
    // return required.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  // Pincode Auto-fill for Step 2 Business Address
  useEffect(() => {
    const handlePincodeFill = async () => {
      if (formData.step2PinBottom && formData.step2PinBottom.length === 6) {
        const response = await fetchAddressByPincode(formData.step2PinBottom);
        if (response.ok) {
          setFormData(prev => ({
            ...prev,
            step2City: response.city,
            step2State: response.state,
            step2District: response.district
          }));
        } else {
          setPopupConfig({ show: true, message: response.error });
        }
      }
    };
    handlePincodeFill();
  }, [formData.step2PinBottom]);

  // Pincode Auto-fill for Incorporation Address
  useEffect(() => {
    const handlePincodeFill = async () => {
      if (formData.incPin && formData.incPin.length === 6) {
        const response = await fetchAddressByPincode(formData.incPin);
        if (response.ok) {
          setFormData(prev => ({
            ...prev,
            incCity: response.city,
            incState: response.state,
            incDistrict: response.district
          }));
        } else {
          setPopupConfig({ show: true, message: response.error });
        }
      }
    };
    handlePincodeFill();
  }, [formData.incPin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'isAgreed' && checked) {
      if (!validateMandatory()) {
        setPopupConfig({ show: true, message: 'Please Enter all required fields!!!' });
      }
    }

    if (name === 'sameAsBusiness') {
      const isSame = checked;
      setFormData(prev => ({
        ...prev,
        sameAsBusiness: isSame,
        incAddressLine1: isSame ? prev.businessAddressLine1 : prev.incAddressLine1,
        incAddressLine2: isSame ? prev.businessAddressLine2 : prev.incAddressLine2,
        incCountry: isSame ? prev.country : prev.incCountry,
        incState: isSame ? prev.state : prev.incState,
        incCity: isSame ? prev.step2City : prev.incCity,
        incPin: isSame ? prev.step2PinBottom : prev.incPin
      }));
    } else {
      setFormData((prev) => {
        const newState = { ...prev, [name]: type === 'checkbox' ? checked : value };

        // If "Same as Business" is checked and we are updating a business field, sync it
        if (newState.sameAsBusiness) {
          if (name === 'businessAddressLine1') newState.incAddressLine1 = value;
          if (name === 'businessAddressLine2') newState.incAddressLine2 = value;
          if (name === 'country') newState.incCountry = value;
          if (name === 'state') newState.incState = value;
          if (name === 'step2City') newState.incCity = value;
          if (name === 'step2PinBottom') newState.incPin = value;
        }

        return newState;
      });
    }
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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setTouched({});
    setIsSubmitted(false);
    setStep(1);
    setPopupConfig({ show: false, message: '' });
  };

  const handleUploadClick = (key) => {
    if (fileRefsMap[key] && fileRefsMap[key].current) {
      fileRefsMap[key].current.click();
    }
  };

  const handleFileChange = async (e, key) => {
    const file = e.target.files[0];
    if (file) {
      // Client-side validation for PDF type
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setPopupConfig({ show: true, message: 'Invalid file type. Please upload a PDF document only.' });
        e.target.value = ''; // Reset input
        return;
      }

      // Set temporary state for UI feedback
      setUploadedFiles(prev => ({ ...prev, [key]: { name: 'Uploading...' } }));

      const response = await uploadFile(file);

      if (response.ok) {
        setUploadedFiles(prev => ({
          ...prev,
          [key]: {
            name: file.name,
            url: response.data?.file_url || response.data?.url || '',
            success: true
          }
        }));
      } else {
        setPopupConfig({ show: true, message: `Failed to upload ${file.name}: ${response.error}` });
        setUploadedFiles(prev => ({ ...prev, [key]: null }));
      }
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.isAgreed) {
      setPopupConfig({ show: true, message: 'Please agree to terms and conditions before saving.' });
      return;
    }
    if (!validateMandatory()) {
      setPopupConfig({ show: true, message: 'Please Enter all required fields!!!' });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    
    // Prepare nested payload as per screenshot
    const payload = {
      reqType: "CREATE",
      username: "",
      bankCode: "NSDL",
      cbcDetails: {
        BasicInformation: {
          firstName: formData.firstName,
          middleName: "",
          lastName: formData.lastName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          country: formData.country || "INDIA",
          state: formData.step2State,
          district: formData.step2District,
          city: formData.city,
          pinCode: formData.pin
        },
        BusinessDetails: {
          numberOfStaff: formData.numberOfStaff,
          faxNumber: formData.faxNumber,
          businessAddress: `${formData.businessAddressLine1} ${formData.businessAddressLine2}`.trim(),
          ceoName: formData.ceoName,
          companyName: formData.companyName,
          gstNumber: formData.gstNumber,
          institutionType: "CBC",
          pan: formData.gstNumber ? formData.gstNumber.substring(2, 12) : "",
          latitude: "0",
          longitude: "0"
        },
        AdminDetails: {
          adminName: formData.step2AdminName,
          adminEmail: formData.adminEmail,
          adminMobileNumber: formData.step2AdminMobileNumber
        },
        BankDetails: {
          accountNumber: formData.accountNumber,
          bankResolution: uploadedFiles.bankResolution?.url || ""
        },
        OtherDetails: {
          affiliationFee: formData.affiliationFee,
          telephoneNumber: formData.telephoneNumber,
          entityId: formData.entityIdReferrer,
          agreementStartDate: formData.agreementFromDate,
          agreementEndDate: formData.agreementToDate,
          entityPanCard: uploadedFiles.kyc?.url || "",
          authorizedSignatoryKyc: uploadedFiles.kyc?.url || "",
          certificateOfIncorporationDocumentPdf: uploadedFiles.incorporation?.url || "",
          incorporationAddress: `${formData.incAddressLine1} ${formData.incAddressLine2}`.trim(),
          firstAndLastPageAgreement: uploadedFiles.firstPage?.url || "",
          lastPageAgreement: uploadedFiles.lastPage?.url || "",
          productFeatures: formData.productFeatures,
          termsAndConditions: formData.isAgreed ? "YES" : "NO",
          businessProposal: uploadedFiles.proposal?.url || ""
        }
      }
    };

    console.log('Onboarding Payload:', payload);

    const response = await cbcOnboard(payload);
    
    if (response.ok) {
      setShowSuccessModal(true);
    } else {
      setPopupConfig({ show: true, message: response.error });
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    // Reset or navigate away if needed
    window.location.reload(); // Simple reset for now
  };

  const renderStep1 = () => (
    <>
      <div className="fields-grid">
        <div className="field-item">
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Enter First Name" />
        </div>
        <div className="field-item">
          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Last Name" />
        </div>
        <div className="field-item">
          <label>Username</label>
          <input name="username" value={formData.username} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Username" />
        </div>
        <div className="field-item">
          <label>Mobile Number</label>
          <input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Mobile Number" />
        </div>
        <div className="field-item">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Email Address" />
        </div>
        <div className="field-item">
          <label>Admin Name</label>
          <input name="adminName" value={formData.adminName} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Admin Name" />
        </div>
        <div className="field-item">
          <label>Address Line 1</label>
          <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Address Line 1" />
        </div>
        <div className="field-item">
          <label>Address Line 2</label>
          <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} onBlur={handleBlur} placeholder="Enter Address Line 2" />
        </div>
        <div className="field-item">
          <label>City</label>
          <input name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} placeholder="Enter City" />
        </div>
        <div className="field-item">
          <label>PIN</label>
          <input name="pin" value={formData.pin} onChange={handleChange} onBlur={handleBlur} placeholder="Enter PIN" />
        </div>
      </div>
      <div className="actions-row">
        <button type="button" className="cancel-button" onClick={handleReset}>Cancel</button>
        <button type="button" className="next-button" onClick={handleNext}>Next</button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="fields-grid step2-grid">
        {/* CEO & Company */}
        <div className="field-item">
          <label>CEO Name</label>
          <input name="ceoName" value={formData.ceoName} onChange={handleChange} placeholder="Enter CEO Name" />
        </div>
        <div className="field-item">
          <label>Company Name</label>
          <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter Company Name" />
        </div>

        <div className="field-item">
          <label>Fax Number</label>
          <input name="faxNumber" value={formData.faxNumber} onChange={handleChange} placeholder="Enter Fax Number" />
        </div>

        {/* Admin Name & Email */}
        <div className="field-item">
          <label>Admin Name</label>
          <input name="step2AdminName" value={formData.step2AdminName} onChange={handleChange} placeholder="Enter Admin Name" />
        </div>
        <div className="field-item">
          <label>Admin Email</label>
          <input name="adminEmail" value={formData.adminEmail} onChange={handleChange} placeholder="Enter Admin Email" />
        </div>

        {/* Admin Mobile & Business Address 1 */}
        <div className="field-item">
          <label>Admin Mobile Number</label>
          <input name="step2AdminMobileNumber" value={formData.step2AdminMobileNumber} onChange={handleChange} placeholder="Enter Admin Mobile Number" />
        </div>
        <div className="field-item">
          <label>Business Address Line 1</label>
          <input name="businessAddressLine1" value={formData.businessAddressLine1} onChange={handleChange} placeholder="Enter Business Address Line 1" />
        </div>

        {/* Business Address 2 & Country */}
        <div className="field-item">
          <label>Business Address Line 2</label>
          <input name="businessAddressLine2" value={formData.businessAddressLine2} onChange={handleChange} placeholder="Enter Business Address Line 2" />
        </div>
        <div className="field-item">
          <label>Country</label>
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Enter Country" />
        </div>

        <div className="field-item">
          <label>State</label>
          <input name="step2State" value={formData.step2State} onChange={handleChange} placeholder="Enter State" />
        </div>
        <div className="field-item">
          <label>City</label>
          <input name="step2City" value={formData.step2City} onChange={handleChange} placeholder="Enter City" />
        </div>
        <div className="field-item">
          <label>District</label>
          <input name="step2District" value={formData.step2District} onChange={handleChange} placeholder="Enter District" />
        </div>

        {/* PIN Bottom & Account Number */}
        <div className="field-item">
          <label>PIN</label>
          <input name="step2PinBottom" value={formData.step2PinBottom} onChange={handleChange} placeholder="Enter PIN" />
        </div>
        <div className="field-item">
          <label>Account Number</label>
          <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Enter Account Number" />
        </div>

        {/* GST & Telephone */}
        <div className="field-item">
          <label>GST Number</label>
          <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="Enter GST Number" />
        </div>
        <div className="field-item">
          <label>Telephone Number</label>
          <input name="telephoneNumber" value={formData.telephoneNumber} onChange={handleChange} placeholder="Enter Telephone Number" />
        </div>

        {/* Affiliation Fee & Entity ID */}
        <div className="field-item">
          <label>Affiliation Fee</label>
          <input name="affiliationFee" value={formData.affiliationFee} onChange={handleChange} placeholder="Enter Affiliation Fee" />
        </div>
        <div className="field-item">
          <label>Entity ID (Referrer)</label>
          <input name="entityIdReferrer" value={formData.entityIdReferrer} onChange={handleChange} placeholder="Enter Entity ID (Referrer)" />
        </div>

        {/* Staff & Agreement From */}
        <div className="field-item">
          <label>Number of Staff</label>
          <input name="numberOfStaff" value={formData.numberOfStaff} onChange={handleChange} placeholder="Enter Number of Staff" />
        </div>
        <div className="field-item">
          <label>Agreement From Date</label>
          <input name="agreementFromDate" value={formData.agreementFromDate} onChange={handleChange} placeholder="Enter Agreement From Date" />
        </div>

        {/* Agreement To & Entity PAN */}
        <div className="field-item">
          <label>Agreement To Date</label>
          <input name="agreementToDate" value={formData.agreementToDate} onChange={handleChange} placeholder="DD/MM/YYYY" />
        </div>
        <div className="field-item">
          <label>Entity PAN Card</label>
          <input name="entityPanCard" value={formData.entityPanCard} onChange={handleChange} placeholder="Enter Entity PAN Card" />
        </div>
      </div>

      {/* Upload Boxes Section */}
      <div className="upload-grid-step2">
        {[
          { key: 'bankResolution', label: 'Upload Bank Resolution', placeholder: 'Upload Bank Resolution (.pdf only)' },
          { key: 'kyc', label: 'Upload Authorized Signatory KYC', placeholder: 'Upload Authorized Signatory KYC (.pdf only)' },
          { key: 'incorporation', label: 'Upload Certificate of Incorporation', placeholder: 'Upload Certificate of Incorporation' },
          { key: 'firstPage', label: 'Upload First Page of Agreement', placeholder: 'Upload First Page of Agreement' },
          { key: 'lastPage', label: 'Upload Last Page of Agreement', placeholder: 'Upload Last Page of Agreement' },
          { key: 'proposal', label: 'Upload Business Proposal', placeholder: 'Upload Business Proposal (.pdf only)' }
        ].map((file) => (
          <div key={file.key} className="upload-field-container">
            <label>{file.label}</label>
            <div className="upload-input-group" onClick={() => handleUploadClick(file.key)}>
              <div className="upload-icon-left"><FiPaperclip /></div>
              <div className="upload-text-middle">{uploadedFiles[file.key]?.name || file.placeholder}</div>
              <div className="upload-icon-right"><FiDownload /></div>
              <input
                type="file"
                ref={fileRefsMap[file.key]}
                style={{ display: 'none' }}
                accept=".pdf"
                onChange={(e) => handleFileChange(e, file.key)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Same as Business Address Checkbox */}
      <div className="checkbox-row-container">
        <label className="custom-checkbox-label">
          <input type="checkbox" name="sameAsBusiness" checked={formData.sameAsBusiness} onChange={handleChange} />
          <span className="checkbox-box"></span>
          Same as Business Address
        </label>
      </div>

      {/* Incorporation Address Section */}
      <div className="fields-grid step2-grid">
        <div className="field-item">
          <label>Incorporation Address Line 1</label>
          <input name="incAddressLine1" value={formData.incAddressLine1} onChange={handleChange} placeholder="Enter Incorporation Address Line 1" />
        </div>
        <div className="field-item">
          <label>Incorporation Address Line 2</label>
          <input name="incAddressLine2" value={formData.incAddressLine2} onChange={handleChange} placeholder="Enter Incorporation Address Line 2" />
        </div>
        <div className="field-item">
          <label>Country</label>
          <input name="incCountry" value={formData.incCountry} onChange={handleChange} placeholder="Enter Country" />
        </div>
        <div className="field-item">
          <label>State</label>
          <input name="incState" value={formData.incState} onChange={handleChange} placeholder="Enter State" />
        </div>
        <div className="field-item">
          <label>City</label>
          <input name="incCity" value={formData.incCity} onChange={handleChange} placeholder="Enter City" />
        </div>
        <div className="field-item">
          <label>District</label>
          <input name="incDistrict" value={formData.incDistrict} onChange={handleChange} placeholder="Enter District" />
        </div>
        <div className="field-item">
          <label>PIN</label>
          <input name="incPin" value={formData.incPin} onChange={handleChange} placeholder="Enter PIN" />
        </div>
      </div>

      {/* Product Features Custom Multi-Select Dropdown */}
      <div className="field-item full-width-field" ref={productFeaturesRef}>
        <label>Product Features</label>
        <div className="custom-multi-select">
          <div
            className={`multi-select-trigger ${productFeaturesOpen ? 'open' : ''}`}
            onClick={() => setProductFeaturesOpen(!productFeaturesOpen)}
          >
            <span className="selected-display">
              {formData.productFeatures.length > 0
                ? formData.productFeatures.join(', ')
                : 'Select Product Features'}
            </span>
            <FiChevronDown className={`trigger-icon ${productFeaturesOpen ? 'rotate' : ''}`} />
          </div>

          {productFeaturesOpen && (
            <div className="multi-select-dropdown-list">
              {productOptions.map((option) => (
                <div
                  key={option}
                  className={`dropdown-option ${formData.productFeatures.includes(option) ? 'selected' : ''}`}
                  onClick={() => handleProductFeatureToggle(option)}
                >
                  <div className="option-checkbox">
                    {formData.productFeatures.includes(option) && <span className="check-mark">✓</span>}
                  </div>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="terms-container">
        <label className="custom-checkbox-label align-top">
          <input type="checkbox" name="isAgreed" checked={formData.isAgreed} onChange={handleChange} />
          <span className="checkbox-box"></span>
          <p className="terms-text">
            By using our services, you confirm that you are at least 18 years old and legally capable of entering into agreements. You are responsible for securing your account details and for any activity under your account. Fees may apply to certain services, which will be disclosed at the time of use. Services are provided for personal, lawful purposes only. Your personal data will be handled in accordance with our Privacy Policy. We may update these terms from time to time, and your continued use of the services constitutes acceptance of any changes. We are not liable for any damages arising from the use of our services, except where required by law. We reserve the right to suspend or terminate your access if you violate these terms. These terms are governed by the laws of [Jurisdiction].
          </p>
        </label>
      </div>

      {popupConfig.show && (
        <div className="error-popup-overlay">
          <div className="error-popup-toast">
            <FiX className="toast-icon" onClick={() => setPopupConfig({ ...popupConfig, show: false })} />
            <span className="toast-message">{popupConfig.message}</span>
            <button className="toast-close-btn" onClick={() => setPopupConfig({ ...popupConfig, show: false })}>Close</button>
          </div>
        </div>
      )}

      <div className="actions-row step2-actions">
        <button type="button" className="cancel-button" onClick={() => setStep(1)}>Cancel</button>
        <button type="submit" className="save-button" onClick={handleSubmit}>Save</button>
      </div>

    </>
  );

  return (
    <div className="create-cbc-user-page">
      <div className="page-breadcrumb">
        <span>User Management</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-active">Create CBC User</span>
      </div>

      <h1 className="page-header-title">Create CBC User</h1>

      <div className="create-cbc-card scrollable-card">
        <form className="create-cbc-form">
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>

      {popupConfig.show && (
        <div className="toast-container">
          <div className="error-popup-toast">
            <FiX className="toast-icon" />
            <span className="toast-message">{popupConfig.message}</span>
            <button className="toast-close-btn" onClick={() => setPopupConfig({ show: false, message: '' })}>
              CLOSE
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal-box">
            <h2 className="modal-title">Are you sure you want to Create this User?</h2>
            <p className="modal-message">
              Please review all the entered details carefully before confirming, as creating this user will permanently add them to the system.
            </p>
            <div className="modal-actions">
              <button className="modal-no-btn" onClick={() => setShowConfirmModal(false)}>NO</button>
              <button className="modal-yes-btn" onClick={handleFinalSubmit}>Yes Create</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal-box">
            <div className="modal-logo-container">
              <img src={bankLogo} alt="NSDL Logo" className="modal-logo" />
            </div>
            <div className="success-icon-container">
              <div className="success-circle">
                <FiCheck className="success-check-icon" />
              </div>
            </div>
            <h2 className="success-title">User Created Successfully!</h2>
            <button className="done-btn" onClick={handleCloseSuccess}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCbcUser;

