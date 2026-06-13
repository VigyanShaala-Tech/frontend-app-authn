import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useNavigate, useParams } from 'react-router-dom';

import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import CohortSuccessView from '../../components/CohortSuccessView/CohortSuccessView';
import CohortSubmitErrorAlert from '../../components/CohortSubmitErrorAlert/CohortSubmitErrorAlert';
import { buildCohortRegisterPath } from '../../data/constants';
import { getCohortFormSubmittedSession } from '../../utils/cohortFormSubmittedSession';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortFormSubmittedPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const logoUrl = getConfig().LOGO_URL;

  const [sessionData, setSessionData] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

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
          />

          {sessionData.googleErrorMessage && (
            <CohortSubmitErrorAlert message={sessionData.googleErrorMessage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortFormSubmittedPage;
