import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import CohortEmailSentView from '../../components/CohortSuccessView/CohortEmailSentView';
import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import { buildCohortFormSubmittedPath, buildCohortRegisterPath } from '../../data/constants';
import cohortApiMessages from '../../messages/cohortApiMessages';
import { resolveCohortMessage } from '../../utils/cohortApiMessage';
import {
  getCohortVerifyEmailSession,
  setCohortVerifyEmailSession,
} from '../../utils/cohortVerifyEmailSession';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortVerifyEmailPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();
  const logoUrl = getConfig().LOGO_URL;
  const queryEmail = searchParams.get('email') || '';

  const [verifyData, setVerifyData] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate(buildCohortRegisterPath(''), { replace: true });
      return;
    }

    const session = getCohortVerifyEmailSession(slug);
    const email = session?.email || location.state?.email || queryEmail || '';
    const apiMessage = session?.message || location.state?.message || '';
    const message = apiMessage || (email
      ? resolveCohortMessage(
        '',
        cohortApiMessages.verifyEmailFallback,
        intl.formatMessage,
        { email },
      )
      : '');

    if (!message) {
      navigate(buildCohortFormSubmittedPath(slug), { replace: true });
      return;
    }

    if (!session?.message) {
      setCohortVerifyEmailSession(slug, { message, email });
    }

    setVerifyData({ email, message });
    setCheckingAccess(false);
  }, [intl, location.state, navigate, queryEmail, slug]);

  if (checkingAccess) {
    return (
      <div className="cohort-register-page">
        <div className="cohort-register-page__container">
          <CohortLoadingSpinner />
        </div>
      </div>
    );
  }

  if (!verifyData) {
    return null;
  }

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <div className="cohort-register-page__header">
          {logoUrl && (
            <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
          )}
        </div>
        <div className="cohort-register-page__content">
          <CohortEmailSentView
            email={verifyData.email || queryEmail}
            message={verifyData.message}
          />
        </div>
      </div>
    </div>
  );
};

export default CohortVerifyEmailPage;
