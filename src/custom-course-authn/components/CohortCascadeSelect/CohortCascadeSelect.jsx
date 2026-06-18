import React from 'react';

import PropTypes from 'prop-types';

import {
  buildInitialCascadeValue,
  cascadeLevelHasOtherOption,
  getCascadeLevelValidationKey,
  getCascadeLevels,
  getCascadeOptionsAtLevel,
  getCascadeOtherLevelIndex,
  isCascadeLevelReady,
  isCascadeLevelUnlocked,
  isCascadeOtherValue,
  updateCascadeOtherInput,
  updateCascadeSelection,
} from '../../utils/cascadeSelectUtils';
import CustomSearchDropdown from '../CustomSearchDropdown/CustomSearchDropdown';

import './cohort-cascade-select.scss';

const CohortCascadeSelect = ({
  field,
  value,
  fieldErrors,
  validationStatus,
  isInvalid,
  onChange,
  onLevelValidate,
}) => {
  const levels = getCascadeLevels(field);

  if (!levels.length) {
    return null;
  }

  const selections = value && typeof value === 'object'
    ? value
    : buildInitialCascadeValue(levels);
  const otherIndex = getCascadeOtherLevelIndex(levels, selections);

  const getLevelError = (levelKey) => (
    fieldErrors[getCascadeLevelValidationKey(field.name, levelKey)]
    || (levelKey === levels[0]?.key ? fieldErrors[field.name] : '')
  );

  const getLevelValidating = (levelKey) => (
    validationStatus[getCascadeLevelValidationKey(field.name, levelKey)]?.loading
    || (levelKey === levels[0]?.key && validationStatus[field.name]?.loading)
  );

  const handleLevelChange = (level, levelIndex, selectedValue) => {
    const nextValue = updateCascadeSelection(levels, selections, levelIndex, selectedValue);
    onChange(field.name, nextValue);

    if (field.isEligibilityField && levelIndex === 0 && !isCascadeOtherValue(selectedValue)) {
      onLevelValidate(field, nextValue, level.key);
    }
  };

  const handleOtherInputChange = (levelKey, text) => {
    onChange(field.name, updateCascadeOtherInput(levels, selections, levelKey, text));
  };

  const renderLevelDropdown = (level, levelIndex) => {
    const levelKey = level.key;
    const options = getCascadeOptionsAtLevel(field, levels, selections, levelIndex);
    const isDisabled = !isCascadeLevelReady(levels, selections, levelIndex);
    const selectedValue = selections[levelKey] || '';
    const levelError = getLevelError(levelKey);
    const isLevelInvalid = isInvalid || !!levelError;

    return (
      <div key={levelKey} className="cohort-cascade-select__level">
        <label className="cohort-cascade-select__level-label" htmlFor={`${field.name}-${levelKey}`}>
          {level.label}
        </label>
        <div className={isDisabled ? 'cohort-cascade-select__dropdown-disabled' : ''}>
          <CustomSearchDropdown
            id={`${field.name}-${levelKey}`}
            options={isDisabled ? [] : options}
            value={selectedValue}
            placeholder={level.placeholder || `Select ${level.label?.toLowerCase() || 'option'}`}
            isInvalid={isLevelInvalid}
            onChange={(selected) => handleLevelChange(level, levelIndex, selected)}
          />
        </div>
        {getLevelValidating(levelKey) && (
          <p className="form-text text-muted mb-0">Validating...</p>
        )}
        {levelError && <p className="form-text text-danger mb-0">{levelError}</p>}
      </div>
    );
  };

  const renderOtherInputs = (fromIndex) => (
    <div className="cohort-cascade-select__other-group">
      {levels.slice(fromIndex).map((level) => {
        const otherKey = `${level.key}_other`;
        const levelError = getLevelError(level.key);
        return (
          <div key={otherKey} className="cohort-cascade-select__level">
            <label className="cohort-cascade-select__level-label" htmlFor={`${field.name}-${otherKey}`}>
              {level.label}
            </label>
            <input
              id={`${field.name}-${otherKey}`}
              type="text"
              className={`form-control ${levelError || isInvalid ? 'is-invalid' : ''}`}
              placeholder={`Enter ${level.label?.toLowerCase() || 'value'}`}
              value={selections[otherKey] || ''}
              onChange={(event) => handleOtherInputChange(level.key, event.target.value)}
            />
            {levelError && <p className="form-text text-danger mb-0">{levelError}</p>}
          </div>
        );
      })}
    </div>
  );

  const renderedLevels = [];

  levels.forEach((level, levelIndex) => {
    if (!isCascadeLevelUnlocked(field, levels, selections, levelIndex, validationStatus)) {
      return;
    }

    if (otherIndex !== null) {
      if (levelIndex < otherIndex) {
        if (levelIndex === 0 || isCascadeLevelReady(levels, selections, levelIndex)) {
          renderedLevels.push(renderLevelDropdown(level, levelIndex));
        }
      } else if (levelIndex === otherIndex) {
        renderedLevels.push(renderLevelDropdown(level, levelIndex));
      }
      return;
    }

    if (!isCascadeLevelReady(levels, selections, levelIndex)) {
      return;
    }

    const options = getCascadeOptionsAtLevel(field, levels, selections, levelIndex);
    if (!options.length && levelIndex > 0) {
      return;
    }

    renderedLevels.push(renderLevelDropdown(level, levelIndex));
  });

  if (
    otherIndex !== null
    && cascadeLevelHasOtherOption(field, levels, selections, otherIndex)
    && isCascadeLevelUnlocked(field, levels, selections, otherIndex, validationStatus)
  ) {
    renderedLevels.push(
      <React.Fragment key={`${field.name}-other-inputs`}>
        {renderOtherInputs(otherIndex)}
      </React.Fragment>,
    );
  }

  return (
    <div className="cohort-cascade-select">
      {renderedLevels}
    </div>
  );
};

CohortCascadeSelect.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    isEligibilityField: PropTypes.bool,
    subject_area: PropTypes.arrayOf(PropTypes.shape({})),
    country: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  value: PropTypes.shape({}),
  fieldErrors: PropTypes.objectOf(PropTypes.string),
  validationStatus: PropTypes.objectOf(PropTypes.shape({
    valid: PropTypes.bool,
    message: PropTypes.string,
    loading: PropTypes.bool,
  })),
  isInvalid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onLevelValidate: PropTypes.func.isRequired,
};

CohortCascadeSelect.defaultProps = {
  value: null,
  fieldErrors: {},
  validationStatus: {},
  isInvalid: false,
};

export default CohortCascadeSelect;
