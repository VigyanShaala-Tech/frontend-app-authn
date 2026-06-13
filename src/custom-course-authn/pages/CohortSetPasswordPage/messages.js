import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  loading: {
    id: 'custom.course.authn.set.password.loading',
    defaultMessage: 'Loading...',
    description: 'Loading state while validating activation link',
  },
  activationError: {
    id: 'custom.course.authn.set.password.activation.error',
    defaultMessage: 'This activation link is invalid or has expired.',
    description: 'Error when activation key validation fails',
  },
  emailVerified: {
    id: 'custom.course.authn.set.password.email.verified',
    defaultMessage: 'Email verified',
    description: 'Badge text shown after email verification',
  },
  thankYouTitle: {
    id: 'custom.course.authn.set.password.thank.you.title',
    defaultMessage: 'Thank you for verifying your email',
    description: 'Heading on set password page',
  },
  thankYouIntro: {
    id: 'custom.course.authn.set.password.thank.you.intro',
    defaultMessage: 'Set a password to secure your account for',
    description: 'Intro text before user email on set password page',
  },
  setPasswordLabel: {
    id: 'custom.course.authn.set.password.label',
    defaultMessage: 'Set password',
    description: 'Set password field label',
  },
  confirmPasswordLabel: {
    id: 'custom.course.authn.set.password.confirm.label',
    defaultMessage: 'Confirm password',
    description: 'Confirm password field label',
  },
  passwordPlaceholder: {
    id: 'custom.course.authn.set.password.placeholder',
    defaultMessage: '••••••••',
    description: 'Password input placeholder',
  },
  confirmPassword: {
    id: 'custom.course.authn.set.password.confirm.button',
    defaultMessage: 'Confirm Password',
    description: 'Submit button on set password page',
  },
  submitting: {
    id: 'custom.course.authn.set.password.submitting',
    defaultMessage: 'Please wait...',
    description: 'Submit in progress label',
  },
  passwordTooShort: {
    id: 'custom.course.authn.set.password.too.short',
    defaultMessage: 'Password must be at least 8 characters.',
    description: 'Validation error when password is too short',
  },
  passwordsDoNotMatch: {
    id: 'custom.course.authn.set.password.mismatch',
    defaultMessage: 'Passwords do not match.',
    description: 'Validation error when passwords do not match',
  },
  submitError: {
    id: 'custom.course.authn.set.password.submit.error',
    defaultMessage: 'Unable to set your password. Please try again.',
    description: 'Generic submit failure message',
  },
  togglePasswordShow: {
    id: 'custom.course.authn.set.password.show',
    defaultMessage: 'Show password',
    description: 'Accessible label to show password',
  },
  togglePasswordHide: {
    id: 'custom.course.authn.set.password.hide',
    defaultMessage: 'Hide password',
    description: 'Accessible label to hide password',
  },
});

export default messages;
