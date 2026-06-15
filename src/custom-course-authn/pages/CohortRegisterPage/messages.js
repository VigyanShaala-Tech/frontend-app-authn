import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  back: {
    id: 'custom.course.authn.page.back',
    defaultMessage: 'Back',
    description: 'Back button label on cohort registration steps',
  },
  next: {
    id: 'custom.course.authn.page.next',
    defaultMessage: 'Next',
    description: 'Next button label',
  },
  submit: {
    id: 'custom.course.authn.page.submit',
    defaultMessage: 'Submit Registration',
    description: 'Submit button on final step',
  },
  loading: {
    id: 'custom.course.authn.page.loading',
    defaultMessage: 'Loading registration form...',
    description: 'Loading state while fetching form config',
  },
  loadError: {
    id: 'custom.course.authn.page.load.error',
    defaultMessage: 'Unable to load registration form. Please try again later.',
    description: 'Error when form config fails to load',
  },
  submitting: {
    id: 'custom.course.authn.page.submitting',
    defaultMessage: 'Submitting...',
    description: 'Submit in progress label',
  },
  emailLabel: {
    id: 'custom.course.authn.page.email.label',
    defaultMessage: 'Email:',
    description: 'Email label on personal info step',
  },
});

export default messages;
