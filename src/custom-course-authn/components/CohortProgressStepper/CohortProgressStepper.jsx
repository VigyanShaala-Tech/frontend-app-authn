import React from 'react';

import PropTypes from 'prop-types';

import './cohort-progress-stepper.scss';

const CohortProgressStepper = ({ steps, currentStepIndex }) => (
  <div className="cohort-progress-stepper">
    {steps.map((step, index) => {
      const stepNumber = index + 1;
      const isActive = currentStepIndex === index;
      const isDone = currentStepIndex > index;
      const label = step.title;

      return (
        <div key={step.id} className="cohort-progress-stepper__item">
          <div
            className={[
              'cohort-progress-stepper__circle',
              isDone && 'cohort-progress-stepper__circle--done',
              isActive && 'cohort-progress-stepper__circle--active',
            ].filter(Boolean).join(' ')}
          >
            {isDone ? '✓' : stepNumber}
          </div>
          <div
            className={[
              'cohort-progress-stepper__label',
              (isActive || isDone) && 'cohort-progress-stepper__label--active',
            ].filter(Boolean).join(' ')}
            title={label}
          >
            {label}
          </div>
          {index < steps.length - 1 && (
            <div
              className={[
                'cohort-progress-stepper__line',
                isDone && 'cohort-progress-stepper__line--done',
              ].filter(Boolean).join(' ')}
            />
          )}
        </div>
      );
    })}
  </div>
);

CohortProgressStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
  })).isRequired,
  currentStepIndex: PropTypes.number.isRequired,
};

export default CohortProgressStepper;
