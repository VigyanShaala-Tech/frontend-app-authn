import { getConfig } from '@edx/frontend-platform';

export const resolveAbsoluteRedirectUrl = (redirectUrl) => {
  const fallback = `${(getConfig().LMS_BASE_URL || '').replace(/\/$/, '')}/dashboard`;

  if (!redirectUrl) {
    return fallback;
  }

  if (/^https?:\/\//i.test(redirectUrl)) {
    return redirectUrl;
  }

  const base = (getConfig().LMS_BASE_URL || '').replace(/\/$/, '');
  const path = redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`;
  return `${base}${path}`;
};
