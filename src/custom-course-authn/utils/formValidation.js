import formValidationMessages from '../messages/formValidationMessages';
import {
  getCascadeLevelValidationKey,
  getCascadeLevels,
  isCascadeLevelEligibilityPassed,
} from './cascadeSelectUtils';
import { isFieldFilled, isFieldShown } from './fieldUtils';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const URL_REGEX = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;

export const validateFieldLocally = (field, formValues, formatMessage) => {
  if (!isFieldShown(field, formValues)) {
    return { valid: true, message: '' };
  }

  if (field.required && !isFieldFilled(field, formValues)) {
    return {
      valid: false,
      message: formatMessage(formValidationMessages.fieldRequired),
    };
  }

  const value = formValues[field.name];

  if (field.type === 'multiselect' && Array.isArray(value) && field.maxSelections) {
    if (value.length > field.maxSelections) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.multiselectMaxSelections, {
          maxSelections: field.maxSelections,
        }),
      };
    }
  }

  if (field.type === 'email' && value && !EMAIL_REGEX.test(value)) {
    return {
      valid: false,
      message: formatMessage(formValidationMessages.invalidEmail),
    };
  }

  if ((field.type === 'url' || field.inputType === 'url') && value && !URL_REGEX.test(value)) {
    return {
      valid: false,
      message: formatMessage(formValidationMessages.invalidUrl),
    };
  }

  if (field.type === 'password' && value) {
    const minLen = field.validation?.minLength;
    if (minLen && String(value).length < minLen) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.passwordMinLength, { minLen }),
      };
    }
  }

  if ((field.type === 'tel' || field.type === 'telephone') && value) {
    const digits = String(value).replace(/\D/g, '');
    const minLen = field.validation?.minLength;
    const maxLen = field.validation?.maxLength;
    if (minLen && digits.length < minLen) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.phoneMinDigits, { minLen }),
      };
    }
    if (maxLen && digits.length > maxLen) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.phoneMaxDigits, { maxLen }),
      };
    }
  }

  if (field.type === 'number' && value !== '' && value !== null && value !== undefined) {
    const numericValue = Number(value);
    const min = field.validation?.min;
    const max = field.validation?.max;
    if (Number.isNaN(numericValue)) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.invalidNumber),
      };
    }
    if (min !== undefined && numericValue < min) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.numberMin, { min }),
      };
    }
    if (max !== undefined && numericValue > max) {
      return {
        valid: false,
        message: formatMessage(formValidationMessages.numberMax, { max }),
      };
    }
  }

  return { valid: true, message: '' };
};

export const isStepValid = (step, formValues, fieldErrors, validationStatus) => {
  const visibleFields = step.fields.filter((field) => isFieldShown(field, formValues));

  const requiredOk = visibleFields
    .filter((f) => f.required)
    .every((f) => isFieldFilled(f, formValues));

  if (!requiredOk) {
    return false;
  }

  const hasFieldErrors = visibleFields.some((field) => {
    if (fieldErrors[field.name]) {
      return true;
    }
    if (field.type === 'cascade_select') {
      return getCascadeLevels(field).some(
        (level) => fieldErrors[getCascadeLevelValidationKey(field.name, level.key)],
      );
    }
    return false;
  });
  if (hasFieldErrors) {
    return false;
  }

  const eligibilityOk = visibleFields
    .filter((f) => f.isEligibilityField)
    .every((field) => {
      if (field.type === 'cascade_select') {
        const levels = getCascadeLevels(field);
        const firstLevel = levels[0];
        if (!firstLevel) {
          return false;
        }
        const firstValue = formValues[field.name]?.[firstLevel.key];
        if (!firstValue) {
          return false;
        }
        return isCascadeLevelEligibilityPassed(field.name, firstLevel.key, validationStatus);
      }

      const status = validationStatus[field.name];
      if (!formValues[field.name]) {
        return false;
      }
      return status?.valid === true;
    });

  return eligibilityOk;
};
