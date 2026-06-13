import {
  checkCohortEligibilityApi,
  completeCohortGoogleAuthApi,
  fetchCohortRegistrationFormApi,
  prepareCohortAuthApi,
  sendCohortEmailSignupApi,
  sendCohortGoogleSignupApi,
  submitCohortSetPasswordApi,
  validateCohortActivationApi,
} from '../api/cohortRegistrationApi';
import { normalizeFormResponse } from '../utils/formNormalizer';

export const fetchCohortRegistrationForm = async (slug) => {
  const data = await fetchCohortRegistrationFormApi(slug);
  return normalizeFormResponse(data);
};

export const checkCohortEligibility = async (slug, formPayload, triggerField) => {
  const data = await checkCohortEligibilityApi(slug, {
    ...formPayload,
    triggerField,
  });
  return {
    valid: Boolean(data.is_eligible),
    message: data.message || '',
  };
};

export const prepareCohortAuth = async (slug, payload) => {
  try {
    const data = await prepareCohortAuthApi(slug, payload);
    if (data.success === false) {
      return {
        success: false,
        message: data.message || '',
      };
    }
    const loginOptions = data.loginoptions || data.loginOptions || {};
    return {
      success: true,
      thanksMessage: data.thanksmessage || data.thanksMessage || '',
      loginOptions,
    };
  } catch (error) {
    const apiMessage = error?.response?.data?.message;
    return {
      success: false,
      message: apiMessage || '',
      status: error?.response?.status,
    };
  }
};

export const sendCohortEmailSignup = async (slug, payload) => (
  sendCohortEmailSignupApi(slug, payload)
);

export const sendCohortGoogleSignup = async (slug, payload) => (
  sendCohortGoogleSignupApi(slug, payload)
);

export const completeCohortGoogleAuth = async (payload) => {
  try {
    const data = await completeCohortGoogleAuthApi(payload);
    if (data.success === false) {
      return {
        success: false,
        message: data.message || '',
        error: data.error || '',
        slug: data.slug || payload.slug || '',
      };
    }

    return {
      success: true,
      message: data.message || '',
      redirectUrl: data.redirect_url || data.redirectUrl || '/dashboard',
      platform: data.platform || '',
    };
  } catch (error) {
    const responseData = error?.response?.data || {};
    return {
      success: false,
      message: responseData.message || 'Google sign-in failed. Please try again.',
      error: responseData.error || '',
      slug: responseData.slug || payload.slug || '',
    };
  }
};

export const validateCohortActivation = async (slug, activationKey) => (
  validateCohortActivationApi(slug, activationKey)
);

export const submitCohortSetPassword = async (slug, payload) => (
  submitCohortSetPasswordApi(slug, payload)
);
