import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import messages from './messages';

import './cohort-success-view.scss';

const CohortEmailSentView = ({ email, message }) => {
  const intl = useIntl();
  const displayEmail = email || intl.formatMessage(messages.emailSentFallbackEmail);

  return (
    <div className="cohort-success-view cohort-success-view--email-sent">
      <div className="cohort-success-view__icon-wrap">
        <FontAwesomeIcon
          icon={faEnvelopeCircleCheck}
          className="cohort-success-view__mail-icon"
          aria-hidden
        />
      </div>
      <h3 className="cohort-success-view__title">
        {intl.formatMessage(messages.emailSentTitle)}
      </h3>
      {message ? (
        <p
          className="cohort-success-view__subtitle"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      ) : (
        <>
          <p className="cohort-success-view__subtitle">
            {intl.formatMessage(messages.emailSentIntro)}
            {' '}
            <span className="cohort-success-view__email-highlight">{displayEmail}</span>
            .
          </p>
          <p className="cohort-success-view__subtitle cohort-success-view__subtitle--spaced">
            {intl.formatMessage(messages.emailSentInstructions)}
          </p>
        </>
      )}
      <p className="cohort-success-view__spam-hint">
        {intl.formatMessage(messages.emailSentSpamHint)}
      </p>
    </div>
  );
};

CohortEmailSentView.propTypes = {
  email: PropTypes.string,
  message: PropTypes.string,
};

CohortEmailSentView.defaultProps = {
  email: '',
  message: '',
};

export default CohortEmailSentView;
