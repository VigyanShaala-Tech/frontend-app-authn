import React from 'react';

import { Spinner } from '@openedx/paragon';

const CohortLoadingSpinner = () => (
  <div className="cohort-loading-spinner">
    <Spinner animation="border" variant="primary" className="spinner--position-centered" />
  </div>
);

export default CohortLoadingSpinner;
