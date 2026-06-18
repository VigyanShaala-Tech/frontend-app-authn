const STORAGE_PREFIX = 'cohort-form-submitted:';

export const setCohortFormSubmittedSession = (slug, payload) => {
  if (!slug) {
    return;
  }

  sessionStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify({
    slug,
    ...payload,
  }));
};

export const getCohortFormSubmittedSession = (slug) => {
  if (!slug) {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) {
      return null;
    }

    const data = JSON.parse(raw);
    if (data.slug !== slug) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const clearCohortFormSubmittedSession = (slug) => {
  if (!slug) {
    return;
  }

  sessionStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
};

export const setCohortFormSubmittedGoogleError = (slug, message) => {
  if (!slug) {
    return;
  }

  const existing = getCohortFormSubmittedSession(slug) || { slug };
  setCohortFormSubmittedSession(slug, {
    ...existing,
    googleErrorMessage: message || '',
    emailErrorMessage: '',
  });
};

export const setCohortFormSubmittedEmailError = (slug, message) => {
  if (!slug) {
    return;
  }

  const existing = getCohortFormSubmittedSession(slug) || { slug };
  setCohortFormSubmittedSession(slug, {
    ...existing,
    emailErrorMessage: message || '',
    googleErrorMessage: '',
  });
};
