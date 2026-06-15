const STORAGE_PREFIX = 'cohort-enrollment:';

export const setCohortEnrollmentSession = (slug, enrollment) => {
  if (!slug) {
    return;
  }

  sessionStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify({
    slug,
    ...enrollment,
  }));
};

export const getCohortEnrollmentSession = (slug) => {
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

export const clearCohortEnrollmentSession = (slug) => {
  if (!slug) {
    return;
  }

  sessionStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
};
