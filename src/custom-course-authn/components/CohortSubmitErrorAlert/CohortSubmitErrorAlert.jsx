import PropTypes from 'prop-types';
import React from 'react';

import { Alert } from '@openedx/paragon';
import { Error } from '@openedx/paragon/icons';

const CohortSubmitErrorAlert = ({ message }) => {
  if (!message?.trim()) {
    return null;
  }

  return (
    <Alert id="cohort-submit-error" className="mb-5" variant="danger" icon={Error}>
      <p className="mb-0">{message}</p>
    </Alert>
  );
};

CohortSubmitErrorAlert.propTypes = {
  message: PropTypes.string,
};

CohortSubmitErrorAlert.defaultProps = {
  message: '',
};

export default CohortSubmitErrorAlert;
