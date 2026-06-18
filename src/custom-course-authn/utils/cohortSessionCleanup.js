import { clearCohortGoogleOAuthSlug } from './cohortGoogleOAuthSession';

const COHORT_STORAGE_PREFIXES = [
  'cohort-form-submitted:',
  'cohort-verify-email:',
  'cohort-enrollment:',
];

export const clearAllCohortRegistrationSessions = (slug) => {
  if (typeof sessionStorage === 'undefined') {
    return;
  }

  if (slug) {
    COHORT_STORAGE_PREFIXES.forEach((prefix) => {
      sessionStorage.removeItem(`${prefix}${slug}`);
    });
  } else {
    const keysToRemove = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (key && COHORT_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  }

  clearCohortGoogleOAuthSlug();
};
