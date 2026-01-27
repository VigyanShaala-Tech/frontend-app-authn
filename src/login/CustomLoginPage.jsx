import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { sendPageEvent, sendTrackEvent } from '@edx/frontend-platform/analytics';
import { injectIntl, useIntl } from '@edx/frontend-platform/i18n';
import {
  Form, StatefulButton, Tabs, Tab,
} from '@openedx/paragon';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

import AccountActivationMessage from './AccountActivationMessage';
import {
  backupLoginFormBegin,
  dismissPasswordResetBanner,
  loginRequest,
} from './data/actions';
import { INVALID_FORM, TPA_AUTHENTICATION_FAILURE } from './data/constants';
import LoginFailureMessage from './LoginFailure';
import messages from './messages';
import {
  FormGroup,
  InstitutionLogistration,
  PasswordField,
  RedirectLogistration,
  ThirdPartyAuthAlert,
} from '../common-components';
import { getThirdPartyAuthContext } from '../common-components/data/actions';
import { thirdPartyAuthContextSelector } from '../common-components/data/selectors';
import EnterpriseSSO from '../common-components/EnterpriseSSO';
import ThirdPartyAuth from '../common-components/ThirdPartyAuth';
import { DEFAULT_STATE, PENDING_STATE, RESET_PAGE } from '../data/constants';
import {
  getActivationStatus,
  getAllPossibleQueryParams,
  getTpaHint,
  getTpaProvider,
  updatePathWithQueryParams,
} from '../data/utils';
import ResetPasswordSuccess from '../reset-password/ResetPasswordSuccess';
import { loginRequestSuccess } from './data/actions';

const CustomLoginPage = (props) => {
  const {
    backedUpFormData,
    loginErrorCode,
    loginErrorContext,
    loginResult,
    shouldBackupState,
    thirdPartyAuthContext: {
      providers,
      currentProvider,
      secondaryProviders,
      finishAuthUrl,
      platformName,
      errorMessage: thirdPartyErrorMessage,
    },
    thirdPartyAuthApiStatus,
    institutionLogin,
    showResetPasswordSuccessBanner,
    submitState,
    // Actions
    backupFormState,
    handleInstitutionLogin,
    getTPADataFromBackend,
    loginRequestSuccess,
  } = props;
  const { formatMessage } = useIntl();
  const activationMsgType = getActivationStatus();
  const queryParams = useMemo(() => getAllPossibleQueryParams(), []);

  const [formFields, setFormFields] = useState({ ...backedUpFormData.formFields });
  const [errorCode, setErrorCode] = useState({ type: '', count: 0, context: {} });
  const [errors, setErrors] = useState({ ...backedUpFormData.errors });
  const tpaHint = getTpaHint();
  const [activeTab, setActiveTab] = useState('username');
  const [otpState, setOtpState] = useState({
    phone: '',
    sending: false,
    verifying: false,
    resending: false,
    otpSent: false,
    otpVerified: false,
    otpCode: '',
    verificationKey: '',
    resendIn: 0,
    expiresIn: 0,
    serverMessage: '',
  });
  const otpApiBase = `${getConfig().LMS_BASE_URL}`;

  useEffect(() => {
    sendPageEvent('login_and_registration', 'login');
  }, []);

  useEffect(() => {
    const payload = { ...queryParams };
    if (tpaHint) {
      payload.tpa_hint = tpaHint;
    }
    getTPADataFromBackend(payload);
  }, [getTPADataFromBackend, queryParams, tpaHint]);

  useEffect(() => {
    if (shouldBackupState) {
      backupFormState({
        formFields: { ...formFields },
        errors: { ...errors },
      });
    }
  }, [shouldBackupState, formFields, errors, backupFormState]);

  useEffect(() => {
    if (loginErrorCode) {
      setErrorCode(prevState => ({
        type: loginErrorCode,
        count: prevState.count + 1,
        context: { ...loginErrorContext },
      }));
    }
  }, [loginErrorCode, loginErrorContext]);

  useEffect(() => {
    if (thirdPartyErrorMessage) {
      setErrorCode((prevState) => ({
        type: TPA_AUTHENTICATION_FAILURE,
        count: prevState.count + 1,
        context: {
          errorMessage: thirdPartyErrorMessage,
        },
      }));
    }
  }, [thirdPartyErrorMessage]);

  useEffect(() => {
    if (otpState.resendIn > 0) {
      const timer = setInterval(() => {
        setOtpState((prev) => ({
          ...prev,
          resendIn: prev.resendIn - 1,
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpState.resendIn]);

  const validateFormFields = (payload) => {
    const { emailOrUsername, password } = payload;
    const fieldErrors = { ...errors };

    if (emailOrUsername === '') {
      fieldErrors.emailOrUsername = formatMessage(messages['email.validation.message']);
    } else if (emailOrUsername.length < 2) {
      fieldErrors.emailOrUsername = formatMessage(messages['username.or.email.format.validation.less.chars.message']);
    }
    if (password === '') {
      fieldErrors.password = formatMessage(messages['password.validation.message']);
    }

    return { ...fieldErrors };
  };

  const handleUsernameSubmit = (event) => {
    event.preventDefault();
    if (showResetPasswordSuccessBanner) {
      props.dismissPasswordResetBanner();
    }

    const formData = { ...formFields };
    const validationErrors = validateFormFields(formData);
    if (validationErrors.emailOrUsername || validationErrors.password) {
      setErrors({ ...validationErrors });
      setErrorCode(prevState => ({ type: INVALID_FORM, count: prevState.count + 1, context: {} }));
      return;
    }

    const payload = {
      email_or_username: formData.emailOrUsername,
      password: formData.password,
      ...queryParams,
    };
    props.loginRequest(payload);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormFields(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOnFocus = (event) => {
    const { name } = event.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const trackForgotPasswordLinkClick = () => {
    sendTrackEvent('edx.bi.password-reset_form.toggled', { category: 'user-engagement' });
  };

  // const sendOtp = async () => {
  //   const { phone } = otpState;
  //   if (!phone.trim()) {
  //     setOtpState((prev) => ({ ...prev, serverMessage: 'Phone number is required.' }));
  //     return;
  //   }
  //   setOtpState((prev) => ({ ...prev, sending: true, serverMessage: '' }));
  //   try {
  //     const res = await fetch(`${otpApiBase}/otp/login/send/`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include',
  //       body: JSON.stringify({ contact_identifier: phone }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok || !data.success) {
  //       setOtpState((prev) => ({ ...prev, sending: false, serverMessage: data.message || 'Failed to send OTP.' }));
  //       return;
  //     }
  //     setOtpState((prev) => ({
  //       ...prev,
  //       sending: false,
  //       otpSent: true,
  //       verificationKey: data.verification_key,
  //       resendIn: data.resend_after_seconds || 30,
  //       expiresIn: data.expires_in_seconds || 300,
  //       serverMessage: 'OTP sent successfully.',
  //     }));
  //   } catch {
  //     setOtpState((prev) => ({ ...prev, sending: false, serverMessage: 'Network error.' }));
  //   }
  // };

  const sendOtp = async () => {
    const phone = otpState.phone.trim();
    if (!phone) {
      setErrors(prev => ({ ...prev, phone: formatMessage(messages['login.otp.phone.required']) }));
      return;
    }

    setOtpState(prev => ({ ...prev, sending: true }));
    setErrors(prev => ({ ...prev, phone: '', serverMessage: '' }));

    try {
      const res = await fetch(`${otpApiBase}/otp/login/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contact_identifier: phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpState(prev => ({ ...prev, sending: false }));
        if (data.errors && typeof data.errors === 'object') {
          setErrors(prev => ({ ...prev, ...data.errors }));
        } else {
          setOtpState(prev => ({
            ...prev,
            serverMessage: data.message || formatMessage(messages['login.otp.send.failed']),
          }));
        }
        return;
      }

      setOtpState(prev => ({
        ...prev,
        sending: false,
        otpSent: true,
        verificationKey: data.verification_key,
        resendIn: data.resend_after_seconds || 30,
        serverMessage: data.message || formatMessage(messages['login.otp.sent.success']),
      }));
    } catch {
      setOtpState(prev => ({
        ...prev,
        sending: false,
        serverMessage: data.message || formatMessage(messages['login.network.error']),
      }));
    }
  };

  const resendOtp = async () => {
    const phone = otpState.phone?.trim();

    // Basic client-side check (optional but recommended)
    if (!phone) {
      setErrors((prev) => ({
        ...prev,
        phone: formatMessage(messages['login.otp.phone.required']),
      }));
      return;
    }

    setOtpState((prev) => ({ ...prev, resending: true, serverMessage: '' }));
    setErrors((prev) => ({ ...prev, phone: '', otpCode: '' }));

    try {
      const res = await fetch(`${otpApiBase}/otp/login/resend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ contact_identifier: phone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Handle field-specific errors from backend
        if (data.errors && typeof data.errors === 'object') {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        } else {
          // General / non-field error
          setOtpState((prev) => ({
            ...prev,
            serverMessage: data.message || formatMessage(messages['login.otp.resend.failed']),
          }));
        }
        setOtpState((prev) => ({ ...prev, resending: false }));
        return;
      }

      // Success
      setOtpState((prev) => ({
        ...prev,
        resending: false,
        otpSent: true,
        verificationKey: data.verification_key || prev.verificationKey,
        resendIn: data.resend_after_seconds || 30,
        serverMessage: data.message || formatMessage(messages['login.otp.resent.success']),
      }));

    } catch (err) {
      setOtpState((prev) => ({
        ...prev,
        resending: false,
        serverMessage: data.message || formatMessage(messages['login.network.error']),
      }));
    }
  };

  const verifyOtp = async () => {
    const phone = otpState.phone?.trim();
    const code = otpState.otpCode?.trim();
    const verificationKey = otpState.verificationKey;

    // Client-side validation
    if (!code) {
      setErrors((prev) => ({
        ...prev,
        otpCode: formatMessage(messages['login.otp.code.required']),
      }));
      return;
    }

    if (!phone || !verificationKey) {
      setOtpState((prev) => ({
        ...prev,
        serverMessage: formatMessage(messages['login.otp.session.expired']),
      }));
      return;
    }

    setOtpState((prev) => ({ ...prev, verifying: true, serverMessage: '' }));
    setErrors((prev) => ({ ...prev, otpCode: '' }));

    try {
      const verifyRes = await fetch(`${otpApiBase}/otp/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contact_identifier: phone,
          otp_code: code,
          verification_key: verificationKey,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        if (verifyData.errors && typeof verifyData.errors === 'object') {
          // Field-specific errors (e.g. { "otp_code": "Invalid code" })
          setErrors((prev) => ({ ...prev, ...verifyData.errors }));
        } else {
          setOtpState((prev) => ({
            ...prev,
            serverMessage: verifyData.message || formatMessage(messages['login.otp.invalid']),
          }));
        }
        setOtpState((prev) => ({ ...prev, verifying: false }));
        return;
      }

      // Step 2: If verification succeeded → perform actual login
      const loginRes = await fetch(`${otpApiBase}/otp/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phone_number: phone,
          otp_code: code,
          verification_key: verificationKey,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.success) {
        if (loginData.errors && typeof loginData.errors === 'object') {
          setErrors((prev) => ({ ...prev, ...loginData.errors }));
        } else {
          setOtpState((prev) => ({
            ...prev,
            serverMessage: loginData.message || formatMessage(messages['login.failed.after.verification']) ,
          }));
        }
        setOtpState((prev) => ({ ...prev, verifying: false }));
        return;
      }
      // Final success
      setOtpState((prev) => ({
        ...prev,
        verifying: false,
        otpVerified: true,
        serverMessage: loginData.message || formatMessage(messages['login.otp.success']),
      }));

      // Trigger Redux success action + redirect
      loginRequestSuccess(
        `${getConfig().LMS_BASE_URL}${loginData.redirect_url || '/dashboard'}`,
        true
      );

    } catch (err) {
      setOtpState((prev) => ({
        ...prev,
        verifying: false,
        serverMessage: verifyData.message || formatMessage(messages['login.network.error']),
      }));
    }
  };

  const { provider, skipHintedLogin } = getTpaProvider(tpaHint, providers, secondaryProviders);

  if (tpaHint) {
    if (thirdPartyAuthApiStatus === PENDING_STATE) {
      return <Skeleton height={36} />;
    }

    if (skipHintedLogin) {
      window.location.href = getConfig().LMS_BASE_URL + provider.loginUrl;
      return null;
    }

    if (provider) {
      return <EnterpriseSSO provider={provider} />;
    }
  }

  if (institutionLogin) {
    return (
      <InstitutionLogistration
        secondaryProviders={secondaryProviders}
        headingTitle={formatMessage(messages['institution.login.page.title'])}
      />
    );
  }

  // Find Google provider (assume id is 'google-oauth2')
  const googleProvider = providers.find(p => p.id === 'google-oauth2') || secondaryProviders.find(p => p.id === 'google-oauth2');

  return (
    <>
      <Helmet>
        <title>{formatMessage(messages['login.page.title'], { siteName: getConfig().SITE_NAME })}</title>
      </Helmet>
      <RedirectLogistration
        success={loginResult.success}
        redirectUrl={loginResult.redirectUrl}
        finishAuthUrl={finishAuthUrl}
      />
      <div className="mw-xs mt-3 mb-2">
        <LoginFailureMessage
          errorCode={errorCode.type}
          errorCount={errorCode.count}
          context={errorCode.context}
        />
        <ThirdPartyAuthAlert
          currentProvider={currentProvider}
          platformName={platformName}
        />
        <AccountActivationMessage
          messageType={activationMsgType}
        />
        {showResetPasswordSuccessBanner && <ResetPasswordSuccess />}
        <h3 className="mb-3">{formatMessage(messages['sign.in.button'])}</h3>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="login-tabs" className="mb-4">
          <Tab eventKey="username" title={formatMessage(messages['login.tab.username'])}>
            <Form id="sign-in-form" name="sign-in-form">
              <FormGroup
                name="emailOrUsername"
                value={formFields.emailOrUsername}
                autoComplete="on"
                handleChange={handleOnChange}
                handleFocus={handleOnFocus}
                errorMessage={errors.emailOrUsername}
                floatingLabel={formatMessage(messages['login.user.identity.label'])}
              />
              <PasswordField
                name="password"
                value={formFields.password}
                autoComplete="off"
                showScreenReaderText={false}
                showRequirements={false}
                handleChange={handleOnChange}
                handleFocus={handleOnFocus}
                errorMessage={errors.password}
                floatingLabel={formatMessage(messages['login.password.label'])}
              />
              <StatefulButton
                name="sign-in"
                id="sign-in"
                type="submit"
                variant="brand"
                className="login-button-width"
                state={submitState}
                labels={{
                    default: formatMessage(messages['sign.in.button']),
                    pending: formatMessage(messages['sign.in.button']) + '...',
                }}
                onClick={handleUsernameSubmit}
                onMouseDown={(event) => event.preventDefault()}
              />
              <Link
                id="forgot-password"
                name="forgot-password"
                className="btn btn-link font-weight-500 text-body"
                to={updatePathWithQueryParams(RESET_PAGE)}
                onClick={trackForgotPasswordLinkClick}
              >
                {formatMessage(messages['forgot.password'])}
              </Link>
              {/* Hide ThirdPartyAuth in username tab since we have separate tabs */}
            </Form>
          </Tab>
          <Tab eventKey="otp" title={formatMessage(messages['login.tab.otp'])}>
            <Form noValidate>
              {/* Phone Number Field */}
              <Form.Group className="mb-4">
                <Form.Control
                  type="tel"
                  name="phone"
                  value={otpState.phone}
                  onChange={(e) => {
                    setOtpState(prev => ({ ...prev, phone: e.target.value }));
                    // Clear field error when typing
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  onFocus={() => setErrors(prev => ({ ...prev, phone: '' }))}
                  isInvalid={!!errors.phone}
                  placeholder={formatMessage(messages['login.otp.phone.placeholder'])}
                  floatingLabel={formatMessage(messages['login.otp.phone.label'])}
                />
                {errors.phone && (
                  <Form.Text className="text-danger">
                    {errors.phone}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Send / Resend OTP Button */}
              <StatefulButton
                variant="brand"
                className="w-100 mb-4"
                state={otpState.sending || otpState.resending ? 'pending' : 'default'}
                labels={{
                  default: otpState.otpSent
                    ? (otpState.resendIn > 0
                        ? formatMessage(messages['login.otp.resend.countdown'], { seconds: otpState.resendIn })
                        : formatMessage(messages['login.otp.resend.button']))
                    : formatMessage(messages['login.otp.send.button']),
                  pending: otpState.sending
                    ? formatMessage(messages['login.otp.sending'])
                    : formatMessage(messages['login.otp.resending']),
                }}
                disabled={otpState.sending || otpState.resending || (otpState.otpSent && otpState.resendIn > 0)}
                onClick={otpState.otpSent ? resendOtp : sendOtp}
              />

              {/* OTP Code Field – only shown after OTP sent */}
              {otpState.otpSent && (
                <>
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="text"
                      name="otpCode"
                      value={otpState.otpCode}
                      onChange={(e) => {
                        setOtpState(prev => ({ ...prev, otpCode: e.target.value }));
                        setErrors(prev => ({ ...prev, otpCode: '' }));
                      }}
                      onFocus={() => setErrors(prev => ({ ...prev, otpCode: '' }))}
                      isInvalid={!!errors.otpCode}
                      placeholder={formatMessage(messages['login.otp.placeholder'])}
                      floatingLabel={formatMessage(messages['login.otp.enter.label'])}
                    />
                    {errors.otpCode && (
                      <Form.Text className="text-danger">
                        {errors.otpCode}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <StatefulButton
                    variant="brand"
                    className="w-100"
                    state={otpState.verifying ? 'pending' : 'default'}
                    labels={{
                      default: formatMessage(messages['login.otp.verify.button']),
                      pending: formatMessage(messages['login.otp.verifying']),
                    }}
                    disabled={otpState.verifying || !otpState.otpCode.trim()}
                    onClick={verifyOtp}
                  />
                </>
              )}

              {/* General messages (network, backend non-field errors) */}
              {otpState.serverMessage && !errors.otpCode && !errors.phone && (
                <div className={`mt-3 alert ${otpState.serverMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                  {otpState.serverMessage}
                </div>
              )}
            </Form>
          </Tab>
          <Tab eventKey="google" title={formatMessage(messages['login.tab.google'])}>
            {googleProvider ? (
            <StatefulButton
                variant="brand"
                className="w-100"
                labels={{
                default: formatMessage(messages['login.google.button']),
                }}
                onClick={() => window.location.href = getConfig().LMS_BASE_URL + googleProvider.loginUrl}
            />
            ) : (
            <div className="alert alert-info mt-3">
                {formatMessage(messages['login.google.not.configured'])}
            </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

// PropTypes and defaultProps same as original LoginPage
CustomLoginPage.propTypes = {
  // ... (same as provided in the original LoginPage)
};

CustomLoginPage.defaultProps = {
  // ... (same as provided in the original LoginPage)
};

const mapStateToProps = state => {
  const loginPageState = state.login;
  return {
    backedUpFormData: loginPageState.loginFormData,
    loginErrorCode: loginPageState.loginErrorCode,
    loginErrorContext: loginPageState.loginErrorContext,
    loginResult: loginPageState.loginResult,
    shouldBackupState: loginPageState.shouldBackupState,
    showResetPasswordSuccessBanner: loginPageState.showResetPasswordSuccessBanner,
    submitState: loginPageState.submitState,
    thirdPartyAuthContext: thirdPartyAuthContextSelector(state),
    thirdPartyAuthApiStatus: state.commonComponents.thirdPartyAuthApiStatus,
  };
};

export default connect(
  mapStateToProps,
  {
    backupFormState: backupLoginFormBegin,
    dismissPasswordResetBanner,
    loginRequest,
    getTPADataFromBackend: getThirdPartyAuthContext,
    loginRequestSuccess,
  },
)(injectIntl(CustomLoginPage));