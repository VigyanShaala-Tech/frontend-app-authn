import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form,
  StatefulButton,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { forgotPassword, setForgotPasswordFormData } from './data/actions';
import { forgotPasswordResultSelector } from './data/selectors';
import CustomForgotPasswordAlertView, { resolveForgotPasswordAlertState } from './CustomForgotPasswordAlertView';
import messages from './custommessages';
import BaseContainer from '../base-container';
import CustomFormGroup from "../common-components/CustomFormGroup"
import { DEFAULT_STATE, LOGIN_PAGE, VALID_EMAIL_REGEX } from '../data/constants';
import { updatePathWithQueryParams, windowScrollTo } from '../data/utils';
import './customforgotpassword.scss';

const CustomForgotPasswordPage = (props) => {
  const emailRegex = new RegExp(VALID_EMAIL_REGEX, 'i');
  const {
    status, submitState, emailValidationError,
  } = props;

  const { formatMessage } = useIntl();
  const [email, setEmail] = useState(props.email);
  const [bannerEmail, setBannerEmail] = useState('');
  const [formErrors, setFormErrors] = useState('');
  const [validationError, setValidationError] = useState(emailValidationError);
  const [dismissAlertView, setDismissAlertView] = useState(false);

  useEffect(() => {
    sendPageEvent('login_and_registration', 'reset');
    sendTrackEvent('edx.bi.password_reset_form.viewed', { category: 'user-engagement' });
  }, []);

  useEffect(() => {
    setValidationError(emailValidationError);
  }, [emailValidationError]);

  useEffect(() => {
    if (status === 'complete') {
      setEmail('');
    }
  }, [status]);

  useEffect(() => {
    setDismissAlertView(false);
  }, [status, formErrors]);

  const getValidationMessage = (value) => {
    let error = '';

    if (value === '') {
      error = formatMessage(messages['forgot.password.empty.email.field.error']);
    } else if (!emailRegex.test(value)) {
      error = formatMessage(messages['forgot.password.page.invalid.email.message']);
    }

    return error;
  };

  const handleBlur = () => {
    props.setForgotPasswordFormData({ email, emailValidationError: getValidationMessage(email) });
  };

  const handleFocus = () => props.setForgotPasswordFormData({ emailValidationError: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setBannerEmail(email);

    const error = getValidationMessage(email);
    if (error) {
      setFormErrors(error);
      props.setForgotPasswordFormData({ email, emailValidationError: error });
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
    } else {
      props.forgotPassword(email);
    }
  };

  const handleTryAnotherEmail = () => {
    setDismissAlertView(true);
    setFormErrors('');
    props.setForgotPasswordFormData({ emailValidationError: '' });
  };

  const showAlertView = !dismissAlertView && resolveForgotPasswordAlertState({
    status,
    emailError: formErrors,
  }).hasAlert;

  return (
    <BaseContainer>
      <Helmet>
        <title>{formatMessage(messages['forgot.password.page.title'],
          { siteName: getConfig().SITE_NAME })}
        </title>
      </Helmet>
      <div className="main-wrapper d-flex align-items-center justify-content-center">
        <div id="main-content" className="main-content custom-forgot-main-content">
          <div className="mw-xs custom-forgot-wrapper w-100">
            {showAlertView ? (
              <CustomForgotPasswordAlertView
                email={bannerEmail}
                emailError={formErrors}
                status={status}
                onTryAnotherEmail={handleTryAnotherEmail}
              />
            ) : (
              <>
                <Link
                  className="forgot-back-link"
                  to={updatePathWithQueryParams(LOGIN_PAGE)}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span>{formatMessage(messages['sign.in.text'])}</span>
                </Link>
                <h2 className="h2 custom-forgot-heading">
                  {formatMessage(messages['forgot.password.page.heading'])}
                </h2>
                <p className="custom-forgot-instructions">
                  {formatMessage(messages['forgot.password.page.instructions'])}
                </p>

                <Form id="forget-password-form" name="forget-password-form" className="custom-forgot-form">
                  <div className="forgot-email-group">
                    <span className="forgot-input-icon" aria-hidden="true">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <CustomFormGroup
                      name="email"
                      value={email}
                      autoComplete="on"
                      errorMessage={validationError}
                      handleChange={(e) => setEmail(e.target.value)}
                      handleBlur={handleBlur}
                      handleFocus={handleFocus}
                      label={formatMessage(messages['forgot.password.page.email.field.label'])}
                      placeholder={formatMessage(messages['forgot.password.page.email.field.placeholder'])}
                    />
                  </div>
                  <StatefulButton
                    id="submit-forget-password"
                    name="submit-forget-password"
                    type="submit"
                    variant="primary"
                    className="forgot-password--button text-white forgot-submit-button text-white mt-1.5"
                    state={submitState}
                    labels={{
                      default: (
                        <>
                          {formatMessage(messages['forgot.password.page.submit.button'])}
                          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                        </>
                      ),
                      pending: '',
                    }}
                    onClick={handleSubmit}
                    onMouseDown={(e) => e.preventDefault()}
                  />
                </Form>
                <p className="forgot-remember-text">
                  {formatMessage(messages['forgot.password.remember.prompt'])}
                  {' '}
                  <Link to={updatePathWithQueryParams(LOGIN_PAGE)} className="forgot-remember-signin-link text-primary">
                    {formatMessage(messages['forgot.password.sign.in.link'])}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

CustomForgotPasswordPage.propTypes = {
  email: PropTypes.string,
  emailValidationError: PropTypes.string,
  forgotPassword: PropTypes.func.isRequired,
  setForgotPasswordFormData: PropTypes.func.isRequired,
  status: PropTypes.string,
  submitState: PropTypes.string,
};

CustomForgotPasswordPage.defaultProps = {
  email: '',
  emailValidationError: '',
  status: null,
  submitState: DEFAULT_STATE,
};

export default connect(
  forgotPasswordResultSelector,
  {
    forgotPassword,
    setForgotPasswordFormData,
  },
)(CustomForgotPasswordPage);
