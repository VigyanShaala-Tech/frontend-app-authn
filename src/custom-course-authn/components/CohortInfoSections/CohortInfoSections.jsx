import PropTypes from 'prop-types';
import React from 'react';

import './cohort-info-sections.scss';

const CohortInfoSections = ({ html }) => {
  if (!html?.trim()) {
    return null;
  }

  return (
    <div
      className="cohort-info-sections"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

CohortInfoSections.propTypes = {
  html: PropTypes.string,
};

CohortInfoSections.defaultProps = {
  html: '',
};

export default CohortInfoSections;
