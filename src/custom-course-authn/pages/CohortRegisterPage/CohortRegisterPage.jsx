import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import RegistrationFailure from '../../../register/components/RegistrationFailure';
import {
  FORM_SUBMISSION_ERROR,
  FORBIDDEN_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../../register/data/constants';
import CohortFieldRenderer from '../../components/CohortFieldRenderer/CohortFieldRenderer';
import CohortInfoSections from '../../components/CohortInfoSections/CohortInfoSections';
import CohortLoadingSpinner from '../../components/CohortLoadingSpinner/CohortLoadingSpinner';
import CohortProgressStepper from '../../components/CohortProgressStepper/CohortProgressStepper';
import CohortSubmitErrorAlert from '../../components/CohortSubmitErrorAlert/CohortSubmitErrorAlert';
import {
  buildCohortFormSubmittedPath,
} from '../../data/constants';
import cohortApiMessages from '../../messages/cohortApiMessages';
import {
  checkCohortEligibility,
  fetchCohortRegistrationForm,
  prepareCohortAuth,
} from '../../services/cohortRegistrationService';
import { extractApiMessage, resolveCohortMessage } from '../../utils/cohortApiMessage';
import {
  getCascadeChangedLevelIndex,
  getCascadeLevelValidationKey,
  getCascadeLevels,
  getCascadeLevelsToReset,
} from '../../utils/cascadeSelectUtils';
import { buildInitialFormValues, buildSubmitPayload } from '../../utils/fieldUtils';
import { setCohortFormSubmittedSession } from '../../utils/cohortFormSubmittedSession';
import { isStepValid, validateFieldLocally } from '../../utils/formValidation';

import messages from './messages';

import './cohort-register-page.scss';

const resolveSubmitErrorCode = (status) => {
  if (status === 403) {
    return FORBIDDEN_REQUEST;
  }
  if (!status || status >= 500) {
    return INTERNAL_SERVER_ERROR;
  }
  return FORM_SUBMISSION_ERROR;
};

const CohortRegisterPage = () => {
  const { slug } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();

  const [formConfig, setFormConfig] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState({ type: '', count: 0, message: '' });
  const eligibilityRequestIdsRef = useRef({});

  const steps = useMemo(() => formConfig?.result || [], [formConfig]);
  const allFields = useMemo(() => steps.flatMap((step) => step.fields), [steps]);
  const currentStep = steps[currentStepIndex];
  const logoUrl = getConfig().LOGO_URL;
  const pageTitle = formConfig?.pageTitle || '';

  useEffect(() => {
    if (!slug) {
      setLoadError(intl.formatMessage(messages.loadError));
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    const loadForm = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const data = await fetchCohortRegistrationForm(slug);
        if (!mounted) {
          return;
        }
        setFormConfig(data);
        setFormValues(buildInitialFormValues(data.result || []));
      } catch (error) {
        if (mounted) {
          setLoadError(resolveCohortMessage(
            extractApiMessage(error),
            messages.loadError,
            intl.formatMessage,
          ));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadForm();
    return () => { mounted = false; };
  }, [slug, intl]);

  const handleFieldChange = useCallback((name, value) => {
    setSubmitError((prev) => (prev.type ? { type: '', count: prev.count, message: '' } : prev));
    setFormValues((prev) => {
      const next = { ...prev, [name]: value };
      steps.forEach((step) => {
        step.fields.forEach((field) => {
          if (field.dependsOn === name) {
            if (field.type === 'multiselect') {
              next[field.name] = [];
            } else if (field.type === 'file' || field.type === 'image') {
              next[field.name] = null;
            } else if (field.type === 'checkbox') {
              next[field.name] = false;
            } else if (field.type === 'range') {
              next[field.name] = String(field.validation?.min ?? 50);
            } else if (field.type === 'color') {
              next[field.name] = field.defaultValue ?? '#69ab4a';
            } else {
              next[field.name] = '';
            }
            delete next[`${field.name}_other`];
          }
        });
      });
      return next;
    });

    const changedField = steps.flatMap((step) => step.fields).find((field) => field.name === name);
    const cascadeLevels = changedField?.type === 'cascade_select'
      ? getCascadeLevels(changedField)
      : [];
    const changedLevelIndex = changedField?.type === 'cascade_select'
      ? getCascadeChangedLevelIndex(cascadeLevels, formValues[name], value)
      : -1;
    const cascadeLevelsToReset = getCascadeLevelsToReset(cascadeLevels, changedLevelIndex);

    const dependentFields = steps.flatMap((step) => step.fields).filter((field) => field.dependsOn === name);

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      cascadeLevelsToReset.forEach((level) => {
        delete next[getCascadeLevelValidationKey(name, level.key)];
      });
      dependentFields.forEach((field) => {
        delete next[field.name];
      });
      return next;
    });

    setValidationStatus((prev) => {
      const next = { ...prev };
      let changed = false;
      if (next[name]) {
        delete next[name];
        changed = true;
      }
      cascadeLevelsToReset.forEach((level) => {
        const statusKey = getCascadeLevelValidationKey(name, level.key);
        if (next[statusKey]) {
          delete next[statusKey];
          changed = true;
        }
      });
      dependentFields.forEach((field) => {
        if (next[field.name]) {
          delete next[field.name];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [formValues, steps]);

  const runFieldValidation = useCallback(async (field, valueOverride, levelKey) => {
    const isCascadeLevel = field.type === 'cascade_select' && levelKey;

    const activeValues = isCascadeLevel
      ? { ...formValues, [field.name]: valueOverride }
      : valueOverride !== undefined
        ? { ...formValues, [field.name]: valueOverride }
        : formValues;

    const validationKey = isCascadeLevel
      ? getCascadeLevelValidationKey(field.name, levelKey)
      : field.name;

    if (!isCascadeLevel) {
      const localResult = validateFieldLocally(field, activeValues, intl.formatMessage);
      if (!localResult.valid) {
        setFieldErrors((prev) => ({ ...prev, [validationKey]: localResult.message }));
        setValidationStatus((prev) => ({
          ...prev,
          [validationKey]: { valid: false, message: localResult.message, loading: false },
        }));
        return;
      }
    } else {
      const levelValue = valueOverride?.[levelKey];
      if (!levelValue) {
        return;
      }
    }

    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[validationKey];
      delete next[field.name];
      return next;
    });

    if (!field.isEligibilityField) {
      return;
    }

    const apiValue = isCascadeLevel
      ? valueOverride[levelKey]
      : activeValues[field.name];

    if (!apiValue && apiValue !== 0) {
      return;
    }

    const requestId = (eligibilityRequestIdsRef.current[validationKey] || 0) + 1;
    eligibilityRequestIdsRef.current[validationKey] = requestId;

    setValidationStatus((prev) => ({
      ...prev,
      [validationKey]: { valid: null, message: '', loading: true },
    }));

    try {
      const payload = buildSubmitPayload(steps, activeValues);
      const result = await checkCohortEligibility(slug, payload, field.name);

      if (eligibilityRequestIdsRef.current[validationKey] !== requestId) {
        return;
      }

      const eligibilityMessage = result.valid
        ? ''
        : resolveCohortMessage(
          result.message,
          cohortApiMessages.eligibilityRejected,
          intl.formatMessage,
        );

      setValidationStatus((prev) => ({
        ...prev,
        [validationKey]: {
          valid: result.valid,
          message: eligibilityMessage,
          loading: false,
        },
      }));

      if (!result.valid) {
        setFieldErrors((prev) => ({ ...prev, [validationKey]: eligibilityMessage }));
        return;
      }

      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[validationKey];
        delete next[field.name];
        return next;
      });
    } catch {
      if (eligibilityRequestIdsRef.current[validationKey] !== requestId) {
        return;
      }

      setValidationStatus((prev) => ({
        ...prev,
        [validationKey]: {
          valid: false,
          message: resolveCohortMessage(
            '',
            cohortApiMessages.eligibilityValidationFailed,
            intl.formatMessage,
          ),
          loading: false,
        },
      }));
    }
  }, [formValues, intl, slug, steps]);

  const canProceed = useMemo(() => {
    if (!currentStep) {
      return false;
    }
    return isStepValid(currentStep, formValues, fieldErrors, validationStatus);
  }, [currentStep, formValues, fieldErrors, validationStatus]);

  const handleNext = () => {
    if (!canProceed || currentStepIndex >= steps.length - 1) {
      return;
    }
    setCurrentStepIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed || submitting || !slug) {
      return;
    }
    setSubmitting(true);
    setSubmitError({ type: '', count: 0, message: '' });
    try {
      const response = await prepareCohortAuth(slug, buildSubmitPayload(steps, formValues));
      if (!response.success) {
        setSubmitError((prev) => ({
          type: resolveSubmitErrorCode(response.status),
          count: prev.count + 1,
          message: resolveCohortMessage(
            response.message,
            cohortApiMessages.prepareAuthFailed,
            intl.formatMessage,
          ),
        }));
        return;
      }

      const submitPayload = buildSubmitPayload(steps, formValues);
      setCohortFormSubmittedSession(slug, {
        thanksMessage: response.thanksMessage,
        googleLoginUrl: response.loginOptions?.google || '',
        email: submitPayload.email || formValues.email || '',
        pageTitle,
      });
      navigate(buildCohortFormSubmittedPath(slug), { replace: true });
    } catch {
      setSubmitError((prev) => ({
        type: INTERNAL_SERVER_ERROR,
        count: prev.count + 1,
        message: resolveCohortMessage(
          '',
          cohortApiMessages.prepareAuthFailed,
          intl.formatMessage,
        ),
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="cohort-register-page">
        <div className="cohort-register-page__container">
          <CohortLoadingSpinner />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="cohort-register-page">
        <div className="cohort-register-page__container">
          <p className="cohort-register-page__error">{loadError}</p>
        </div>
      </div>
    );
  }

  const isLastStep = currentStepIndex === steps.length - 1;
  const showEmail = currentStep?.showEmailFromField && formValues[currentStep.showEmailFromField];

  return (
    <div className="cohort-register-page">
      <div className="cohort-register-page__container">
        <div className="cohort-register-page__header">
          {logoUrl && (
            <img src={logoUrl} alt="VigyanShaala" className="cohort-register-page__logo" />
          )}
          <h1 className="cohort-register-page__title">{pageTitle}</h1>
        </div>

        {steps.length > 0 && (
          <CohortProgressStepper steps={steps} currentStepIndex={currentStepIndex} />
        )}

        <div className="cohort-register-page__content">
          {currentStep && (
            <div>
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    className="cohort-register-page__back-btn"
                    onClick={handleBack}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="cohort-register-page__back-btn-icon"
                      aria-hidden
                    />
                    {intl.formatMessage(messages.back)}
                  </button>
                )}

                {currentStep.description && (
                  <p className="cohort-register-page__step-description">{currentStep.description}</p>
                )}

                {showEmail && (
                  <p className="cohort-register-page__email-line">
                    {intl.formatMessage(messages.emailLabel)}
                    {' '}
                    <a href={`mailto:${formValues.email}`} className="cohort-register-page__email-link">
                      {formValues.email}
                    </a>
                  </p>
                )}

                {currentStep.fields.map((field) => (
                  <CohortFieldRenderer
                    key={field.name}
                    field={field}
                    allFields={allFields}
                    formValues={formValues}
                    fieldErrors={fieldErrors}
                    validationStatus={validationStatus}
                    onChange={handleFieldChange}
                    onBlur={runFieldValidation}
                  />
                ))}

                <div className="cohort-register-page__actions">
                  {isLastStep ? (
                    <button
                      type="button"
                      className="cohort-register-page__next-btn"
                      disabled={!canProceed || submitting}
                      onClick={handleSubmit}
                    >
                      {submitting
                        ? intl.formatMessage(messages.submitting)
                        : intl.formatMessage(messages.submit)}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cohort-register-page__next-btn"
                      disabled={!canProceed}
                      onClick={handleNext}
                    >
                      {intl.formatMessage(messages.next)}
                    </button>
                  )}
                </div>

                {isLastStep && submitError.type && submitError.message && (
                  <CohortSubmitErrorAlert message={submitError.message} />
                )}

                {isLastStep && submitError.type && !submitError.message && (
                  <RegistrationFailure
                    errorCode={submitError.type}
                    failureCount={submitError.count}
                    scrollToTop={false}
                  />
                )}

                {currentStepIndex === 0 && formConfig?.infoSections && (
                  <CohortInfoSections html={formConfig.infoSections} />
                )}

                {currentStep.infoSections && (
                  <CohortInfoSections html={currentStep.infoSections} />
                )}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

CohortRegisterPage.propTypes = {
  slug: PropTypes.string,
};

export default CohortRegisterPage;
