import React, { useCallback, useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate, useParams } from 'react-router-dom';

import { LOGIN_PAGE } from '../../../data/constants';
import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import CohortSuccessView from '../../components/CohortSuccessView/CohortSuccessView';
import CohortSubmitErrorAlert from '../../components/CohortSubmitErrorAlert/CohortSubmitErrorAlert';
import { buildCohortRegisterPath, buildCohortVerifyEmailPath } from '../../data/constants';
import cohortApiMessages from '../../messages/cohortApiMessages';
import { startCohortEmailRegistration, startCohortGoogleAuth } from '../../services/cohortRegistrationService';
import { resolveCohortMessage } from '../../utils/cohortApiMessage';
import {
  getCohortFormSubmittedSession,
  setCohortFormSubmittedEmailError,
  setCohortFormSubmittedGoogleError,
} from '../../utils/cohortFormSubmittedSession';
import { setCohortVerifyEmailSession } from '../../utils/cohortVerifyEmailSession';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortFormSubmittedPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const logoUrl = getConfig().LOGO_URL;

  const [sessionData, setSessionData] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate(buildCohortRegisterPath(''), { replace: true });
      return;
    }

    const data = getCohortFormSubmittedSession(slug);
    if (!data) {
      navigate(buildCohortRegisterPath(slug), { replace: true });
      return;
    }

    setSessionData(data);
    setCheckingAccess(false);
  }, [slug, navigate]);

  const handleEmailSignup = useCallback(async () => {
    if (emailSubmitting || !slug) {
      return;
    }

    if (sessionData?.userAlreadyExists) {
      navigate(LOGIN_PAGE);
      return;
    }

    setEmailSubmitting(true);

    const result = await startCohortEmailRegistration();

    if (!result.success) {
      const errorMessage = resolveCohortMessage(
        result.message,
        cohortApiMessages.emailStartFailed,
        intl.formatMessage,
      );
      setCohortFormSubmittedEmailError(slug, errorMessage);
      setSessionData(getCohortFormSubmittedSession(slug));
      setEmailSubmitting(false);
      return;
    }

    setCohortVerifyEmailSession(slug, {
      message: result.message || '',
      email: sessionData?.email || '',
    });
    navigate(
      buildCohortVerifyEmailPath(slug, sessionData?.email || ''),
      {
        replace: true,
        state: {
          message: result.message || '',
          email: sessionData?.email || '',
        },
      },
    );
  }, [emailSubmitting, intl, navigate, sessionData?.email, sessionData?.userAlreadyExists, slug]);

  const handleGoogleSignup = useCallback(async () => {
    if (googleSubmitting || !slug) {
      return;
    }

    setGoogleSubmitting(true);
    setCohortFormSubmittedGoogleError(slug, '');
    setSessionData(getCohortFormSubmittedSession(slug));

    const result = await startCohortGoogleAuth();

    if (!result.success) {
      const errorMessage = resolveCohortMessage(
        result.message,
        result.reason === 'no_redirect'
          ? cohortApiMessages.googleSignInUnavailable
          : cohortApiMessages.googleSignInFailed,
        intl.formatMessage,
      );
      setCohortFormSubmittedGoogleError(slug, errorMessage);
      setSessionData(getCohortFormSubmittedSession(slug));
      setGoogleSubmitting(false);
      return;
    }

    window.location.assign(result.redirectUrl);
  }, [googleSubmitting, intl, slug]);

  if (checkingAccess) {
    return (
      <div className="cohort-register-page">
        <div className="cohort-register-page__container">
          <CohortLoadingSpinner />
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return null;
  }

  const authErrorMessage = sessionData.emailErrorMessage || sessionData.googleErrorMessage;

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <div className="cohort-register-page__header">
          {logoUrl && (
            <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
          )}
          {sessionData.pageTitle && (
            <h1 className="cohort-register-page__title">{sessionData.pageTitle}</h1>
          )}
        </div>

        <div className="cohort-register-page__content">
          <CohortSuccessView
            thanksMessage={sessionData.thanksMessage}
            googleLoginUrl={sessionData.googleLoginUrl}
            email={sessionData.email}
            slug={slug}
            userAlreadyExists={sessionData.userAlreadyExists}
            onEmailSignup={handleEmailSignup}
            onGoogleSignup={handleGoogleSignup}
            emailSubmitting={emailSubmitting}
            googleSubmitting={googleSubmitting}
          />

          {authErrorMessage && (
            <CohortSubmitErrorAlert message={authErrorMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortFormSubmittedPage;
