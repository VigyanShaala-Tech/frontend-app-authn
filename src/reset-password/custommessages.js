import { defineMessages } from '@edx/frontend-platform/i18n';

const customMessages = defineMessages({
  'reset.password.page.title': {
    id: 'reset.password.page.title',
    defaultMessage: 'Reset Password | {siteName}',
    description: 'Page title for custom reset password page',
  },
  'reset.password.heading': {
    id: 'reset.password.heading',
    defaultMessage: 'Reset Password',
    description: 'Heading text on custom reset password page',
  },
  'reset.password.page.instructions': {
    id: 'reset.password.page.instructions',
    defaultMessage: 'Enter and confirm your new password.',
    description: 'Instructions message for custom reset password page',
  },
  'new.password.label': {
    id: 'new.password.label',
    defaultMessage: 'New Password',
    description: 'New password field label',
  },
  'confirm.password.label': {
    id: 'confirm.password.label',
    defaultMessage: 'Confirm Password',
    description: 'Confirm password field label',
  },
  'new.password.placeholder': {
    id: 'new.password.placeholder',
    defaultMessage: 'Enter new password',
    description: 'Placeholder text for new password field',
  },
  'confirm.password.placeholder': {
    id: 'confirm.password.placeholder',
    defaultMessage: 'Enter confirm password',
    description: 'Placeholder text for confirm password field',
  },
  'reset.password.button': {
    id: 'reset.password.button',
    defaultMessage: 'Reset Password',
    description: 'Submit button text for custom reset password page',
  },
  'back.to.sign.in': {
    id: 'back.to.sign.in',
    defaultMessage: 'Back to Log In',
    description: 'Back to login link text on custom reset password page',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for invalid password',
  },
  'passwords.do.not.match': {
    id: 'passwords.do.not.match',
    defaultMessage: 'Passwords do not match',
    description: 'Error message when passwords do not match',
  },
  'confirm.your.password': {
    id: 'confirm.your.password',
    defaultMessage: 'Confirm your password',
    description: 'Error message when confirm password is empty',
  },
});

export default customMessages;
