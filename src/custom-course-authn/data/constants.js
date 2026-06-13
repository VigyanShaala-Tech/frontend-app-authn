export const COHORT_REGISTER_PAGE = '/cohort-register/:slug';
export const COHORT_GOOGLE_CALLBACK_PAGE = '/cohort-register/google/callback';
export const COHORT_FORM_SUBMITTED_PAGE = '/cohort-register/:slug/form-submitted';
export const COHORT_VERIFY_EMAIL_PAGE = '/cohort-register/:slug/verify-email';
export const COHORT_SET_PASSWORD_PAGE = '/cohort-register/:slug/auth';
export const COHORT_REGISTRATION_SUCCESS_PAGE = '/cohort-register/:slug/auth/success';

export const buildCohortRegisterPath = (slug) => (
  slug ? `/cohort-register/${slug}` : '/cohort-register'
);

export const buildCohortFormSubmittedPath = (slug) => (
  `/cohort-register/${slug}/form-submitted`
);

export const buildCohortRegistrationSuccessPath = (slug, { activationKey, method = 'email' } = {}) => {
  const params = new URLSearchParams();
  if (method) {
    params.set('method', method);
  }
  if (activationKey) {
    params.set('activation_key', activationKey);
  }
  const query = params.toString();
  return `/cohort-register/${slug}/auth/success${query ? `?${query}` : ''}`;
};

export const COHORT_ACTIVATION_VALIDATE_API = '/api/v1/cohort-registration/:slug/activation/';
export const COHORT_SET_PASSWORD_API = '/api/v1/cohort-registration/:slug/set-password/';

export const buildCohortVerifyEmailPath = (slug, email) => {
  const basePath = `/cohort-register/${slug}/verify-email`;
  if (!email) {
    return basePath;
  }
  return `${basePath}?email=${encodeURIComponent(email)}`;
};

export const COHORT_REGISTRATION_FORM_API = '/api/v1/cohort-registration/:slug/form/';
export const COHORT_CHECK_ELIGIBILITY_API = '/api/v1/cohort-registration/:slug/check-eligibility/';
export const COHORT_PREPARE_AUTH_API = '/api/v1/cohort-registration/:slug/prepare-auth/';
export const COHORT_EMAIL_SIGNUP_API = '/api/v1/cohort-registration/:slug/signup/email/';
export const COHORT_GOOGLE_SIGNUP_API = '/api/v1/cohort-registration/:slug/signup/google/';
export const COHORT_GOOGLE_COMPLETE_API = '/api/v1/cohort-registration/google/complete/';

export const OTHER_OPTION_VALUE = '__other__';

export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  TELEPHONE: 'telephone',
  URL: 'url',
  SEARCH: 'search',
  TEXTAREA: 'textarea',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime',
  DATETIME_LOCAL: 'datetime-local',
  MONTH: 'month',
  WEEK: 'week',
  RANGE: 'range',
  COLOR: 'color',
  FILE: 'file',
  IMAGE: 'image',
  HIDDEN: 'hidden',
  CASCADE_SELECT: 'cascade_select',
};
