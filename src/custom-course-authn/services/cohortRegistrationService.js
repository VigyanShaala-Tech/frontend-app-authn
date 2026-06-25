import {
  activateCohortEmailApi,
  checkCohortEligibilityApi,
  completeCohortGoogleAuthApi,
  fetchCohortRegistrationFormApi,
  prepareCohortAuthApi,
  startCohortEmailRegistrationApi,
  startCohortGoogleAuthApi,
  submitCohortSetPasswordApi,
} from '../api/cohortRegistrationApi';
import { extractApiMessage } from '../utils/cohortApiMessage';
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
        message: extractApiMessage(data),
        status: data.status,
        userAlreadyExists: Boolean(data.useralreadyexists),
      };
    }
    const loginOptions = data.loginoptions || data.loginOptions || {};
    return {
      success: true,
      thanksMessage: data.thanksmessage || data.thanksMessage || '',
      loginOptions,
      userAlreadyExists: Boolean(data.useralreadyexists),
      isLoggedIn: Boolean(data.isloggedin),
      redirectUrl: data.redirecturl || data.redirectUrl || '',
    };
  } catch (error) {
    return {
      success: false,
      message: extractApiMessage(error),
      status: error?.response?.status,
      userAlreadyExists: Boolean(error?.response?.data?.useralreadyexists),
    };
  }
};

export const startCohortGoogleAuth = async () => {
  try {
    const data = await startCohortGoogleAuthApi();
    if (data.success === false) {
      return {
        success: false,
        message: extractApiMessage(data),
      };
    }

    const redirectUrl = data.redirecturl || data.redirect_url || data.redirectUrl || '';
    if (!redirectUrl) {
      return {
        success: false,
        message: extractApiMessage(data),
        reason: 'no_redirect',
      };
    }

    return {
      success: true,
      redirectUrl,
    };
  } catch (error) {
    return {
      success: false,
      message: extractApiMessage(error),
    };
  }
};

const resolveGoogleRedirectUrl = (data = {}) => (
  data.redirecturl || data.redirect_url || data.redirectUrl || '/dashboard'
);

export const completeCohortGoogleAuth = async (payload) => {
  try {
    const data = await completeCohortGoogleAuthApi({
      code: payload.code || '',
      state: payload.state || '',
      slug: payload.slug || '',
      error: payload.error || '',
    });

    const redirectUrl = resolveGoogleRedirectUrl(data);

    if (data.alreadycompleted) {
      return {
        success: true,
        message: extractApiMessage(data),
        redirectUrl,
      };
    }

    if (data.success === false) {
      return {
        success: false,
        message: extractApiMessage(data),
        error: data.error || data.errorcode || '',
        slug: data.slug || payload.slug || '',
      };
    }

    return {
      success: true,
      message: extractApiMessage(data),
      redirectUrl,
      platform: data.platform || '',
    };
  } catch (error) {
    const responseData = error?.response?.data || {};
    return {
      success: false,
      message: extractApiMessage(error),
      error: responseData.error || responseData.errorcode || '',
      slug: responseData.slug || payload.slug || '',
    };
  }
};

export const startCohortEmailRegistration = async () => {
  try {
    const data = await startCohortEmailRegistrationApi();
    if (data.success === false) {
      return {
        success: false,
        message: extractApiMessage(data),
      };
    }

    return {
      success: true,
      message: extractApiMessage(data),
    };
  } catch (error) {
    return {
      success: false,
      message: extractApiMessage(error),
    };
  }
};

export const activateCohortEmail = async (slug, activationKey) => {
  try {
    const data = await activateCohortEmailApi(slug, activationKey);
    if (data.success === false) {
      return {
        valid: false,
        message: extractApiMessage(data),
        alreadyCompleted: Boolean(data.alreadycompleted),
        redirectUrl: data.redirecturl || data.redirectUrl || '',
      };
    }

    return {
      valid: true,
      email: data.email || '',
      name: data.name || '',
    };
  } catch (error) {
    const responseData = error?.response?.data || {};
    return {
      valid: false,
      message: extractApiMessage(error),
      alreadyCompleted: Boolean(responseData.alreadycompleted),
      redirectUrl: responseData.redirecturl || responseData.redirectUrl || '',
    };
  }
};

export const submitCohortSetPassword = async ({ password, confirmPassword }) => {
  try {
    const data = await submitCohortSetPasswordApi({
      password,
      confirmpassword: confirmPassword,
    });

    if (data.success === false) {
      return {
        success: false,
        message: extractApiMessage(data),
      };
    }

    return {
      success: true,
      email: data.email || '',
      course_name: data.course_name || '',
      start_date: data.start_date || '',
      app_url: data.app_url || '',
      support_email: data.support_email || '',
    };
  } catch (error) {
    return {
      success: false,
      message: extractApiMessage(error),
    };
  }
};
