import { getConfig } from '@edx/frontend-platform';

export const normalizeCohortEnrollmentSuccess = (data = {}) => {
  const lmsBaseUrl = getConfig().LMS_BASE_URL || '';

  return {
    email: data.email || '',
    courseTitle: data.course_title || data.courseTitle || '',
    courseStartDate: data.course_start_date || data.courseStartDate || '',
    dashboardUrl: data.dashboard_url || data.dashboardUrl || `${lmsBaseUrl}/dashboard`,
    appDownloadUrl: data.app_download_url || data.appDownloadUrl || 'https://play.google.com/store',
    supportEmail: data.support_email || data.supportEmail || 'support@vigyanshaala.com',
  };
};
