import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'custom.course.authn.registration.success.title',
    defaultMessage: "You're all set!",
    description: 'Heading on cohort registration success page',
  },
  subtitle: {
    id: 'custom.course.authn.registration.success.subtitle',
    defaultMessage: "You've been successfully enrolled in the course.",
    description: 'Subtitle on cohort registration success page',
  },
  enrolledIn: {
    id: 'custom.course.authn.registration.success.enrolled.in',
    defaultMessage: 'Enrolled in',
    description: 'Label above course title on success card',
  },
  startDate: {
    id: 'custom.course.authn.registration.success.start.date',
    defaultMessage: 'Start Date:',
    description: 'Label before course start date',
  },
  emailConfirmation: {
    id: 'custom.course.authn.registration.success.email.confirmation',
    defaultMessage: 'A confirmation email has been sent to',
    description: 'Text before user email on success page',
  },
  dashboardHint: {
    id: 'custom.course.authn.registration.success.dashboard.hint',
    defaultMessage: 'You can now access your course from your dashboard.',
    description: 'Hint below confirmation email text',
  },
  goToDashboard: {
    id: 'custom.course.authn.registration.success.dashboard.button',
    defaultMessage: 'Go to Dashboard',
    description: 'Dashboard CTA button label',
  },
  downloadApp: {
    id: 'custom.course.authn.registration.success.download.app',
    defaultMessage: 'Download the App',
    description: 'App download CTA button label',
  },
  needHelp: {
    id: 'custom.course.authn.registration.success.need.help',
    defaultMessage: 'Need help? Contact us at',
    description: 'Support text prefix on success page',
  },
  missingData: {
    id: 'custom.course.authn.registration.success.missing.data',
    defaultMessage: 'Enrollment details are unavailable. Please return to the activation link from your email.',
    description: 'Error when success page is opened without enrollment data',
  },
});

export default messages;
