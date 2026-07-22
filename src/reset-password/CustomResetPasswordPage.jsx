import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLock } from '@fortawesome/free-solid-svg-icons';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form,
  Spinner,
  StatefulButton,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { resetPassword, validateToken } from './data/actions';
import {
  FORM_SUBMISSION_ERROR, PASSWORD_RESET_ERROR, PASSWORD_VALIDATION_ERROR, TOKEN_STATE,
} from './data/constants';
import customMessages from './custommessages';
import { resetPasswordResultSelector } from './data/selectors';
import { validatePassword } from './data/service';
import ResetPasswordFailure from './ResetPasswordFailure';
import BaseContainer from '../base-container';
import CustomPasswordField from '../common-components/CustomPasswordField';
import {
  LETTER_REGEX, LOGIN_PAGE, NUMBER_REGEX, RESET_PAGE,
} from '../data/constants';
import { getAllPossibleQueryParams, updatePathWithQueryParams, windowScrollTo } from '../data/utils';
import './customresetpassword.scss';

const CustomResetPasswordPage = (props) => {
  const { formatMessage } = useIntl();
  const newPasswordError = formatMessage(customMessages['password.validation.message']);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [errorCode, setErrorCode] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.status !== TOKEN_STATE.PENDING && props.status !== PASSWORD_RESET_ERROR) {
      setErrorCode(props.status);
    }
    if (props.status === PASSWORD_VALIDATION_ERROR) {
      setFormErrors({ newPassword: newPasswordError });
    }
  }, [props.status, newPasswordError]);

  const validatePasswordFromBackend = async (password) => {
    let errorMessage = '';
    try {
      const payload = {
        reset_password_page: true,
        password,
      };
      errorMessage = await validatePassword(payload);
    } catch (err) {
      errorMessage = '';
    }
    setFormErrors({ ...formErrors, newPassword: errorMessage });
  };

  const validateInput = (name, value) => {
    switch (name) {
      case 'newPassword':
        if (!value || !LETTER_REGEX.test(value) || !NUMBER_REGEX.test(value) || value.length < 8) {
          formErrors.newPassword = formatMessage(customMessages['password.validation.message']);
        } else {
          validatePasswordFromBackend(value);
        }
        break;
      case 'confirmPassword':
        if (!value) {
          formErrors.confirmPassword = formatMessage(customMessages['confirm.your.password']);
        } else if (value !== newPassword) {
          formErrors.confirmPassword = formatMessage(customMessages['passwords.do.not.match']);
        } else {
          formErrors.confirmPassword = '';
        }
        break;
      default:
        break;
    }
    setFormErrors({ ...formErrors });
    return !Object.values(formErrors).some(x => (x !== ''));
  };

  const handleOnBlur = (event) => {
    const { name, value } = event.target;
    validateInput(name, value);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    validateInput('confirmPassword', value);
  };

  const handleOnFocus = (e) => {
    setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isPasswordValid = validateInput('newPassword', newPassword);
    const isPasswordConfirmed = validateInput('confirmPassword', confirmPassword);

    if (isPasswordValid && isPasswordConfirmed) {
      const formPayload = {
        new_password1: newPassword,
        new_password2: confirmPassword,
      };
      const params = getAllPossibleQueryParams();
      props.resetPassword(formPayload, props.token, params);
    } else {
      setErrorCode(FORM_SUBMISSION_ERROR);
      windowScrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  if (props.status === TOKEN_STATE.PENDING) {
    if (token) {
      props.validateToken(token);
      return <Spinner animation="border" variant="primary" className="spinner--position-centered" />;
    }
  } else if (props.status === PASSWORD_RESET_ERROR) {
    navigate(updatePathWithQueryParams(RESET_PAGE));
  } else if (props.status === 'success') {
    navigate(updatePathWithQueryParams(LOGIN_PAGE));
  } else {
    return (
      <BaseContainer>
        <Helmet>
          <title>
            {formatMessage(customMessages['reset.password.page.title'], { siteName: getConfig().SITE_NAME })}
          </title>
        </Helmet>
        <div className="main-wrapper d-flex align-items-center justify-content-center">
          <div id="main-content" className="main-content custom-reset-main-content">
            <div className="mw-xs custom-reset-wrapper w-100">
              <Link className="reset-back-link" to={updatePathWithQueryParams(LOGIN_PAGE)}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>{formatMessage(customMessages['back.to.sign.in'])}</span>
              </Link>
              <ResetPasswordFailure errorCode={errorCode} errorMsg={props.errorMsg} />
              <h2 className="h2 custom-reset-heading">{formatMessage(customMessages['reset.password.heading'])}</h2>
              <p className="custom-reset-instructions">{formatMessage(customMessages['reset.password.page.instructions'])}</p>
              <Form id="set-reset-password-form" name="set-reset-password-form" className="custom-reset-form">
                <div className="reset-password-group">
                  <span className="reset-password-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <CustomPasswordField
                    name="newPassword"
                    value={newPassword}
                    handleChange={(e) => setNewPassword(e.target.value)}
                    handleBlur={handleOnBlur}
                    handleFocus={handleOnFocus}
                    errorMessage={formErrors.newPassword}
                    label={formatMessage(customMessages['new.password.label'])}
                    placeholder={formatMessage(customMessages['new.password.placeholder'])}
                  />
                </div>
                <div className="reset-password-group">
                  <span className="reset-password-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <CustomPasswordField
                    name="confirmPassword"
                    value={confirmPassword}
                    handleChange={handleConfirmPasswordChange}
                    handleFocus={handleOnFocus}
                    errorMessage={formErrors.confirmPassword}
                    showRequirements={false}
                    label={formatMessage(customMessages['confirm.password.label'])}
                    placeholder={formatMessage(customMessages['confirm.password.placeholder'])}
                  />
                </div>
                <StatefulButton
                  id="submit-new-password"
                  name="submit-new-password"
                  type="submit"
                  variant="primary"
                  className="reset-password--button custom-reset-button text-white"
                  state={props.status}
                  labels={{
                    default: formatMessage(customMessages['reset.password.button']),
                    pending: '',
                  }}
                  onClick={e => handleSubmit(e)}
                  onMouseDown={(e) => e.preventDefault()}
                />
              </Form>
            </div>
          </div>
        </div>
      </BaseContainer>
    );
  }
  return null;
};

CustomResetPasswordPage.defaultProps = {
  status: null,
  token: null,
  errorMsg: null,
};

CustomResetPasswordPage.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  validateToken: PropTypes.func.isRequired,
  token: PropTypes.string,
  status: PropTypes.string,
  errorMsg: PropTypes.string,
};

export default connect(
  resetPasswordResultSelector,
  {
    resetPassword,
    validateToken,
  },
)(CustomResetPasswordPage);
