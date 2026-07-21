import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'forgot.password.page.title': {
    id: 'forgot.password.page.title',
    defaultMessage: 'Forgot Password | {siteName}',
    description: 'forgot password page title',
  },
  'forgot.password.page.heading': {
    id: 'forgot.password.page.heading',
    defaultMessage: 'Forgot Password?',
    description: 'The page heading for the forgot password page.',
  },
  'forgot.password.page.instructions': {
    id: 'forgot.password.page.instructions',
    defaultMessage: 'Enter your email address and we will send you a link to reset your password.',
    description: 'Instructions message for forgot password page.',
  },
  'forgot.password.page.invalid.email.message': {
    id: 'forgot.password.page.invalid.email.message',
    defaultMessage: 'Enter a valid email address',
    description: 'Invalid email address message for input field.',
  },
  'forgot.password.page.email.field.label': {
    id: 'forgot.password.page.email.field.label',
    defaultMessage: 'Email Address',
    description: 'Email field label for the forgot password page.',
  },
  'forgot.password.page.email.field.placeholder': {
    id: 'forgot.password.page.email.field.placeholder',
    defaultMessage: 'John@example.com',
    description: 'Email field placeholder for the forgot password page.',
  },
  'forgot.password.page.submit.button': {
    id: 'forgot.password.page.submit.button',
    defaultMessage: 'Send Reset Link',
    description: 'Submit button text for the forgot password page.',
  },
  'forgot.password.error.alert.title': {
    id: 'forgot.password.error.alert.title.',
    defaultMessage: 'We were unable to contact you.',
    description: 'Failed to send password recovery email.',
  },
  'forgot.password.error.message.title': {
    id: 'forgot.password.error.message.title',
    defaultMessage: 'An error occurred.',
    description: 'Title for message that appears when error occurs for password assistance page',
  },
  'forgot.password.request.in.progress.message': {
    id: 'forgot.password.request.in.progress.message',
    defaultMessage: 'Your previous request is in progress, please try again in a few moments.',
    description: 'Message displayed when previous password reset request is still in progress.',
  },
  'forgot.password.empty.email.field.error': {
    id: 'forgot.password.empty.email.field.error',
    defaultMessage: 'Enter your email',
    description: 'Error message that appears when user tries to submit empty email field',
  },
  'forgot.password.email.help.text': {
    id: 'forgot.password.email.help.text',
    defaultMessage: 'The email address you used to register with {platformName}',
    description: 'text help for the email',
  },
  // Confirmation Alert Message
  'confirmation.message.title': {
    id: 'confirmation.message.title',
    defaultMessage: 'Check your email',
    description: 'Forgot password confirmation message title',
  },
  'confirmation.support.link': {
    id: 'confirmation.support.link',
    defaultMessage: 'contact technical support',
    description: 'Technical support link text',
  },
  'need.help.sign.in.text': {
    id: 'need.help.sign.in.text',
    defaultMessage: 'Need help logging in?',
    description: 'Sign in help link on forgot password page',
  },
  'additional.help.text': {
    id: 'additional.help.text',
    defaultMessage: 'For additional help, contact {platformName} support at ',
    description: 'additional help text on forgot password page',
  },
  'sign.in.text': {
    id: 'sign.in.text',
    defaultMessage: 'Back to Log In',
    description: 'login page link on password page',
  },
  'forgot.password.remember.prompt': {
    id: 'forgot.password.remember.prompt',
    defaultMessage: 'Remember your password?',
    description: 'Prompt text before sign-in link on custom forgot password page',
  },
  'forgot.password.sign.in.link': {
    id: 'forgot.password.sign.in.link',
    defaultMessage: 'Log In',
    description: 'Sign-in link label on custom forgot password page',
  },
  'extend.field.errors': {
    id: 'extend.field.errors',
    defaultMessage: '{emailError} below.',
    description: 'extends the field error for alert message',
  },
  // Reset password token validation failure
  'invalid.token.heading': {
    id: 'invalid.token.heading',
    defaultMessage: 'Invalid password reset link',
    description: 'Alert heading when reset password link is invalid',
  },
  'invalid.token.error.message': {
    id: 'invalid.token.error.message',
    defaultMessage: 'This password reset link is invalid. It may have been used already. Enter your email below to receive a new link.',
    description: 'Alert message when reset password link has expired or is invalid',
  },
  'token.validation.rate.limit.error.heading': {
    id: 'token.validation.rate.limit.error.heading',
    defaultMessage: 'Too many requests',
    description: 'Too many request at server end point',
  },
  'token.validation.rate.limit.error': {
    id: 'token.validation.rate.limit.error',
    defaultMessage: 'An error has occurred because of too many requests. Please try again after some time.',
    description: 'Error message that appears when server responds with 429 error code',
  },
  'token.validation.internal.sever.error.heading': {
    id: 'token.validation.internal.sever.error.heading',
    defaultMessage: 'Token validation failure',
    description: 'Failed to validate reset password token error message.',
  },
  'token.validation.internal.sever.error': {
    id: 'token.validation.internal.sever.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  // Error messages
  'internal.server.error': {
    id: 'internal.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
});
export default messages;
