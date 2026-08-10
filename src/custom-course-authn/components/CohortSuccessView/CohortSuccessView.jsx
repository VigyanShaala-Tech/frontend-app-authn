import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { setCohortGoogleOAuthSlug } from '../../utils/cohortGoogleOAuthSession';
import messages from './messages';

import './cohort-success-view.scss';

const CohortSuccessView = ({
  thanksMessage,
  googleLoginUrl,
  email,
  slug,
  userAlreadyExists,
  onEmailSignup,
  onGoogleSignup,
  emailSubmitting,
  googleSubmitting,
}) => {
  const intl = useIntl();
  const catalogBaseUrl = getConfig().CATALOG_MICROFRONTEND_URL || '';
  const termsUrl = `${catalogBaseUrl}terms`;
  const privacyUrl = `${catalogBaseUrl}privacy`;

  const handleGoogleSignup = async () => {
    if (!onGoogleSignup || googleSubmitting) {
      return;
    }

    setCohortGoogleOAuthSlug(slug);
    await onGoogleSignup();
  };

  const handleEmailSignup = () => {
    if (onEmailSignup && !emailSubmitting) {
      onEmailSignup();
    }
  };

  return (
    <div className="cohort-success-view cohort-success-view--eligible">
      <div className="cohort-success-view__icon-wrap">
        <span className="cohort-success-view__check-icon" aria-hidden>✓</span>
      </div>
      {!userAlreadyExists && thanksMessage ? (
        <div
          className="cohort-success-view__title"
          dangerouslySetInnerHTML={{ __html: thanksMessage }}
        />
      ) : (
        <h3 className="cohort-success-view__title">
          {userAlreadyExists
            ? intl.formatMessage(messages.existingUserThanksMessage)
            : intl.formatMessage(messages.eligibleTitle)}
        </h3>
      )}
      {!userAlreadyExists && !thanksMessage && (
        <p className="cohort-success-view__subtitle">
          {intl.formatMessage(messages.eligibleSubtitle)}
        </p>
      )}
      <div className="cohort-success-view__actions">
        {googleLoginUrl && (
          <button
            type="button"
            className="cohort-success-view__google-btn"
            disabled={googleSubmitting || emailSubmitting}
            onClick={handleGoogleSignup}
          >
            <FontAwesomeIcon icon={faGoogle} className="cohort-success-view__btn-icon" aria-hidden />
            <span>
              {googleSubmitting
                ? intl.formatMessage(messages.signupLoading)
                : intl.formatMessage(messages.signUpGoogle)}
            </span>
          </button>
        )}
        <button
          type="button"
          className="cohort-success-view__email-btn"
          disabled={emailSubmitting || googleSubmitting}
          onClick={handleEmailSignup}
        >
          <FontAwesomeIcon icon={faEnvelope} className="cohort-success-view__btn-icon" aria-hidden />
          <span>
            {emailSubmitting
              ? intl.formatMessage(messages.signupLoading)
              : intl.formatMessage(userAlreadyExists ? messages.signInEmail : messages.signUpEmail)}
          </span>
        </button>
      </div>
      <p className="cohort-success-view__terms">
        {intl.formatMessage(messages.termsPrefix)}
        {' '}
        <a
          href={termsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary btn btn-link p-0 cohort-success-view__terms-link"
        >
          {intl.formatMessage(messages.termsLink)}
        </a>
        {' '}
        {intl.formatMessage(messages.termsAnd)}
        {' '}
        <a
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
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
  userAlreadyExists: PropTypes.bool,
  onEmailSignup: PropTypes.func,
  onGoogleSignup: PropTypes.func,
  emailSubmitting: PropTypes.bool,
  googleSubmitting: PropTypes.bool,
};

CohortSuccessView.defaultProps = {
  thanksMessage: '',
  googleLoginUrl: '',
  email: '',
  userAlreadyExists: false,
  onEmailSignup: null,
  onGoogleSignup: null,
  emailSubmitting: false,
  googleSubmitting: false,
};

export default CohortSuccessView;
