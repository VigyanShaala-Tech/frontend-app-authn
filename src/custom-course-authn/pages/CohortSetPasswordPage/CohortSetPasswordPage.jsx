import React, { useCallback, useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faCircleCheck, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import resetPasswordMessages from '../../../reset-password/custommessages';
import { buildCohortRegistrationSuccessPath } from '../../data/constants';
import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import CohortSubmitErrorAlert from '../../components/CohortSubmitErrorAlert/CohortSubmitErrorAlert';
import cohortApiMessages from '../../messages/cohortApiMessages';
import {
  activateCohortEmail,
  submitCohortSetPassword,
} from '../../services/cohortRegistrationService';
import { resolveCohortMessage } from '../../utils/cohortApiMessage';
import { setCohortEnrollmentSession } from '../../utils/cohortEnrollmentSession';
import {
  validateCohortConfirmPassword,
  validateCohortPasswordFromBackend,
  validateCohortPasswordLocally,
} from '../../utils/cohortPasswordValidation';

import messages from './messages';

import '../CohortRegisterPage/cohort-register-page.scss';
import './cohort-set-password-page.scss';

const CohortPasswordField = ({
  id,
  name,
  label,
  value,
  showPassword,
  isInvalid,
  errorMessage,
  placeholder,
  toggleLabel,
  onChange,
  onBlur,
  onFocus,
  onToggle,
}) => (
  <div>
    <label className="cohort-set-password-page__field-label" htmlFor={id}>
      {label}
      {' '}
      <span className="cohort-set-password-page__required" aria-hidden>*</span>
    </label>
    <div className="cohort-set-password-page__input-wrap">
      <FontAwesomeIcon icon={faLock} className="cohort-set-password-page__input-icon" aria-hidden />
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        className={`cohort-set-password-page__input ${isInvalid ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="cohort-set-password-page__toggle-btn"
        onClick={onToggle}
        aria-label={toggleLabel}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden />
      </button>
    </div>
    {errorMessage && (
      <p className="cohort-set-password-page__field-error" role="alert">{errorMessage}</p>
    )}
  </div>
);

const CohortSetPasswordPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intl = useIntl();
  const logoUrl = getConfig().LOGO_URL;

  const activationKey = searchParams.get('activation_key') || '';
  const emailFallback = searchParams.get('email') || '';

  const [loading, setLoading] = useState(true);
  const [activationError, setActivationError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ password: '', confirmPassword: '' });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadActivation = async () => {
      if (!activationKey || !slug) {
        setActivationError(intl.formatMessage(messages.activationError));
        setLoading(false);
        return;
      }

      setLoading(true);
      setActivationError('');
      try {
        const result = await activateCohortEmail(slug, activationKey);
        if (!mounted) {
          return;
        }
        if (result.alreadyCompleted && result.redirectUrl) {
          window.location.assign(result.redirectUrl);
          return;
        }
        if (!result.valid) {
          setActivationError(resolveCohortMessage(
            result.message,
            messages.activationError,
            intl.formatMessage,
          ));
          return;
        }
        setEmail(result.email || emailFallback);
        setDisplayName(result.name || '');
      } catch {
        if (mounted) {
          setActivationError(resolveCohortMessage(
            '',
            messages.activationError,
            intl.formatMessage,
          ));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadActivation();
    return () => { mounted = false; };
  }, [activationKey, emailFallback, intl, slug]);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
    setSubmitError('');
  }, []);

  const handlePasswordBlur = useCallback(async () => {
    const localError = validateCohortPasswordLocally(password, intl.formatMessage);
    if (localError) {
      setFieldErrors((prev) => ({ ...prev, password: localError }));
      return;
    }

    const backendError = await validateCohortPasswordFromBackend(password);
    setFieldErrors((prev) => ({ ...prev, password: backendError }));
  }, [intl, password]);

  const handleConfirmPasswordBlur = useCallback(() => {
    const error = validateCohortConfirmPassword(
      confirmPassword,
      password,
      intl.formatMessage,
      resetPasswordMessages,
    );
    setFieldErrors((prev) => ({ ...prev, confirmPassword: error }));
  }, [confirmPassword, intl, password]);

  const validateForm = useCallback(async () => {
    const passwordError = validateCohortPasswordLocally(password, intl.formatMessage);
    const confirmError = validateCohortConfirmPassword(
      confirmPassword,
      password,
      intl.formatMessage,
      resetPasswordMessages,
    );

    if (passwordError || confirmError) {
      setFieldErrors({
        password: passwordError,
        confirmPassword: confirmError,
      });
      return false;
    }

    const backendError = await validateCohortPasswordFromBackend(password);
    if (backendError) {
      setFieldErrors({
        password: backendError,
        confirmPassword: '',
      });
      return false;
    }

    setFieldErrors({ password: '', confirmPassword: '' });
    return true;
  }, [confirmPassword, intl, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCohortSetPassword({
        password,
        confirmPassword,
      });
      if (!result.success) {
        setSubmitError(resolveCohortMessage(
          result.message,
          cohortApiMessages.setPasswordFailed,
          intl.formatMessage,
        ));
        return;
      }

      setCohortEnrollmentSession(slug, result);
      navigate(
        buildCohortRegistrationSuccessPath(slug, {
          activationKey,
          method: 'email',
        }),
        { state: { enrollment: result } },
      );
    } catch {
      setSubmitError(resolveCohortMessage(
        '',
        cohortApiMessages.setPasswordFailed,
        intl.formatMessage,
      ));
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordLabel = showPassword
    ? intl.formatMessage(messages.togglePasswordHide)
    : intl.formatMessage(messages.togglePasswordShow);

  return (
    <div className="cohort-register-page cohort-set-password-page">
      <div className="cohort-set-password-page__card">
        <div className="cohort-register-page__container">
          <div className="cohort-register-page__header">
            {logoUrl && (
              <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
            )}
            <h1 className="cohort-register-page__title">
              {intl.formatMessage(messages.pageTitle)}
            </h1>
          </div>

          <div className="cohort-register-page__content">
            {loading && (
              <CohortLoadingSpinner />
            )}

            {!loading && activationError && (
              <p className="cohort-register-page__error">{activationError}</p>
            )}

            {!loading && !activationError && (
              <>
                <div className="cohort-set-password-page__verified-badge">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="cohort-set-password-page__verified-icon"
                    aria-hidden
                  />
                  {intl.formatMessage(messages.emailVerified)}
                </div>
                <h2 className="cohort-set-password-page__heading">
                  {intl.formatMessage(messages.thankYouTitle)}
                </h2>
                <p className="cohort-set-password-page__intro">
                  {displayName
                    ? intl.formatMessage(messages.thankYouIntroNamed, { name: displayName })
                    : intl.formatMessage(messages.thankYouIntro)}
                  {' '}
                  {email && (
                    <span className="cohort-set-password-page__email">{email}</span>
                  )}
                  .
                </p>

                <form className="cohort-set-password-page__form" onSubmit={handleSubmit} noValidate>
                  <CohortPasswordField
                    id="cohort-set-password"
                    name="password"
                    label={intl.formatMessage(messages.setPasswordLabel)}
                    value={password}
                    showPassword={showPassword}
                    isInvalid={!!fieldErrors.password}
                    errorMessage={fieldErrors.password}
                    placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                    toggleLabel={togglePasswordLabel}
                    onChange={(value) => {
                      setPassword(value);
                      clearFieldError('password');
                    }}
                    onBlur={handlePasswordBlur}
                    onFocus={() => clearFieldError('password')}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                  <CohortPasswordField
                    id="cohort-confirm-password"
                    name="confirmPassword"
                    label={intl.formatMessage(messages.confirmPasswordLabel)}
                    value={confirmPassword}
                    showPassword={showPassword}
                    isInvalid={!!fieldErrors.confirmPassword}
                    errorMessage={fieldErrors.confirmPassword}
                    placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                    toggleLabel={togglePasswordLabel}
                    onChange={(value) => {
                      setConfirmPassword(value);
                      clearFieldError('confirmPassword');
                    }}
                    onBlur={handleConfirmPasswordBlur}
                    onFocus={() => clearFieldError('confirmPassword')}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />

                  {submitError && (
                    <CohortSubmitErrorAlert message={submitError} />
                  )}

                  <button
                    type="submit"
                    className="cohort-set-password-page__submit-btn"
                    disabled={submitting}
                  >
                    {submitting
                      ? intl.formatMessage(messages.submitting)
                      : intl.formatMessage(messages.confirmPassword)}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CohortSetPasswordPage;
