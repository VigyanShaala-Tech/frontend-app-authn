import { getConfig } from '@edx/frontend-platform';

export const normalizeCohortEnrollmentSuccess = (data) => {
  const safeData = data || {};
  const lmsBaseUrl = getConfig().LMS_BASE_URL || '';

  return {
    email: safeData.email || '',
    courseTitle: safeData.course_title || safeData.courseTitle || safeData.course_name || '',
    courseStartDate: safeData.course_start_date || safeData.courseStartDate || safeData.start_date || '',
    dashboardUrl: safeData.dashboard_url || safeData.dashboardUrl || `${lmsBaseUrl}/dashboard`,
    appDownloadUrl: safeData.app_download_url || safeData.appDownloadUrl || safeData.app_url || '',
    supportEmail: safeData.support_email || safeData.supportEmail || '',
  };
};
