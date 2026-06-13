import React, { useEffect, useState } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faCircleCheck, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { buildCohortRegistrationSuccessPath } from '../../data/constants';
import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import {
  submitCohortSetPassword,
  validateCohortActivation,
} from '../../services/cohortRegistrationService';

import messages from './messages';

import '../CohortRegisterPage/cohort-register-page.scss';
import './cohort-set-password-page.scss';

const MIN_PASSWORD_LENGTH = 8;

const CohortPasswordField = ({
  id,
  label,
  value,
  showPassword,
  isInvalid,
  placeholder,
  toggleLabel,
  onChange,
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
        type={showPassword ? 'text' : 'password'}
        className={`cohort-set-password-page__input ${isInvalid ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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
  const [pageTitle, setPageTitle] = useState('Registration Records Access');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadActivation = async () => {
      setLoading(true);
      setActivationError('');
      try {
        const result = await validateCohortActivation(slug, activationKey, emailFallback);
        if (!mounted) {
          return;
        }
        if (!result.valid) {
          setActivationError(result.message || intl.formatMessage(messages.activationError));
          return;
        }
        setEmail(result.email || emailFallback);
        if (result.pageTitle) {
          setPageTitle(result.pageTitle);
        }
      } catch {
        if (mounted) {
          setActivationError(intl.formatMessage(messages.activationError));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(intl.formatMessage(messages.passwordTooShort));
      return;
    }
    if (password !== confirmPassword) {
      setFormError(intl.formatMessage(messages.passwordsDoNotMatch));
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCohortSetPassword(slug, {
        activation_key: activationKey,
        password,
        confirm_password: confirmPassword,
        email,
      });
      if (!result.success) {
        setFormError(result.message || intl.formatMessage(messages.submitError));
        return;
      }
      navigate(
        buildCohortRegistrationSuccessPath(slug, {
          activationKey,
          method: 'email',
        }),
        { state: { enrollment: result } },
      );
    } catch {
      setFormError(intl.formatMessage(messages.submitError));
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordLabel = showPassword
    ? intl.formatMessage(messages.togglePasswordHide)
    : intl.formatMessage(messages.togglePasswordShow);

  return (
    <div className="cohort-register-page cohort-set-password-page">
      <div className="cohort-register-page__container">
        <div className="cohort-set-password-page__card">
          <div className="cohort-register-page__header">
            {logoUrl && (
              <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
            )}
            <h1 className="cohort-register-page__title">{pageTitle}</h1>
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
                  {intl.formatMessage(messages.thankYouIntro)}
                  {' '}
                  {email && (
                    <span className="cohort-set-password-page__email">{email}</span>
                  )}
                  .
                </p>

                <form className="cohort-set-password-page__form" onSubmit={handleSubmit} noValidate>
                  <CohortPasswordField
                    id="cohort-set-password"
                    label={intl.formatMessage(messages.setPasswordLabel)}
                    value={password}
                    showPassword={showPassword}
                    isInvalid={!!formError}
                    placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                    toggleLabel={togglePasswordLabel}
                    onChange={setPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                  <CohortPasswordField
                    id="cohort-confirm-password"
                    label={intl.formatMessage(messages.confirmPasswordLabel)}
                    value={confirmPassword}
                    showPassword={showPassword}
                    isInvalid={!!formError}
                    placeholder={intl.formatMessage(messages.passwordPlaceholder)}
                    toggleLabel={togglePasswordLabel}
                    onChange={setConfirmPassword}
                    onToggle={() => setShowPassword((prev) => !prev)}
                  />
                  {formError && (
                    <p className="cohort-set-password-page__error" role="alert">{formError}</p>
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
