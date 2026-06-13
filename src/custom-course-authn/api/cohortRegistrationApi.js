import { getConfig } from '@edx/frontend-platform';
import { getHttpClient } from '@edx/frontend-platform/auth';

import {
  COHORT_ACTIVATION_VALIDATE_API,
  COHORT_CHECK_ELIGIBILITY_API,
  COHORT_EMAIL_SIGNUP_API,
  COHORT_GOOGLE_COMPLETE_API,
  COHORT_GOOGLE_SIGNUP_API,
  COHORT_PREPARE_AUTH_API,
  COHORT_REGISTRATION_FORM_API,
  COHORT_SET_PASSWORD_API,
} from '../data/constants';

const getLmsBaseUrl = () => getConfig().LMS_BASE_URL || '';

const buildCohortApiUrl = (pathTemplate, slug) => (
  `${getLmsBaseUrl()}${pathTemplate.replace(':slug', slug)}`
);

export const fetchCohortRegistrationFormApi = async (slug) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_REGISTRATION_FORM_API, slug);
  const { data } = await client.get(url);
  return data;
};

export const checkCohortEligibilityApi = async (slug, payload) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_CHECK_ELIGIBILITY_API, slug);
  const { data } = await client.post(url, payload);
  return data;
};

export const prepareCohortAuthApi = async (slug, payload) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_PREPARE_AUTH_API, slug);
  const { data } = await client.post(url, payload);
  return data;
};

export const sendCohortEmailSignupApi = async (slug, payload) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_EMAIL_SIGNUP_API, slug);
  const { data } = await client.post(url, payload);
  return data;
};

export const sendCohortGoogleSignupApi = async (slug, payload) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_GOOGLE_SIGNUP_API, slug);
  const { data } = await client.post(url, payload);
  return data;
};

export const completeCohortGoogleAuthApi = async (payload) => {
  const client = getHttpClient();
  const url = `${getLmsBaseUrl()}${COHORT_GOOGLE_COMPLETE_API}`;
  const { data } = await client.post(url, payload);
  return data;
};

export const validateCohortActivationApi = async (slug, activationKey) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_ACTIVATION_VALIDATE_API, slug);
  const { data } = await client.get(url, { params: { activation_key: activationKey } });
  return data;
};

export const submitCohortSetPasswordApi = async (slug, payload) => {
  const client = getHttpClient();
  const url = buildCohortApiUrl(COHORT_SET_PASSWORD_API, slug);
  const { data } = await client.post(url, payload);
  return data;
};
