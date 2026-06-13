import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import {
  EmbeddedRegistrationRoute, NotFoundPage, registerIcons, UnAuthOnlyRoute, Zendesk,
} from './common-components';
import {
  COHORT_FORM_SUBMITTED_PAGE,
  COHORT_GOOGLE_CALLBACK_PAGE,
  COHORT_REGISTER_PAGE,
  COHORT_REGISTRATION_SUCCESS_PAGE,
  COHORT_SET_PASSWORD_PAGE,
  COHORT_VERIFY_EMAIL_PAGE,
} from './custom-course-authn/data/constants';
import CohortFormSubmittedPage from './custom-course-authn/pages/CohortFormSubmittedPage/CohortFormSubmittedPage';
import CohortGoogleCallbackPage from './custom-course-authn/pages/CohortGoogleCallbackPage/CohortGoogleCallbackPage';
import CohortRegisterPage from './custom-course-authn/pages/CohortRegisterPage/CohortRegisterPage';
import CohortRegistrationSuccessPage from './custom-course-authn/pages/CohortRegistrationSuccessPage/CohortRegistrationSuccessPage';
import CohortSetPasswordPage from './custom-course-authn/pages/CohortSetPasswordPage/CohortSetPasswordPage';
import CohortVerifyEmailPage from './custom-course-authn/pages/CohortVerifyEmailPage/CohortVerifyEmailPage';
import {
  AUTHN_PROGRESSIVE_PROFILING,
  LOGIN_PAGE,
  PAGE_NOT_FOUND,
  PASSWORD_RESET_CONFIRM,
  RECOMMENDATIONS,
  REGISTER_EMBEDDED_PAGE,
  REGISTER_PAGE,
  RESET_PAGE,
} from './data/constants';
import { updatePathWithQueryParams } from './data/utils';
import  CustomForgotPasswordPage  from './forgot-password/CustomForgotPasswordPage';
import CustomLogistration from './logistration/CustomLogistration';
import { ProgressiveProfiling } from './progressive-profiling';
import { RecommendationsPage } from './recommendations';
import { RegistrationPage } from './register';
import CustomResetPasswordPage from './reset-password/CustomResetPasswordPage';

import './index.scss';
import './override-styles.scss';

registerIcons();

const CustomMainAppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate replace to={updatePathWithQueryParams(REGISTER_PAGE)} />} />
    <Route
      path={REGISTER_EMBEDDED_PAGE}
      element={<EmbeddedRegistrationRoute><RegistrationPage /></EmbeddedRegistrationRoute>}
    />
    <Route
      path={LOGIN_PAGE}
      element={
        <UnAuthOnlyRoute><CustomLogistration selectedPage={LOGIN_PAGE} /></UnAuthOnlyRoute>
      }
    />
    <Route path={REGISTER_PAGE} element={<UnAuthOnlyRoute><CustomLogistration /></UnAuthOnlyRoute>} />
    <Route path={RESET_PAGE} element={<UnAuthOnlyRoute><CustomForgotPasswordPage /></UnAuthOnlyRoute>} />
    <Route path={PASSWORD_RESET_CONFIRM} element={<CustomResetPasswordPage />} />
    <Route path={AUTHN_PROGRESSIVE_PROFILING} element={<ProgressiveProfiling />} />
    <Route path={RECOMMENDATIONS} element={<RecommendationsPage />} />
    <Route path={COHORT_VERIFY_EMAIL_PAGE} element={<CohortVerifyEmailPage />} />
    <Route path={COHORT_REGISTRATION_SUCCESS_PAGE} element={<CohortRegistrationSuccessPage />} />
    <Route path={COHORT_SET_PASSWORD_PAGE} element={<CohortSetPasswordPage />} />
    <Route path={COHORT_GOOGLE_CALLBACK_PAGE} element={<CohortGoogleCallbackPage />} />
    <Route path={COHORT_FORM_SUBMITTED_PAGE} element={<CohortFormSubmittedPage />} />
    <Route path={COHORT_REGISTER_PAGE} element={<CohortRegisterPage />} />
    <Route path={PAGE_NOT_FOUND} element={<NotFoundPage />} />
    <Route path="*" element={<Navigate replace to={PAGE_NOT_FOUND} />} />
  </Routes>
);

export default CustomMainAppRoutes;
