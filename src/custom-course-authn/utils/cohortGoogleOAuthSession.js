const GOOGLE_OAUTH_SLUG_KEY = 'cohort-google-oauth-slug';

export const setCohortGoogleOAuthSlug = (slug) => {
  if (!slug) {
    return;
  }

  sessionStorage.setItem(GOOGLE_OAUTH_SLUG_KEY, slug);
};

export const getCohortGoogleOAuthSlug = () => (
  sessionStorage.getItem(GOOGLE_OAUTH_SLUG_KEY) || ''
);

export const clearCohortGoogleOAuthSlug = () => {
  sessionStorage.removeItem(GOOGLE_OAUTH_SLUG_KEY);
};
