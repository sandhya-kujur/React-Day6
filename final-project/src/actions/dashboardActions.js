export const initialCbcFormState = {
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
  agreementFromDate: '2026-04-19',
  agreementToDate: '2026-04-19',
  entityPanCard: '',
  incorporationAddressLine1: '',
  productFeatures: 'ACCOUNT_OPENING',
};

export const validateCbcForm = (formData) => {
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

export const initialUserRequestState = {
    fromDate: '2026-04-19',
    toDate: '2026-04-19',
    userType: 'CBC',
    status: 'Approved'
};

export const validateUsername = (username) => {
    if (!username || !username.trim()) {
        return 'Username is required';
    }
    return '';
};
