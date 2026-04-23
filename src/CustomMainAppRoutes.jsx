import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import {
  EmbeddedRegistrationRoute, NotFoundPage, registerIcons, UnAuthOnlyRoute, Zendesk,
} from './common-components';
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
import { ResetPasswordPage } from './reset-password';

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
    <Route path={PASSWORD_RESET_CONFIRM} element={<ResetPasswordPage />} />
    <Route path={AUTHN_PROGRESSIVE_PROFILING} element={<ProgressiveProfiling />} />
    <Route path={RECOMMENDATIONS} element={<RecommendationsPage />} />
    <Route path={PAGE_NOT_FOUND} element={<NotFoundPage />} />
    <Route path="*" element={<Navigate replace to={PAGE_NOT_FOUND} />} />
  </Routes>
)

export default CustomMainAppRoutes;
