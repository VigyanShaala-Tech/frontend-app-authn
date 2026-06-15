import { defineMessages } from '@edx/frontend-platform/i18n';

const formValidationMessages = defineMessages({
  fieldRequired: {
    id: 'custom.course.authn.validation.field.required',
    defaultMessage: 'This field is required.',
    description: 'Shown when a required form field is empty',
  },
  invalidEmail: {
    id: 'custom.course.authn.validation.email.invalid',
    defaultMessage: 'Enter a valid email address.',
    description: 'Shown when email format is invalid',
  },
  invalidUrl: {
    id: 'custom.course.authn.validation.url.invalid',
    defaultMessage: 'Enter a valid URL.',
    description: 'Shown when URL format is invalid',
  },
  passwordMinLength: {
    id: 'custom.course.authn.validation.password.min.length',
    defaultMessage: 'Password must be at least {minLen} characters.',
    description: 'Shown when password is shorter than minimum length',
  },
  phoneMinDigits: {
    id: 'custom.course.authn.validation.phone.min.digits',
    defaultMessage: 'Enter at least {minLen} digits.',
    description: 'Shown when phone number has too few digits',
  },
  phoneMaxDigits: {
    id: 'custom.course.authn.validation.phone.max.digits',
    defaultMessage: 'Enter at most {maxLen} digits.',
    description: 'Shown when phone number has too many digits',
  },
  invalidNumber: {
    id: 'custom.course.authn.validation.number.invalid',
    defaultMessage: 'Enter a valid number.',
    description: 'Shown when number field value is not numeric',
  },
  numberMin: {
    id: 'custom.course.authn.validation.number.min',
    defaultMessage: 'Value must be at least {min}.',
    description: 'Shown when number is below minimum',
  },
  numberMax: {
    id: 'custom.course.authn.validation.number.max',
    defaultMessage: 'Value must be at most {max}.',
    description: 'Shown when number is above maximum',
  },
});

export default formValidationMessages;
