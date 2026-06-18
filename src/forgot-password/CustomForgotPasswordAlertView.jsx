import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from '@edx/frontend-platform/i18n';
import { CheckCircle, Error } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import customAlertMessages from './customalertmessages';
import messages from './custommessages';
import {
  COMPLETE_STATE,
  FORBIDDEN_STATE,
  FORM_SUBMISSION_ERROR,
  INTERNAL_SERVER_ERROR,
  LOGIN_PAGE,
} from '../data/constants';
import { PASSWORD_RESET } from '../reset-password/data/constants';
import { updatePathWithQueryParams } from '../data/utils';
import './customforgotpasswordalert.scss';

export const resolveForgotPasswordAlertState = ({ status, emailError }) => {
  let resolvedStatus = status;
  let headingKey = null;
  let messageKey = null;

  if (emailError) {
    resolvedStatus = FORM_SUBMISSION_ERROR;
  }

  switch (resolvedStatus) {
    case COMPLETE_STATE:
      headingKey = 'confirmation.message.title';
      messageKey = 'confirmation.message.title';
      break;
    case INTERNAL_SERVER_ERROR:
      headingKey = 'forgot.password.error.alert.title';
      messageKey = 'internal.server.error';
      break;
    case FORBIDDEN_STATE:
      headingKey = 'forgot.password.error.message.title';
      messageKey = 'forgot.password.request.in.progress.message';
      break;
    case FORM_SUBMISSION_ERROR:
      headingKey = 'forgot.password.error.alert.title';
      messageKey = 'extend.field.errors';
      break;
    case PASSWORD_RESET.INVALID_TOKEN:
      headingKey = 'invalid.token.heading';
      messageKey = 'invalid.token.error.message';
      break;
    case PASSWORD_RESET.FORBIDDEN_REQUEST:
      headingKey = 'token.validation.rate.limit.error.heading';
      messageKey = 'token.validation.rate.limit.error';
      break;
    case PASSWORD_RESET.INTERNAL_SERVER_ERROR:
      headingKey = 'token.validation.internal.sever.error.heading';
      messageKey = 'token.validation.internal.sever.error';
      break;
    default:
      break;
  }

  return {
    resolvedStatus,
    hasAlert: Boolean(messageKey),
    headingKey,
    messageKey,
  };
};

const CustomForgotPasswordAlertView = ({
  email,
  emailError,
  status,
  onTryAnotherEmail,
}) => {
  const { formatMessage } = useIntl();
  const {
    resolvedStatus,
    hasAlert,
    headingKey,
    messageKey,
  } = resolveForgotPasswordAlertState({ status, emailError });

  if (!hasAlert) {
    return null;
  }

  const isSuccess = resolvedStatus === COMPLETE_STATE;
  const headingText = formatMessage(messages[headingKey]);
  let bodyText = null;

  if (isSuccess) {
    bodyText = (
      <>
        <p className="custom-forgot-alert-subtitle">
          {formatMessage(customAlertMessages['forgot.password.custom.alert.email.sent.subtitle'])}
        </p>
        <p className="custom-forgot-alert-email data-hj-suppress text-primary">{email}</p>
        <div className="custom-forgot-alert-retry">
          <p className="custom-forgot-alert-retry-copy">
            {formatMessage(customAlertMessages['forgot.password.custom.alert.retry.copy'])}
          </p>
          <button
            type="button"
            className="btn btn-link custom-forgot-alert-retry-action text-primary"
            onClick={onTryAnotherEmail}
          >
            {formatMessage(customAlertMessages['forgot.password.custom.alert.retry.action'])}
          </button>
        </div>
      </>
    );
  } else if (typeof messageKey === 'string') {
    bodyText = (
      <p className="custom-forgot-alert-error-text">
        {messageKey === 'extend.field.errors'
          ? formatMessage(messages[messageKey], { emailError })
          : formatMessage(messages[messageKey])}
      </p>
    );
  }

  return (
    <div className="custom-forgot-alert-page">
      <div className="custom-forgot-alert-card">
        <div className={`custom-forgot-alert-icon ${isSuccess ? 'is-success' : 'is-error'}`}>
          {isSuccess ? <CheckCircle /> : <Error />}
        </div>
        <h2 className="h2 custom-forgot-alert-heading">{headingText}</h2>
        {bodyText}
        <div className="custom-forgot-alert-footer">
          <Link className="custom-forgot-alert-back-link text-primary" to={updatePathWithQueryParams(LOGIN_PAGE)}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{formatMessage(messages['sign.in.text'])}</span>
          </Link>
        </div>
        <p className="custom-forgot-alert-remember">
          {formatMessage(messages['forgot.password.remember.prompt'])}
          {' '}
          <Link to={updatePathWithQueryParams(LOGIN_PAGE)} className="custom-forgot-alert-signin text-primary">
            {formatMessage(messages['forgot.password.sign.in.link'])}
          </Link>
        </p>
      </div>
    </div>
  );
};

CustomForgotPasswordAlertView.defaultProps = {
  email: '',
  emailError: '',
  onTryAnotherEmail: undefined,
  status: null,
};

CustomForgotPasswordAlertView.propTypes = {
  email: PropTypes.string,
  emailError: PropTypes.string,
  onTryAnotherEmail: PropTypes.func,
  status: PropTypes.string,
};

export default CustomForgotPasswordAlertView;
