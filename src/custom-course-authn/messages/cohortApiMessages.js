import { defineMessages } from '@edx/frontend-platform/i18n';

const cohortApiMessages = defineMessages({
  googleSignInFailed: {
    id: 'custom.course.authn.api.google.signin.failed',
    defaultMessage: 'Google sign-in failed. Please try again.',
    description: 'Fallback when Google sign-in API returns no message',
  },
  googleSignInUnavailable: {
    id: 'custom.course.authn.api.google.signin.unavailable',
    defaultMessage: 'Google sign-in is unavailable. Please try email registration instead.',
    description: 'Fallback when Google OAuth start returns no redirect URL',
  },
  emailStartFailed: {
    id: 'custom.course.authn.api.email.start.failed',
    defaultMessage: 'Email sign-up failed. Please try again.',
    description: 'Fallback when email start API returns no message',
  },
  activationFailed: {
    id: 'custom.course.authn.api.activation.failed',
    defaultMessage: 'This activation link is invalid or has expired.',
    description: 'Fallback when email activation API returns no message',
  },
  setPasswordFailed: {
    id: 'custom.course.authn.api.set.password.failed',
    defaultMessage: 'Unable to set your password. Please try again.',
    description: 'Fallback when set-password API returns no message',
  },
  eligibilityValidationFailed: {
    id: 'custom.course.authn.api.eligibility.failed',
    defaultMessage: 'Validation failed. Please try again.',
    description: 'Fallback when eligibility check API request fails',
  },
  eligibilityRejected: {
    id: 'custom.course.authn.api.eligibility.rejected',
    defaultMessage: 'This value is not eligible for registration.',
    description: 'Fallback when eligibility check returns not eligible without a message',
  },
  prepareAuthFailed: {
    id: 'custom.course.authn.api.prepare.auth.failed',
    defaultMessage: 'Unable to submit your registration. Please try again.',
    description: 'Fallback when prepare-auth API returns no message',
  },
  verifyEmailFallback: {
    id: 'custom.course.authn.api.verify.email.fallback',
    defaultMessage: "We've sent a verification link to {email}. Please open your email and click the link to verify and continue your registration.",
    description: 'Fallback verify-email message when API message is unavailable on refresh',
  },
});

export default cohortApiMessages;
