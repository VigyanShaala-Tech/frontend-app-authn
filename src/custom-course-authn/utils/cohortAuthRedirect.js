import { getConfig } from '@edx/frontend-platform';

import { DEFAULT_REDIRECT_URL } from '../../data/constants';

export const getCohortDashboardUrl = () => (
  getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL)
);

export const redirectToCohortDashboard = () => {
  global.location.href = getCohortDashboardUrl();
};
