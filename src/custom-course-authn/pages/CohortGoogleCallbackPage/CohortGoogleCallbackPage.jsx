import React, { useEffect } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import { buildCohortFormSubmittedPath, buildCohortRegisterPath } from '../../data/constants';
import cohortApiMessages from '../../messages/cohortApiMessages';
import { completeCohortGoogleAuth } from '../../services/cohortRegistrationService';
import { resolveCohortMessage } from '../../utils/cohortApiMessage';
import { setCohortFormSubmittedGoogleError } from '../../utils/cohortFormSubmittedSession';
import {
  clearCohortGoogleOAuthSlug,
  getCohortGoogleOAuthSlug,
  setCohortGoogleOAuthSlug,
} from '../../utils/cohortGoogleOAuthSession';
import { clearAllCohortRegistrationSessions } from '../../utils/cohortSessionCleanup';
import { resolveAbsoluteRedirectUrl } from '../../utils/redirectUtils';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortGoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    let mounted = true;

    const handleGoogleCallback = async () => {
      const code = searchParams.get('code') || '';
      const state = searchParams.get('state') || '';
      const error = searchParams.get('error') || '';
      const slugFromQuery = searchParams.get('slug') || '';
      const slug = slugFromQuery || getCohortGoogleOAuthSlug();

      if (slug && !slugFromQuery) {
        setCohortGoogleOAuthSlug(slug);
      }

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
          clearAllCohortRegistrationSessions(slug);
          window.location.assign(resolveAbsoluteRedirectUrl(result.redirectUrl));
          return;
        }

        const failSlug = result.slug || slug;
        const errorMessage = resolveCohortMessage(
          result.message,
          cohortApiMessages.googleSignInFailed,
          intl.formatMessage,
        );

        if (failSlug) {
          setCohortFormSubmittedGoogleError(failSlug, errorMessage);
          navigate(buildCohortFormSubmittedPath(failSlug), { replace: true });
          return;
        }

        navigate(buildCohortRegisterPath(''), { replace: true });
      } catch {
        if (!mounted) {
          return;
        }

        const errorMessage = resolveCohortMessage(
          '',
          cohortApiMessages.googleSignInFailed,
          intl.formatMessage,
        );

        if (slug) {
          setCohortFormSubmittedGoogleError(slug, errorMessage);
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
  }, [intl, navigate, searchParams]);

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <CohortLoadingSpinner />
      </div>
    </div>
  );
};

export default CohortGoogleCallbackPage;
