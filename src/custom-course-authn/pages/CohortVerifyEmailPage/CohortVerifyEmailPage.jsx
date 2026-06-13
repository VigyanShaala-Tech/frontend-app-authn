import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useSearchParams } from 'react-router-dom';

import CohortEmailSentView from '../../components/CohortSuccessView/CohortEmailSentView';

import '../CohortRegisterPage/cohort-register-page.scss';

const CohortVerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const logoUrl = getConfig().LOGO_URL;

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <div className="cohort-register-page__header">
          {logoUrl && (
            <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
          )}
        </div>
        <div className="cohort-register-page__content">
          <CohortEmailSentView email={email} />
        </div>
      </div>
    </div>
  );
};

export default CohortVerifyEmailPage;
