import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import {
  COHORT_CHECK_ELIGIBILITY_API,
  COHORT_EMAIL_ACTIVATE_API,
  COHORT_EMAIL_SET_PASSWORD_API,
  COHORT_EMAIL_START_API,
  COHORT_GOOGLE_COMPLETE_API,
  COHORT_GOOGLE_START_API,
  COHORT_PREFILL_API,
  COHORT_PREPARE_AUTH_API,
  COHORT_REGISTRATION_FORM_API,
} from '../data/constants';

const getLmsBaseUrl = () => getConfig().LMS_BASE_URL || '';

const buildCohortApiUrl = (pathTemplate, slug) => (
  `${getLmsBaseUrl()}${pathTemplate.replace(':slug', slug)}`
);

const getPublicRequestConfig = (extraConfig = {}) => ({
  isPublic: true,
  ...extraConfig,
});

const getClient = () => getAuthenticatedHttpClient();

export const fetchCohortRegistrationFormApi = async (slug) => {
  const url = buildCohortApiUrl(COHORT_REGISTRATION_FORM_API, slug);
  const { data } = await getClient().get(url, getPublicRequestConfig());
  return data;
};

export const checkCohortEligibilityApi = async (slug, payload) => {
  const url = buildCohortApiUrl(COHORT_CHECK_ELIGIBILITY_API, slug);
  const { data } = await getClient().post(url, payload, getPublicRequestConfig());
  return data;
};

export const prefillCohortFormApi = async (slug, email) => {
  const url = buildCohortApiUrl(COHORT_PREFILL_API, slug);
  const { data } = await getClient().post(url, { email }, getPublicRequestConfig());
  return data;
};

export const prepareCohortAuthApi = async (slug, payload) => {
  const url = buildCohortApiUrl(COHORT_PREPARE_AUTH_API, slug);
  const { data } = await getClient().post(url, payload, getPublicRequestConfig());
  return data;
};

export const startCohortGoogleAuthApi = async () => {
  const url = `${getLmsBaseUrl()}${COHORT_GOOGLE_START_API}`;
  const { data } = await getClient().post(url, undefined, getPublicRequestConfig());
  return data;
};

export const completeCohortGoogleAuthApi = async (payload) => {
  const url = `${getLmsBaseUrl()}${COHORT_GOOGLE_COMPLETE_API}`;
  const { data } = await getClient().post(url, payload, {
    ...getPublicRequestConfig(),
    validateStatus: (status) => status >= 200 && status < 500,
  });
  return data;
};

export const startCohortEmailRegistrationApi = async () => {
  const url = `${getLmsBaseUrl()}${COHORT_EMAIL_START_API}`;
  const { data } = await getClient().post(url, undefined, getPublicRequestConfig());
  return data;
};

export const activateCohortEmailApi = async (slug, activationKey) => {
  const url = `${getLmsBaseUrl()}${COHORT_EMAIL_ACTIVATE_API}`;
  const { data } = await getClient().post(url, {
    activation_key: activationKey,
    slug,
  }, getPublicRequestConfig());
  return data;
};

export const submitCohortSetPasswordApi = async (payload) => {
  const url = `${getLmsBaseUrl()}${COHORT_EMAIL_SET_PASSWORD_API}`;
  const { data } = await getClient().post(url, payload, getPublicRequestConfig());
  return data;
};
