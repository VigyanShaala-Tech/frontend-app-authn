import React, { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import { buildCohortFormSubmittedPath, buildCohortRegisterPath } from '../../data/constants';
import { completeCohortGoogleAuth } from '../../services/cohortRegistrationService';
import { setCohortFormSubmittedGoogleError } from '../../utils/cohortFormSubmittedSession';
import {
  clearCohortGoogleOAuthSlug,
  getCohortGoogleOAuthSlug,
} from '../../utils/cohortGoogleOAuthSession';
import { resolveAbsoluteRedirectUrl } from '../../utils/redirectUtils';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortGoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const handleGoogleCallback = async () => {
      const code = searchParams.get('code') || '';
      const state = searchParams.get('state') || '';
      const error = searchParams.get('error') || '';
      const slug = getCohortGoogleOAuthSlug();

      try {
        const result = await completeCohortGoogleAuth({
          code,
          state,
          slug,
          error,
        });

        if (!mounted) {
          return;
        }

        if (result.success) {
          window.location.assign(resolveAbsoluteRedirectUrl(result.redirectUrl));
          return;
        }

        const failSlug = result.slug || slug;
        if (failSlug) {
          setCohortFormSubmittedGoogleError(failSlug, result.message || '');
          navigate(buildCohortFormSubmittedPath(failSlug), { replace: true });
          return;
        }

        navigate(buildCohortRegisterPath(''), { replace: true });
      } catch {
        if (!mounted) {
          return;
        }

        if (slug) {
          setCohortFormSubmittedGoogleError(slug, 'Google sign-in failed. Please try again.');
          navigate(buildCohortFormSubmittedPath(slug), { replace: true });
          return;
        }

        navigate(buildCohortRegisterPath(''), { replace: true });
      } finally {
        clearCohortGoogleOAuthSlug();
      }
    };

    handleGoogleCallback();

    return () => {
      mounted = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <CohortLoadingSpinner />
      </div>
    </div>
  );
};

export default CohortGoogleCallbackPage;
