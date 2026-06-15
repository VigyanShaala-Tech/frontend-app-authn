import React, { useEffect, useState } from 'react';

import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import PropTypes from 'prop-types';

import CohortLoadingSpinner from '../CohortLoadingSpinner/CohortLoadingSpinner';
import { redirectToCohortDashboard } from '../../utils/cohortAuthRedirect';
import { clearAllCohortRegistrationSessions } from '../../utils/cohortSessionCleanup';

/**
 * Blocks authenticated users from cohort registration steps (same idea as UnAuthOnlyRoute).
 * Set allowAuthenticated for the success page after password login.
 */
const CohortUnAuthOnlyRoute = ({ children, allowAuthenticated }) => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchAuthenticatedUser({ forceRefresh: !!getAuthenticatedUser() }).then((authenticatedUser) => {
      setIsAuthenticated(Boolean(authenticatedUser?.username));
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <CohortLoadingSpinner />;
  }

  if (!allowAuthenticated && isAuthenticated) {
    clearAllCohortRegistrationSessions();
    redirectToCohortDashboard();
    return null;
  }

  return children;
};

CohortUnAuthOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowAuthenticated: PropTypes.bool,
};

CohortUnAuthOnlyRoute.defaultProps = {
  allowAuthenticated: false,
};

export default CohortUnAuthOnlyRoute;
