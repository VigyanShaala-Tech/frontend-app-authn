import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'register.page.title': {
    id: 'register.page.title',
    defaultMessage: 'Register | {siteName}',
    description: 'register page title',
  },
  // Field labels
  'registration.fullname.label': {
    id: 'registration.fullname.label',
    defaultMessage: 'Full name',
    description: 'Label that appears above fullname field',
  },
  'registration.fullname.placeholder': {
    id: 'registration.fullname.placeholder',
    defaultMessage: 'John Doe',
    description: 'placeholder that appears in fullname field',
  },
  'registration.email.label': {
    id: 'registration.email.label',
    defaultMessage: 'Email Address',
    description: 'Label that appears above email field on register page',
  },
  'registration.email.placeholder': {
    id: 'registration.email.placeholder',
    defaultMessage: 'john@example.com',
    description: 'placeholder that appears in email field on register page',
  },
  'registration.username.label': {
    id: 'registration.username.label',
    defaultMessage: 'Public username',
    description: 'Label that appears above username field',
  },
  'registration.password.label': {
    id: 'registration.password.label',
    defaultMessage: 'Password',
    description: 'Label that appears above password field',
  },
  'registration.password.placeholder': {
    id: 'registration.password.placeholder',
    defaultMessage: 'Create password',
    description: 'placeholder that appears in password field',
  },
  'registration.country.label': {
    id: 'registration.country.label',
    defaultMessage: 'Country/Region',
    description: 'Placeholder for the country options dropdown.',
  },
  'registration.opt.in.label': {
    id: 'registration.opt.in.label',
    defaultMessage: 'I agree that {siteName} may send me marketing messages.',
    description: 'Text for opt in option on register page.',
  },
  // Help text
  'help.text.name': {
    id: 'help.text.name',
    defaultMessage: 'This name will be used by any certificates that you earn.',
    description: 'Help text for fullname field on registration page',
  },
  'help.text.username.1': {
    id: 'help.text.username.1',
    defaultMessage: 'The name that will identify you in your courses.',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.username.2': {
    id: 'help.text.username.2',
    defaultMessage: 'This can not be changed later.',
    description: 'Part of help text for username field on registration page',
  },
  'help.text.email': {
    id: 'help.text.email',
    defaultMessage: 'For account activation and important updates',
    description: 'Help text for email field on registration page',
  },
  // Form buttons
  'create.account.for.free.button': {
    id: 'create.account.for.free.button',
    defaultMessage: 'Create Account',
    description: 'Label text for registration form submission button',
  },
  'create.account.cta.button': {
    id: 'create.account.cta.button',
    defaultMessage: '{label}',
    description: 'Label text for registration form submission button for those users who are landing through redirections',
  },
  // Institution login
  'register.institution.login.page.title': {
    id: 'register.institution.login.page.title',
    defaultMessage: 'Register with institution/campus credentials',
    description: 'Heading of institution page',
  },
  // Validation messages
  'empty.name.field.error': {
    id: 'empty.name.field.error',
    defaultMessage: 'Enter your full name',
    description: 'Error message for empty fullname field',
  },
  'empty.email.field.error': {
    id: 'empty.email.field.error',
    defaultMessage: 'Enter your email',
    description: 'Error message for empty email field',
  },
  'empty.username.field.error': {
    id: 'empty.username.field.error',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field',
  },
  'empty.password.field.error': {
    id: 'empty.password.field.error',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty password field',
  },
  'empty.country.field.error': {
    id: 'empty.country.field.error',
    defaultMessage: 'Select your country or region of residence',
    description: 'Error message when no country/region is selected',
  },
  'invalid.country.field.error': {
    id: 'invalid.country.field.error',
    defaultMessage: 'Country must match with an option available in the dropdown.',
    description: 'Error message when country is invalid',
  },
  'email.do.not.match': {
    id: 'email.do.not.match',
    defaultMessage: 'The email addresses do not match.',
    description: 'Email not match to confirm email',
  },
  'email.invalid.format.error': {
    id: 'email.invalid.format.error',
    defaultMessage: 'Enter a valid email address',
    description: 'Validation error for invalid email address',
  },
  'username.validation.message': {
    id: 'username.validation.message',
    defaultMessage: 'Username must be between 2 and 30 characters',
    description: 'Error message for empty username field',
  },
  'name.validation.message': {
    id: 'name.validation.message',
    defaultMessage: 'Enter a valid name',
    description: 'Validation message that appears when fullname contain URL',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Password criteria has not been met',
    description: 'Error message for empty or invalid password',
  },
  'username.format.validation.message': {
    id: 'username.format.validation.message',
    defaultMessage: 'Usernames can only contain letters (A-Z, a-z), numerals (0-9), underscores (_), and hyphens (-). Usernames cannot contain spaces',
    description: 'Validation message that appears when username format is invalid',
  },
  // Error messages
  'registration.request.failure.header': {
    id: 'registration.request.failure.header',
    defaultMessage: 'We couldn\'t create your account.',
    description: 'error message when registration failure.',
  },
  'registration.empty.form.submission.error': {
    id: 'registration.empty.form.submission.error',
    defaultMessage: 'Please check your responses and try again.',
    description: 'Error message that appears on top of the form when empty form is submitted',
  },
  'registration.request.server.error': {
    id: 'registration.request.server.error',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message for internal server error.',
  },
  'registration.rate.limit.error': {
    id: 'registration.rate.limit.error',
    defaultMessage: 'Too many failed registration attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed registration attempts',
  },
  'registration.tpa.session.expired': {
    id: 'registration.tpa.session.expired',
    defaultMessage: 'Registration using {provider} has timed out.',
    description: '',
  },
  'registration.forbidden.username': {
    id: 'registration.forbidden.username',
    defaultMessage: 'Usernames can\'t include words that could be mistaken for course roles. Please choose a different username.',
    description: '',
  },
  'registration.tpa.authentication.failure': {
    id: 'registration.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },
  // Terms of Service and Honor Code
  'terms.of.service.and.honor.code': {
    id: 'terms.of.service.and.honor.code',
    defaultMessage: 'Terms of Service and Honor Code',
    description: 'Text for the hyperlink that redirects user to terms of service and honor code',
  },
  'privacy.policy': {
    id: 'privacy.policy',
    defaultMessage: 'Privacy Policy',
    description: 'Text for the hyperlink that redirects user to privacy policy',
  },
  'honor.code': {
    id: 'honor.code',
    defaultMessage: 'Honor Code',
    description: 'Text for the hyperlink that redirects user to the honor code',
  },
  'terms.of.service': {
    id: 'terms.of.service',
    defaultMessage: 'Terms of Service',
    description: 'Text for the hyperlink that redirects user to the terms of service',
  },
  // miscellaneous strings
  'registration.username.suggestion.label': {
    id: 'registration.username.suggestion.label',
    defaultMessage: 'Suggested:',
    description: 'Suggested usernames label text.',
  },
  'did.you.mean.alert.text': {
    id: 'did.you.mean.alert.text',
    defaultMessage: 'Did you mean',
    description: 'Did you mean alert suggestion',
  },
  // New messages extracted for custom component
  'registration.user.role.label': {
    id: 'registration.user.role.label',
    defaultMessage: 'I am a',
    description: 'Label for user role select field',
  },
  'registration.gender.label': {
    id: 'registration.gender.label',
    defaultMessage: 'Gender',
    description: 'Label for gender field on registration form',
  },
  'registration.gender.option.male': {
    id: 'registration.gender.option.male',
    defaultMessage: 'Male',
    description: 'Male gender option label',
  },
  'registration.gender.option.female': {
    id: 'registration.gender.option.female',
    defaultMessage: 'Female',
    description: 'Female gender option label',
  },
  'registration.gender.option.prefer_not_to_say': {
    id: 'registration.gender.option.prefer_not_to_say',
    defaultMessage: 'Prefer not to say',
    description: 'Prefer not to say gender option label',
  },
  'registration.gender.required.error': {
    id: 'registration.gender.required.error',
    defaultMessage: 'Please select a gender',
    description: 'Error message when gender is not selected',
  },
  'registration.user.role.option.student': {
    id: 'registration.user.role.option.student',
    defaultMessage: 'Student',
    description: 'Option label in user role dropdown',
  },
  'registration.user.role.option.mentor': {
    id: 'registration.user.role.option.mentor',
    defaultMessage: 'Mentor',
    description: 'Option label in user role dropdown',
  },
  'registration.user.role.required.error': {
    id: 'registration.user.role.required.error',
    defaultMessage: 'Please select a user role',
    description: 'Error message when user role is not selected (required field)',
  },

  'registration.phone.number.label': {
    id: 'registration.phone.number.label',
    defaultMessage: 'Mobile Number',
    description: 'Label for phone number input field',
  },
  'registration.phone.number.placeholder': {
    id: 'registration.phone.number.placeholder',
    defaultMessage: '+91 9876543210',
    description: 'Placeholder text for phone number',
  },
  'registration.phone.number.required.error': {
    id: 'registration.phone.number.required.error',
    defaultMessage: 'Phone number required',
    description: 'Error when phone number is empty',
  },

  'registration.otp.send.button': {
    id: 'registration.otp.send.button',
    defaultMessage: 'Send OTP',
    description: 'Button label to send OTP',
  },
  'registration.otp.resend.button': {
    id: 'registration.otp.resend.button',
    defaultMessage: 'Resend OTP',
    description: 'Button label to resend OTP',
  },
  'registration.otp.second': {
    id: 'registration.otp.second',
    defaultMessage: 's',
    description: 'Resend button with countdown',
  },
  'registration.otp.sending': {
    id: 'registration.otp.sending',
    defaultMessage: 'Sending...',
    description: 'Loading text while sending OTP',
  },
  'registration.otp.resending': {
    id: 'registration.otp.resending',
    defaultMessage: 'Resending...',
    description: 'Loading text while resending OTP',
  },
  'registration.otp.enter.label': {
    id: 'registration.otp.enter.label',
    defaultMessage: 'Enter OTP',
    description: 'Label for OTP input field',
  },
  'registration.otp.placeholder': {
    id: 'registration.otp.placeholder',
    defaultMessage: 'Enter 6 digit OTP',
    description: 'Placeholder for OTP input',
  },
  'registration.otp.verify.button': {
    id: 'registration.otp.verify.button',
    defaultMessage: 'Verify',
    description: 'Button to verify OTP',
  },
  'registration.otp.verifying': {
    id: 'registration.otp.verifying',
    defaultMessage: 'Verifying...',
    description: 'Loading text while verifying OTP',
  },
  'registration.otp.required.error': {
    id: 'registration.otp.required.error',
    defaultMessage: 'Please enter OTP',
    description: 'Error when OTP input is empty',
  },
  'registration.phone.verified.success': {
    id: 'registration.phone.verified.success',
    defaultMessage: 'OTP Verified Successfully!',
    description: 'Success message after phone verification',
  },
  'registration.verify.phone.first': {
    id: 'registration.verify.phone.first',
    defaultMessage: 'Please verify your phone number with OTP first.',
    description: 'Error shown when trying to submit without phone verification',
  },

  'registration.confirm.password.label': {
    id: 'registration.confirm.password.label',
    defaultMessage: 'Confirm Password',
    description: 'Label for confirm password field',
  },
  'registration.confirm.password.placeholder': {
    id: 'registration.confirm.password.placeholder',
    defaultMessage: 'Confirm password',
    description: 'Placeholder for confirm password',
  },
  'registration.passwords.do.not.match': {
    id: 'registration.passwords.do.not.match',
    defaultMessage: 'Passwords do not match',
    description: 'Error when password and confirm password differ',
  },

  'registration.success.title': {
    id: 'registration.success.title',
    defaultMessage: 'Registration Successful!',
    description: 'Title of success message block',
  },
  'registration.success.check.email.before': {
    id: 'registration.success.check.email.before',
    defaultMessage: 'Please check your email ',
    description: 'Success message after registration',
  },
  'registration.success.check.email.after': {
    id: 'registration.success.check.email.after',
    defaultMessage: ' and click the activation link to verify your account.',
    description: 'Success message after registration',
  },

  'creating.account.message': {
    id: 'creating.account.message',
    defaultMessage: 'Creating your account...',
    description: 'Loading text during registration submission',
  },
  'empty.confirm_password.field.error': {
    id: 'empty.confirm_password.field.error',
    defaultMessage: 'Please confirm your password',
    description: 'Error message when confirm password field is empty',
  },

  'registration.terms.required.error': {
    id: 'registration.terms.required.error',
    defaultMessage: 'You must agree to the Terms of Service',
    description: 'Error when Terms of Service checkbox is not checked',
  },
  'registration.password.required.error': {
    id: 'registration.password.required.error',
    defaultMessage: 'Enter a password',
    description: 'Clear error when password field is completely empty',
  },
  'registration.network.error': {
    id: 'registration.network.error',
    defaultMessage: 'A network error occurred. Please check your internet connection and try again.',
    description: 'Generic network error shown during OTP send/verify failures',
  },
  'registration.otp.verification.pending': {
    id: 'registration.otp.verification.pending',
    defaultMessage: 'Please verify your phone number before continuing.',
    description: 'Alternative friendlier message for phone verification step',
  },
  'registration.otp.send.failed': {
    id: 'registration.otp.send.failed',
    defaultMessage: 'Failed to send OTP',
  },
  'registration.otp.resend.failed': {
    id: 'registration.otp.resend.failed',
    defaultMessage: 'Failed to resend OTP',
  },
  'registration.otp.invalid': {
    id: 'registration.otp.invalid',
    defaultMessage: 'Invalid OTP',
  },
  'registration.otp.sent.success': {
    id: 'registration.otp.sent.success',
    defaultMessage: 'OTP sent successfully',
  },
  'registration.otp.resent.success': {
    id: 'registration.otp.resent.success',
    defaultMessage: 'OTP resent successfully',
  },
  'registration.phone.verified.internal': {
    id: 'registration.phone.verified.internal',
    defaultMessage: 'Phone verified!',
  },
  'registration.phone.number.invalid.error': {
    id: 'registration.phone.number.invalid.error',
    defaultMessage: 'Please enter a valid phone number or register without phone number',
  },
  'registration.field.required.generic': {
    id: 'registration.field.required.generic',
    defaultMessage: 'This field is required',
  },
  'registration.user.role.select.placeholder': {
    id: 'registration.user.role.select.placeholder',
    defaultMessage: 'Select your role',
    description: 'Placeholder for user role select field',
  },
});

export default messages;
