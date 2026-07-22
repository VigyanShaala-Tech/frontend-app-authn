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
  multiselectMaxSelections: {
    id: 'custom.course.authn.validation.multiselect.max.selections',
    defaultMessage: 'You can only select {maxSelections} option(s).',
    description: 'Shown when multiselect selection exceeds maxSelections limit',
  },
  textMinLength: {
    id: 'custom.course.authn.validation.text.min.length',
    defaultMessage: 'Enter at least {minLen} characters.',
    description: 'Shown when a text/textarea answer is shorter than the configured minimum length',
  },
  textMaxLength: {
    id: 'custom.course.authn.validation.text.max.length',
    defaultMessage: 'Enter at most {maxLen} characters.',
    description: 'Shown when a text/textarea answer is longer than the configured maximum length',
  },
  textLengthHintBoth: {
    id: 'custom.course.authn.validation.text.length.hint.both',
    defaultMessage: 'Must be between {minLen} and {maxLen} characters.',
    description: 'Helper text shown below a text/textarea field with both min and max length configured',
  },
  textLengthHintMin: {
    id: 'custom.course.authn.validation.text.length.hint.min',
    defaultMessage: 'Must be at least {minLen} characters.',
    description: 'Helper text shown below a text/textarea field with a min length configured',
  },
  textLengthHintMax: {
    id: 'custom.course.authn.validation.text.length.hint.max',
    defaultMessage: 'Must be at most {maxLen} characters.',
    description: 'Helper text shown below a text/textarea field with a max length configured',
  },
  fileAcceptHint: {
    id: 'custom.course.authn.validation.file.accept.hint',
    defaultMessage: 'Accepted formats: {accept}',
    description: 'Helper text shown below a file field listing accepted file types',
  },
  fileMaxSizeHint: {
    id: 'custom.course.authn.validation.file.max.size.hint',
    defaultMessage: 'Max size: {maxSizeMB} MB',
    description: 'Helper text shown below a file field with the maximum upload size',
  },
  fileFormatNotAllowed: {
    id: 'custom.course.authn.validation.file.format.not.allowed',
    defaultMessage: 'This file type is not allowed. Accepted formats: {accept}',
    description: 'Shown when the selected file extension/type does not match the allowed list',
  },
  fileTooLarge: {
    id: 'custom.course.authn.validation.file.too.large',
    defaultMessage: 'File is too large. Maximum size is {maxSizeMB} MB.',
    description: 'Shown when the selected file exceeds the configured maximum size',
  },
  fileUploading: {
    id: 'custom.course.authn.validation.file.uploading',
    defaultMessage: 'Uploading…',
    description: 'Shown while a file field upload request is in progress',
  },
  fileUploadFailed: {
    id: 'custom.course.authn.validation.file.upload.failed',
    defaultMessage: 'File upload failed. Please try again.',
    description: 'Shown when the file upload request fails',
  },
});

export default formValidationMessages;
