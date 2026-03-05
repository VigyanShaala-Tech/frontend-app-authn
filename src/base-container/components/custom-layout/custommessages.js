import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // Registration / Sign-up section
  'register.start.journey': {
    id: 'register.start.journey',
    defaultMessage: 'Start Your Journey!',
    description: 'Header text for registration page',
  },
  'register.paragraph': {
    id: 'register.paragraph',
    defaultMessage: 'Join thousands of learners and unlock your potential with our expert-led courses.',
    description: 'Descriptive paragraph for registration page',
  },
  'register.benefit.access_courses': {
    id: 'register.benefit.access_courses',
    defaultMessage: 'Access to 500+ courses',
    description: 'Benefit list item - course access',
  },
  'register.benefit.learn_experts': {
    id: 'register.benefit.learn_experts',
    defaultMessage: 'Learn from industry experts',
    description: 'Benefit list item - expert instructors',
  },
  'register.benefit.get_certified': {
    id: 'register.benefit.get_certified',
    defaultMessage: 'Get certified',
    description: 'Benefit list item - certification',
  },
  'register.benefit.join_community': {
    id: 'register.benefit.join_community',
    defaultMessage: 'Join our community',
    description: 'Benefit list item - community',
  },

  // Login / Welcome back section
  'login.welcome_back': {
    id: 'login.welcome_back',
    defaultMessage: 'Welcome Back!',
    description: 'Header text for login page',
  },
  'login.paragraph': {
    id: 'login.paragraph',
    defaultMessage: 'Sign in to continue your learning journey and access your courses.',
    description: 'Descriptive paragraph for login page',
  },
  'login.join_learners': {
    id: 'login.join_learners',
    defaultMessage: 'Join {count}+ learners',
    description: 'Text showing number of learners with avatars (use {count} placeholder)',
  },

  // Forgot password section
  'forgot_password.header': {
    id: 'forgot_password.header',
    defaultMessage: 'Reset Your Password',
    description: 'Header text for forgot password page',
  },
  'forgot_password.paragraph': {
    id: 'forgot_password.paragraph',
    defaultMessage: "Don't worry, it happens to the best of us. Enter your email and we'll send you instructions to reset your password.",
    description: 'Descriptive paragraph for forgot password page',
  },
  'forgot_password.check_inbox': {
    id: 'forgot_password.check_inbox',
    defaultMessage: 'Check your inbox for reset link',
    description: 'Benefit-style text next to envelope icon in forgot password section',
  },

  // Avatar alt text (recommended to translate for accessibility)
  'avatar.alt': {
    id: 'avatar.alt',
    defaultMessage: 'Happy learner',
    description: 'Generic alt text for learner avatar images (screen readers)',
  },
});

export default messages;