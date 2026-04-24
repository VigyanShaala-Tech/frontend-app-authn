import { defineMessages } from '@edx/frontend-platform/i18n';

const customAlertMessages = defineMessages({
  'forgot.password.custom.alert.email.sent.subtitle': {
    id: 'forgot.password.custom.alert.email.sent.subtitle',
    defaultMessage: "We've sent a password reset link to:",
    description: 'Subtitle shown above email on custom forgot password success alert page',
  },
  'forgot.password.custom.alert.retry.copy': {
    id: 'forgot.password.custom.alert.retry.copy',
    defaultMessage: "Didn't receive the email? Check your spam folder or",
    description: 'Retry hint text on custom forgot password success alert page',
  },
  'forgot.password.custom.alert.retry.action': {
    id: 'forgot.password.custom.alert.retry.action',
    defaultMessage: 'Try another email address',
    description: 'Action button text to return to forgot password form',
  },
});

export default customAlertMessages;
