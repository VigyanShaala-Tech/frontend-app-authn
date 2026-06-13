import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { buildCohortVerifyEmailPath } from '../../data/constants';
import { setCohortGoogleOAuthSlug } from '../../utils/cohortGoogleOAuthSession';
import messages from './messages';

import './cohort-success-view.scss';

const CohortSuccessView = ({
  thanksMessage,
  googleLoginUrl,
  email,
  slug,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const marketingBaseUrl = getConfig().MARKETING_SITE_BASE_URL || '';

  const handleGoogleSignup = () => {
    if (googleLoginUrl) {
      setCohortGoogleOAuthSlug(slug);
      window.location.href = googleLoginUrl;
    }
  };

  const handleEmailSignup = () => {
    navigate(buildCohortVerifyEmailPath(slug, email));
  };

  return (
    <div className="cohort-success-view cohort-success-view--eligible">
      <div className="cohort-success-view__icon-wrap">
        <span className="cohort-success-view__check-icon" aria-hidden>✓</span>
      </div>
      <h3 className="cohort-success-view__title">
        {thanksMessage || intl.formatMessage(messages.eligibleTitle)}
      </h3>
      {!thanksMessage && (
        <p className="cohort-success-view__subtitle">
          {intl.formatMessage(messages.eligibleSubtitle)}
        </p>
      )}
      <div className="cohort-success-view__actions">
        {googleLoginUrl && (
          <button
            type="button"
            className="cohort-success-view__google-btn"
            onClick={handleGoogleSignup}
          >
            <FontAwesomeIcon icon={faGoogle} className="cohort-success-view__btn-icon" aria-hidden />
            <span>{intl.formatMessage(messages.signUpGoogle)}</span>
          </button>
        )}
        <button
          type="button"
          className="cohort-success-view__email-btn"
          onClick={handleEmailSignup}
        >
          <FontAwesomeIcon icon={faEnvelope} className="cohort-success-view__btn-icon" aria-hidden />
          <span>{intl.formatMessage(messages.signUpEmail)}</span>
        </button>
      </div>
      <p className="cohort-success-view__terms">
        {intl.formatMessage(messages.termsPrefix)}
        {' '}
        <a
          href={`${marketingBaseUrl}/terms`}
          className="text-primary btn btn-link p-0 cohort-success-view__terms-link"
        >
          {intl.formatMessage(messages.termsLink)}
        </a>
        {' '}
        {intl.formatMessage(messages.termsAnd)}
        {' '}
        <a
          href={`${marketingBaseUrl}/privacy`}
          className="text-primary btn btn-link p-0 cohort-success-view__terms-link"
        >
          {intl.formatMessage(messages.privacyLink)}
        </a>
        .
      </p>
    </div>
  );
};

CohortSuccessView.propTypes = {
  thanksMessage: PropTypes.string,
  googleLoginUrl: PropTypes.string,
  email: PropTypes.string,
  slug: PropTypes.string.isRequired,
};

CohortSuccessView.defaultProps = {
  thanksMessage: '',
  googleLoginUrl: '',
  email: '',
};

export default CohortSuccessView;
