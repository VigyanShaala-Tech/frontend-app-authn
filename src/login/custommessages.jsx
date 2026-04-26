import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'login.page.title': {
    id: 'login.page.title',
    defaultMessage: 'Login | {siteName}',
    description: 'login page title',
  },
  // Login labels
  'login.user.identity.label': {
    id: 'login.user.identity.label',
    defaultMessage: 'Email',
    description: 'Label for user identity field to enter either username or email to login',
  },
  'login.user.identity.placeholder': {
    id: 'login.user.identity.placeholder',
    defaultMessage: 'john@example.com',
    description: 'placeholder for user identity field to enter either username or email to login',
  },
  'login.password.label': {
    id: 'login.password.label',
    defaultMessage: 'Password',
    description: 'Label for password field',
  },
  'login.password.placeholder': {
    id: 'login.password.placeholder',
    defaultMessage: 'Enter your password',
    description: 'placeholder for password field',
  },
  'login.phone.number.label': {
    id: 'login.phone.number.label',
    defaultMessage: 'Mobile Number',
    description: 'Label for phone number input field',
  },
  'sign.in.button': {
    id: 'sign.in.button',
    defaultMessage: 'Sign in',
    description: 'Sign in button label that appears on login page',
  },
  'forgot.password': {
    id: 'forgot.password',
    defaultMessage: 'Forgot Password?',
    description: 'Button text for forgot password',
  },
  'remember.me': {
    id: 'remember.me',
    defaultMessage: 'Remember me',
    description: 'Label for remember me checkbox on custom login page',
  },
  'institution.login.button': {
    id: 'institution.login.button',
    defaultMessage: 'Institution/campus credentials',
    description: 'shows institutions list',
  },
  'institution.login.page.title': {
    id: 'institution.login.page.title',
    defaultMessage: 'Sign in with institution/campus credentials',
    description: 'Heading of institution page',
  },
  'institution.login.page.sub.heading': {
    id: 'institution.login.page.sub.heading',
    defaultMessage: 'Choose your institution from the list below',
    description: 'Heading of the institutions list',
  },
  'non.compliant.password.title': {
    id: 'non.compliant.password.title',
    defaultMessage: 'We recently changed our password requirements',
    description: 'A title that appears in bold before error message for non-compliant password',
  },
  'non.compliant.password.message': {
    id: 'non.compliant.password.message',
    defaultMessage: 'Your current password does not meet the new security requirements. '
                    + 'We just sent a password-reset message to the email address associated with this account. '
                    + 'Thank you for helping us keep your data safe.',
    description: 'Error message for non-compliant password',
  },
  'account.locked.out.message.1': {
    id: 'account.locked.out.message.1',
    defaultMessage: 'To protect your account, it\'s been temporarily locked. Try again in 30 minutes.',
    description: 'Part of message for when user account has been locked out after multiple failed login attempts',
  },
  'invalid.email.format.message': {
    id: 'invalid.email.format.message',
    defaultMessage: 'Please enter a valid email address',
    description: 'Invalid email format error',
  },
  'email.validation.message': {
    id: 'email.validation.message',
    defaultMessage: 'Enter your username or email',
    description: 'Validation message that appears when email is empty',
  },
  'password.validation.message': {
    id: 'password.validation.message',
    defaultMessage: 'Enter your password',
    description: 'Validation message that appears when password is empty',
  },
  // Account Activation Strings
  'account.activation.success.message.title': {
    id: 'account.activation.success.message.title',
    defaultMessage: 'Success! You have activated your account.',
    description: 'Account Activation success message title',
  },
  'account.activation.success.message': {
    id: 'account.activation.success.message',
    defaultMessage: 'You will now receive email updates and alerts from us related to the courses you are enrolled in. Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  'account.activation.info.message': {
    id: 'account.activation.info.message',
    defaultMessage: 'This account has already been activated.',
    description: 'Message shown when learner account has already been activated',
  },
  'account.activation.error.message.title': {
    id: 'account.activation.error.message.title',
    defaultMessage: 'Your account could not be activated',
    description: 'Account Activation error message title',
  },
  'account.activation.support.link': {
    id: 'account.activation.support.link',
    defaultMessage: 'contact support',
    description: 'Link text used in account activation error message to go to learner help center',
  },
  // Email Confirmation Strings
  'account.confirmation.success.message.title': {
    id: 'account.confirmation.success.message.title',
    defaultMessage: 'Success! You have confirmed your email.',
    description: 'Account verification success message title',
  },
  'account.confirmation.success.message': {
    id: 'account.confirmation.success.message',
    defaultMessage: 'Sign in to continue.',
    description: 'Message show to learners when their account has been activated successfully',
  },
  'account.confirmation.info.message': {
    id: 'account.confirmation.info.message',
    defaultMessage: 'This email has already been confirmed.',
    description: 'Message shown when learner account has already been verified',
  },
  'account.confirmation.error.message.title': {
    id: 'account.confirmation.error.message.title',
    defaultMessage: 'Your email could not be confirmed',
    description: 'Account verification error message title',
  },
  'tpa.account.link': {
    id: 'tpa.account.link',
    defaultMessage: '{provider} account',
    description: 'Link text error message used to go to SSO when staff user try to login through password.',
  },
  'internal.server.error.message': {
    id: 'internal.server.error.message',
    defaultMessage: 'An error has occurred. Try refreshing the page, or check your internet connection.',
    description: 'Error message that appears when server responds with 500 error code',
  },
  'login.rate.limit.reached.message': {
    id: 'login.rate.limit.reached.message',
    defaultMessage: 'Too many failed login attempts. Try again later.',
    description: 'Error message that appears when an anonymous user has made too many failed login attempts',
  },
  'login.failure.header.title': {
    id: 'login.failure.header.title',
    defaultMessage: 'We couldn\'t sign you in.',
    description: 'Login failure header message.',
  },
  'contact.support.link': {
    id: 'contact.support.link',
    defaultMessage: 'contact {platformName} support',
    description: 'Link text used in inactive user error message to go to learner help center',
  },
  'login.incorrect.credentials.error': {
    id: 'login.incorrect.credentials.error',
    defaultMessage: 'The username, email, or password you entered is incorrect. Please try again.',
    description: 'Error message for incorrect email or password',
  },
  'login.form.invalid.error.message': {
    id: 'login.form.invalid.error.message',
    defaultMessage: 'Please fill in the fields below.',
    description: 'Login form empty input user message',
  },
  'login.incorrect.credentials.error.reset.link.text': {
    id: 'login.incorrect.credentials.error.reset.link.text',
    defaultMessage: 'reset your password',
    description: 'Reset password link text for incorrect email or password credentials',
  },
  'login.incorrect.credentials.error.before.account.blocked.text': {
    id: 'login.incorrect.credentials.error.before.account.blocked.text',
    defaultMessage: 'click here to reset it.',
    description: 'Reset password link text for incorrect email or password credentials before blocking account',
  },
  // Vulnerable password change prompt
  'password.security.nudge.title': {
    id: 'password.security.nudge.title',
    defaultMessage: 'Password security',
    description: 'Title for prompt that nudges user to change their vulnerable password',
  },
  'password.security.block.title': {
    id: 'password.security.block.title',
    defaultMessage: 'Password change required',
    description: 'Title for prompt that asks user to change their vulnerable password',
  },
  'password.security.nudge.body': {
    id: 'password.security.nudge.body',
    defaultMessage: 'Our system detected that your password is vulnerable. '
                    + 'We recommend you change it so that your account stays secure.',
    description: 'Message copy for prompt that nudges user to change their vulnerable password',
  },
  'password.security.block.body': {
    id: 'password.security.block.body',
    defaultMessage: 'Our system detected that your password is vulnerable. '
                    + 'Change your password so that your account stays secure.',
    description: 'Message copy for prompt that asks user to change their vulnerable password',
  },
  'password.security.close.button': {
    id: 'password.security.close.button',
    defaultMessage: 'Close',
    description: 'Button to close popup',
  },
  'password.security.redirect.to.reset.password.button': {
    id: 'password.security.redirect.to.reset.password.button',
    defaultMessage: 'Reset your password',
    description: 'Button to redirect users to Reset Password page',
  },
  'login.tpa.authentication.failure': {
    id: 'login.tpa.authentication.failure',
    defaultMessage: 'We are sorry, you are not authorized to access {platform_name} via this channel. '
        + 'Please contact your learning administrator or manager in order to access {platform_name}.'
        + '{lineBreak}{lineBreak}Error Details:{lineBreak}{errorMessage}',
    description: 'Error message third party authentication pipeline fails',
  },

  // Tab titles
  'login.tab.username': {
    id: 'login.tab.username',
    defaultMessage: 'Email',
    description: 'Title of the traditional username or email + password login tab',
  },
  'login.tab.otp': {
    id: 'login.tab.otp',
    defaultMessage: 'Mobile',
    description: 'Title of the phone number + OTP login tab',
  },
  'login.tab.google': {
    id: 'login.tab.google',
    defaultMessage: 'Google',
    description: 'Title of the Google / social login tab',
  },

  // OTP Login Tab - fields, buttons, states
  'login.otp.phone.label': {
    id: 'login.otp.phone.label',
    defaultMessage: 'Phone Number',
    description: 'Label for phone number input in OTP login tab',
  },
  'login.otp.phone.placeholder': {
    id: 'login.otp.phone.placeholder',
    defaultMessage: '+91 9876543210',
    description: 'Placeholder text for mobile number input in OTP login',
  },
  'login.otp.send.button': {
    id: 'login.otp.send.button',
    defaultMessage: 'Send OTP',
    description: 'Button label to request OTP for login',
  },
  'login.otp.resend.button': {
    id: 'login.otp.resend.button',
    defaultMessage: 'Resend OTP',
    description: 'Button label to resend OTP',
  },
  'login.otp.resend.countdown': {
    id: 'login.otp.resend.countdown',
    defaultMessage: 'Resend in {seconds}s',
    description: 'Resend button text with countdown timer',
  },
  'login.otp.enter.label': {
    id: 'login.otp.enter.label',
    defaultMessage: 'Enter OTP',
    description: 'Label above the OTP code input field',
  },
  'login.otp.placeholder': {
    id: 'login.otp.placeholder',
    defaultMessage: 'Enter 6-digit code',
    description: 'Placeholder for OTP input field',
  },
  'login.otp.verify.button': {
    id: 'login.otp.verify.button',
    defaultMessage: 'Verify & Sign In',
    description: 'Button to verify OTP and complete login',
  },
  'login.otp.sending': {
    id: 'login.otp.sending',
    defaultMessage: 'Sending...',
    description: 'Loading state while sending OTP',
  },
  'login.otp.resending': {
    id: 'login.otp.resending',
    defaultMessage: 'Resending...',
    description: 'Loading state while resending OTP',
  },
  'login.otp.verifying': {
    id: 'login.otp.verifying',
    defaultMessage: 'Verifying...',
    description: 'Loading state while verifying OTP',
  },
  'login.otp.required': {
    id: 'login.otp.required',
    defaultMessage: 'Please enter the OTP code',
    description: 'Error when OTP field is empty',
  },
  'login.otp.invalid': {
    id: 'login.otp.invalid',
    defaultMessage: 'Invalid OTP. Please check and try again.',
    description: 'Error when OTP verification fails',
  },
  'login.otp.expired': {
    id: 'login.otp.expired',
    defaultMessage: 'This OTP has expired. Please request a new one.',
    description: 'Message when OTP is no longer valid',
  },
  'login.otp.phone.required': {
    id: 'login.otp.phone.required',
    defaultMessage: 'Please enter your phone number',
    description: 'Error when phone number is empty before sending OTP',
  },
  'login.otp.success': {
    id: 'login.otp.success',
    defaultMessage: 'Login successful!',
    description: 'Success message after OTP verification (optional - can be short-lived)',
  },

  // Google Login Tab
  'login.google.button': {
    id: 'login.google.button',
    defaultMessage: 'Sign in with Google',
    description: 'Button label for Google OAuth login',
  },
  'login.google.not.configured': {
    id: 'login.google.not.configured',
    defaultMessage: 'Google sign-in is not available right now.',
    description: 'Message shown when Google provider is not configured/enabled',
  },

  // General / shared login messages (improvements & fallbacks)
  'login.network.error': {
    id: 'login.network.error',
    defaultMessage: 'Please check your internet connection and try again.',
    description: 'Generic network failure message for OTP / any API call',
  },
  'login.phone.invalid.format': {
    id: 'login.phone.invalid.format',
    defaultMessage: 'Please enter a valid phone number (e.g. +919876543210)',
    description: 'Client-side validation error for phone format (optional)',
  },
  'login.otp.phone.required': {
    id: 'login.otp.phone.required',
    defaultMessage: 'Please enter your phone number',
    description: 'Error when phone number is empty before sending OTP',
  },
  'login.otp.phone.invalid': {
    id: 'login.otp.phone.invalid',
    defaultMessage: 'Please enter a valid phone number',
    description: 'Client-side validation for phone number format',
  },
  'login.otp.code.required': {
    id: 'login.otp.code.required',
    defaultMessage: 'Please enter the OTP code',
    description: 'Error when OTP input is empty',
  },
  'login.otp.code.invalid': {
    id: 'login.otp.code.invalid',
    defaultMessage: 'Invalid OTP code. Please try again.',
    description: 'Shown when backend returns invalid OTP',
  },

  // General OTP flow messages (keep in alert style)
  'login.otp.network.error': {
    id: 'login.otp.network.error',
    defaultMessage: 'Network error. Please try again later.',
    description: 'Generic network failure during OTP flow',
  },
  'login.otp.send.failed': {
    id: 'login.otp.send.failed',
    defaultMessage: 'Failed to send OTP. Please try again.',
    description: 'Generic failure message when sending OTP',
  },
  'login.otp.sent.success': {
    id: 'login.otp.sent.success',
    defaultMessage: 'OTP sent successfully!',
    description: 'Success message when OTP is sent',
  },
  'login.otp.resend.failed': {
    id: 'login.otp.resend.failed',
    defaultMessage: 'Failed to resend OTP. Please try again.',
    description: 'Generic failure message when resending OTP',
  },
   'login.otp.resent.success': {
    id: 'login.otp.resent.success',
    defaultMessage: 'OTP resent successfully!',
    description: 'Success message when OTP is resent',
  },
  'login.otp.session.expired': {
    id: 'login.otp.session.expired',
    defaultMessage: 'Your session has expired. Please request a new OTP.',
    description: 'Message shown when session expires during OTP flow',
  },
  'login.failed.after.verification': {
    id: 'login.failed.after.verification',
    defaultMessage: 'Login failed after verification. Please try again.',
    description: 'Message shown when login fails after OTP verification',
  },
  // handle expired activation links by resending and showing message
  'account.activation.expired.message': {
    id: 'account.activation.expired.message',
    defaultMessage: 'Your activation link expired. A new activation email has been sent. Please check your inbox.',
    description: 'Account activation expired message',
  },  
});

export default messages;
