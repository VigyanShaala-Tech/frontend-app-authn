import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  eligibleTitle: {
    id: 'custom.course.authn.success.eligible.title',
    defaultMessage: "Congratulations! You're eligible.",
    description: 'Title shown when user is eligible after cohort registration submit',
  },
  eligibleSubtitle: {
    id: 'custom.course.authn.success.eligible.subtitle',
    defaultMessage: "Choose how you'd like to complete your registration.",
    description: 'Subtitle shown when user is eligible',
  },
  signUpGoogle: {
    id: 'custom.course.authn.success.signup.google',
    defaultMessage: 'Sign up with Google',
    description: 'Google signup button label',
  },
  signUpEmail: {
    id: 'custom.course.authn.success.signup.email',
    defaultMessage: 'Sign up via Email',
    description: 'Email signup button label',
  },
  signupLoading: {
    id: 'custom.course.authn.success.signup.loading',
    defaultMessage: 'Please wait...',
    description: 'Loading label while signup request is in progress',
  },
  emailSentTitle: {
    id: 'custom.course.authn.success.email.sent.title',
    defaultMessage: 'Check your inbox',
    description: 'Title on email verification sent screen',
  },
  emailSentIntro: {
    id: 'custom.course.authn.success.email.sent.intro',
    defaultMessage: "We've sent a verification link to",
    description: 'Intro text before user email on verification sent screen',
  },
  emailSentFallbackEmail: {
    id: 'custom.course.authn.success.email.sent.fallback',
    defaultMessage: 'your email',
    description: 'Fallback when email address is missing on verification sent screen',
  },
  emailSentInstructions: {
    id: 'custom.course.authn.success.email.sent.instructions',
    defaultMessage: 'Please open your email and click the link to verify and continue your registration.',
    description: 'Instructions on verification sent screen',
  },
  emailSentSpamHint: {
    id: 'custom.course.authn.success.email.sent.spam',
    defaultMessage: "Didn't receive it? Check your spam folder.",
    description: 'Spam folder hint on verification sent screen',
  },
  ineligibleTitle: {
    id: 'custom.course.authn.success.ineligible.title',
    defaultMessage: "Sorry, you're not eligible for this course",
    description: 'Title when user is not eligible',
  },
  browseCourses: {
    id: 'custom.course.authn.success.browse.courses',
    defaultMessage: 'Browse Other Courses',
    description: 'Link to browse other courses',
  },
  termsPrefix: {
    id: 'custom.course.authn.success.terms.prefix',
    defaultMessage: 'By registering, you agree to our',
    description: 'Terms prefix text',
  },
  termsLink: {
    id: 'custom.course.authn.success.terms.link',
    defaultMessage: 'Terms of Service',
    description: 'Terms link text',
  },
  termsAnd: {
    id: 'custom.course.authn.success.terms.and',
    defaultMessage: 'and',
    description: 'Terms and privacy conjunction',
  },
  privacyLink: {
    id: 'custom.course.authn.success.privacy.link',
    defaultMessage: 'Privacy Policy',
    description: 'Privacy policy link text',
  },
});

export default messages;
