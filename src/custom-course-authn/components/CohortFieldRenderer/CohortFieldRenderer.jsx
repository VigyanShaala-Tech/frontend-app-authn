import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import {
  fieldHasOtherOption,
  getDependentOptions,
  getFieldOptions,
  isFieldShown,
  isOtherSelected,
} from '../../utils/fieldUtils';
import { getHtmlInputType } from '../../utils/inputFieldTypes';
import CohortCascadeSelect from '../CohortCascadeSelect/CohortCascadeSelect';
import CustomSearchDropdown from '../CustomSearchDropdown/CustomSearchDropdown';

import './cohort-field-renderer.scss';

const CohortImagePreview = ({ file, alt }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl) {
    return null;
  }

  return (
    <img
      src={previewUrl}
      alt={alt}
      className="cohort-field__image-preview mt-2"
    />
  );
};

CohortImagePreview.propTypes = {
  file: PropTypes.instanceOf(File),
  alt: PropTypes.string,
};

CohortImagePreview.defaultProps = {
  file: null,
  alt: '',
};

const CohortFieldRenderer = ({
  field,
  allFields,
  formValues,
  fieldErrors,
  validationStatus,
  onChange,
  onBlur,
}) => {
  if (field.type === 'hidden') {
    if (field.hiddenMessage) {
      return (
        <div className="cohort-field cohort-field--hidden border rounded p-3 mb-3">
          <p className="text-muted small mb-0">{field.hiddenMessage}</p>
        </div>
      );
    }
    if (field.type === 'hidden') {
      return (
        <input
          type="hidden"
          name={field.name}
          value={formValues[field.name] ?? ''}
          readOnly
        />
      );
    }
    return null;
  }

  if (!isFieldShown(field, formValues)) {
    return null;
  }

  const isValidating = validationStatus[field.name]?.loading;
  const error = fieldErrors[field.name]
    || (
      !isValidating && validationStatus[field.name]?.valid === false
        ? validationStatus[field.name].message
        : ''
    );

  const handleChange = (name, value, shouldValidate = false) => {
    onChange(name, value);
    if (shouldValidate) {
      onBlur(field, value);
    }
  };

  const parentField = field.dependsOn
    ? allFields.find((item) => item.name === field.dependsOn)
    : null;

  const buildSelectOptions = () => (
    field.dependsOn
      ? getDependentOptions(field, formValues, parentField)
      : getFieldOptions(field)
  );

  const renderNativeInput = (inputType) => {
    const value = formValues[field.name] ?? '';
    const validation = field.validation || {};

    return (
      <input
        id={field.name}
        type={inputType}
        className={`form-control ${error ? 'is-invalid' : ''} ${inputType === 'color' ? 'cohort-field__color-input' : ''} ${inputType === 'range' ? 'cohort-field__range-input' : ''}`}
        value={value}
        placeholder={field.placeholder || ''}
        disabled={field.disabled}
        min={validation.min}
        max={validation.max}
        step={validation.step}
        minLength={validation.minLength}
        maxLength={validation.maxLength}
        onChange={(event) => handleChange(field.name, event.target.value)}
        onBlur={() => onBlur(field)}
      />
    );
  };

  const renderInput = () => {
    const value = formValues[field.name] ?? '';

    switch (field.type) {
      case 'radio': {
        const options = getFieldOptions(field);
        return (
          <div className="cohort-field__radio-group" role="radiogroup">
            {options.map((opt) => (
              <div key={opt.id || opt.value} className="form-check form-check-inline cohort-field__radio-option">
                <input
                  id={`${field.name}-${opt.value}`}
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(field.name, opt.value, field.isEligibilityField)}
                  onBlur={() => onBlur(field)}
                  className="form-check-input"
                />
                <label className="form-check-label small" htmlFor={`${field.name}-${opt.value}`}>
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
        );
      }

      case 'checkbox': {
        const isChecked = value === true || value === 'true' || value === 'Yes' || value === field.checkedValue;
        return (
          <div className="form-check cohort-field__checkbox-single">
            <input
              id={field.name}
              type="checkbox"
              className="form-check-input"
              checked={isChecked}
              onChange={(event) => handleChange(field.name, event.target.checked)}
              onBlur={() => onBlur(field)}
            />
            <label
              className="form-check-label small"
              htmlFor={field.name}
              title={field.checkboxLabel || field.label}
            >
              {field.checkboxLabel || field.label}
            </label>
          </div>
        );
      }

      case 'select': {
        const options = buildSelectOptions();
        const showOtherInput = fieldHasOtherOption(field) && isOtherSelected(field, value);
        const isDisabled = field.disabled || (field.dependsOn && !formValues[field.dependsOn]);

        return (
          <>
            <div className={isDisabled ? 'cohort-field__dropdown-disabled' : ''}>
              <CustomSearchDropdown
                id={field.name}
                options={isDisabled ? [] : options}
                value={value}
                placeholder={field.placeholder}
                isInvalid={!!error}
                onChange={(selected) => handleChange(
                  field.name,
                  selected,
                  field.isEligibilityField,
                )}
              />
            </div>
            {showOtherInput && (
              <input
                type="text"
                className="form-control mt-2"
                placeholder={`Enter ${field.label?.toLowerCase() || 'value'}`}
                value={formValues[`${field.name}_other`] || ''}
                onChange={(e) => onChange(`${field.name}_other`, e.target.value)}
                onBlur={() => onBlur(field)}
              />
            )}
          </>
        );
      }

      case 'cascade_select':
        return (
          <CohortCascadeSelect
            field={field}
            value={formValues[field.name]}
            fieldErrors={fieldErrors}
            validationStatus={validationStatus}
            isInvalid={!!error}
            onChange={onChange}
            onLevelValidate={onBlur}
          />
        );

      case 'multiselect':
        return (
          <CustomSearchDropdown
            id={field.name}
            options={getFieldOptions(field)}
            value={Array.isArray(value) ? value : []}
            multiple
            isInvalid={!!error}
            placeholder={field.placeholder}
            onChange={(vals) => handleChange(field.name, vals)}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.name}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            rows={field.rows || 3}
            value={value}
            placeholder={field.placeholder || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onBlur={() => onBlur(field)}
          />
        );

      case 'file':
      case 'image': {
        const fileValue = value instanceof File ? value : null;

        return (
          <>
            <input
              id={field.name}
              type="file"
              className={`form-control ${error ? 'is-invalid' : ''}`}
              onChange={(event) => handleChange(field.name, event.target.files?.[0] || null)}
              onBlur={() => onBlur(field)}
            />
            {fileValue?.name && (
              <p className="form-text text-muted mb-0 mt-1">
                Selected:
                {' '}
                {fileValue.name}
              </p>
            )}
            {field.type === 'image' && fileValue && (
              <CohortImagePreview file={fileValue} alt={field.label} />
            )}
          </>
        );
      }

      case 'range': {
        const rangeValue = value !== '' && value !== null && value !== undefined
          ? value
          : String(field.validation?.min ?? 50);

        return (
          <div className="cohort-field__range-wrap">
            <input
              id={field.name}
              type="range"
              className={`form-range cohort-field__range-input ${error ? 'is-invalid' : ''}`}
              value={rangeValue}
              min={field.validation?.min ?? 0}
              max={field.validation?.max ?? 100}
              step={field.validation?.step ?? 1}
              onChange={(event) => handleChange(field.name, event.target.value)}
              onBlur={() => onBlur(field)}
            />
            <span className="cohort-field__range-value">{rangeValue}</span>
          </div>
        );
      }

      case 'color':
        return (
          <div className="cohort-field__color-wrap">
            {renderNativeInput('color')}
            <span className="cohort-field__color-value">{value || field.defaultValue || '#69ab4a'}</span>
          </div>
        );

      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
      case 'telephone':
      case 'url':
      case 'search':
      case 'date':
      case 'time':
      case 'datetime':
      case 'datetime-local':
      case 'month':
      case 'week':
        return renderNativeInput(getHtmlInputType(field.type));

      default:
        return renderNativeInput('text');
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="pgn__form-group cohort-field mb-3">
        {field.helper && <p className="form-text text-muted mb-2">{field.helper}</p>}
        {renderInput()}
        {isValidating && <p className="form-text text-muted mb-0">Validating...</p>}
        {error && <p className="form-text text-danger mb-0">{error}</p>}
      </div>
    );
  }

  return (
    <div className="pgn__form-group cohort-field mb-3">
      <label className="pgn__form-label fw-medium mb-2" htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>
      {field.helper && <p className="form-text text-muted mb-2">{field.helper}</p>}
      {renderInput()}
      {isValidating && <p className="form-text text-muted mb-0">Validating...</p>}
      {error && <p className="form-text text-danger mb-0">{error}</p>}
    </div>
  );
};

CohortFieldRenderer.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    helper: PropTypes.string,
    hiddenMessage: PropTypes.string,
    visible: PropTypes.bool,
    disabled: PropTypes.bool,
    dependsOn: PropTypes.string,
    rows: PropTypes.number,
    checkboxLabel: PropTypes.string,
    checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    validation: PropTypes.shape({
      minLength: PropTypes.number,
      maxLength: PropTypes.number,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
    }),
    isEligibilityField: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    optionsByParent: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
    }))),
    country: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  allFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })),
  formValues: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.instanceOf(File),
    PropTypes.object,
  ])).isRequired,
  fieldErrors: PropTypes.objectOf(PropTypes.string).isRequired,
  validationStatus: PropTypes.objectOf(PropTypes.shape({
    valid: PropTypes.bool,
    message: PropTypes.string,
    loading: PropTypes.bool,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

CohortFieldRenderer.defaultProps = {
  allFields: [],
};

export default CohortFieldRenderer;
