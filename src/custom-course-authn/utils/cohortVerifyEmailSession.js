const STORAGE_PREFIX = 'cohort-verify-email:';

export const setCohortVerifyEmailSession = (slug, payload) => {
  if (!slug) {
    return;
  }

  sessionStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify({
    slug,
    ...payload,
  }));
};

export const getCohortVerifyEmailSession = (slug) => {
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

export const clearCohortVerifyEmailSession = (slug) => {
  if (!slug) {
    return;
  }

  sessionStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
};
