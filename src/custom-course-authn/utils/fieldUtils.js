import {
  buildCascadeSubmitValue,
  buildInitialCascadeValue,
  getCascadeLevels,
  isCascadeFieldFilled,
} from './cascadeSelectUtils';
import { isInputFieldType } from './inputFieldTypes';
import { OTHER_OPTION_VALUE } from '../data/constants';

export const normalizeOption = (option) => {
  if (typeof option === 'string') {
    const id = option.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    return { id, value: option, label: option };
  }
  return {
    id: option.id || option.value,
    value: option.value,
    label: option.label || option.value,
  };
};

export const getFieldOptions = (field) => (field.options || []).map(normalizeOption);

export const isOtherOption = (option) => {
  const normalized = normalizeOption(option);
  return normalized.value === OTHER_OPTION_VALUE || normalized.value === 'Other';
};

export const fieldHasOtherOption = (field) => getFieldOptions(field).some(isOtherOption);

export const isOtherSelected = (field, value) => {
  if (!value) {
    return false;
  }
  const match = getFieldOptions(field).find((opt) => opt.value === value);
  if (match) {
    return isOtherOption(match);
  }
  return value === OTHER_OPTION_VALUE || value === 'Other';
};

export const getParentLookupKey = (parentField, parentValue) => {
  if (!parentValue) {
    return null;
  }
  const option = getFieldOptions(parentField).find(
    (opt) => opt.value === parentValue || String(opt.id) === String(parentValue),
  );
  return option?.id ?? parentValue;
};

export const getDependentOptions = (field, formValues, parentField) => {
  if (!field.dependsOn || !field.optionsByParent) {
    return getFieldOptions(field);
  }
  const parentValue = formValues[field.dependsOn];
  if (!parentValue) {
    return [];
  }
  const key = parentField
    ? getParentLookupKey(parentField, parentValue)
    : parentValue;
  const options = field.optionsByParent[key]
    || field.optionsByParent[String(key)]
    || field.optionsByParent[parentValue]
    || [];
  return options.map(normalizeOption);
};

export const isFieldVisible = () => true;

export const isFieldShown = (field, formValues) => {
  if (field.type === 'hidden') {
    return false;
  }
  if (!field.dependsOn) {
    return true;
  }
  const parentValue = formValues[field.dependsOn];
  return Boolean(parentValue);
};

export const getInitialFieldValue = (field) => {
  if (field.type === 'cascade_select') {
    return buildInitialCascadeValue(getCascadeLevels(field));
  }
  if (field.type === 'multiselect') {
    return [];
  }
  if (field.type === 'checkbox') {
    return field.defaultValue ?? false;
  }
  if (field.type === 'file' || field.type === 'image') {
    return null;
  }
  if (field.type === 'range') {
    return field.defaultValue ?? String(field.validation?.min ?? 50);
  }
  if (field.type === 'color') {
    return field.defaultValue ?? '#69ab4a';
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }
  return '';
};

export const buildInitialFormValues = (steps) => {
  const values = {};
  steps.forEach((step) => {
    step.fields.forEach((field) => {
      values[field.name] = getInitialFieldValue(field);
      if (fieldHasOtherOption(field)) {
        values[`${field.name}_other`] = '';
      }
    });
  });
  return values;
};

export const getFieldDisplayValue = (field, formValues) => {
  const value = formValues[field.name];
  if (field.type === 'cascade_select') {
    return buildCascadeSubmitValue(getCascadeLevels(field), value || {});
  }
  if (field.type === 'multiselect') {
    return Array.isArray(value) ? value : [];
  }
  if (isOtherSelected(field, value)) {
    return formValues[`${field.name}_other`] || '';
  }
  return value ?? '';
};

export const isFileUploadAnswer = (value) => (
  Boolean(value) && typeof value === 'object' && !(value instanceof File) && Boolean(value.uploadId)
);

export const isFieldFilled = (field, formValues) => {
  if (!isFieldShown(field, formValues) || !isInputFieldType(field.type)) {
    return true;
  }
  const value = formValues[field.name];
  if (field.type === 'cascade_select') {
    return isCascadeFieldFilled(field, value);
  }
  if (field.type === 'multiselect') {
    return Array.isArray(value) && value.length > 0;
  }
  if (field.type === 'checkbox') {
    return value === true || value === 'true' || value === 'Yes' || value === field.checkedValue;
  }
  if (field.type === 'file' || field.type === 'image') {
    return isFileUploadAnswer(value);
  }
  if (field.type === 'range' || field.type === 'color') {
    return value !== undefined && value !== null && String(value).length > 0;
  }
  if (isOtherSelected(field, value)) {
    return Boolean(formValues[`${field.name}_other`]?.trim());
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null && value !== '';
};

const formatCheckboxPayloadValue = (field, value) => {
  const checked = value === true || value === 'true' || value === 'Yes' || value === field.checkedValue;
  if (checked) {
    return field.checkedValue ?? 'Yes';
  }
  if (value === false || value === 'false' || value === 'No' || value === field.uncheckedValue) {
    return field.uncheckedValue ?? 'No';
  }
  return value;
};

const shouldIncludePayloadValue = (field, value) => {
  if (field.type === 'multiselect') {
    return Array.isArray(value) && value.length > 0;
  }
  if (field.type === 'cascade_select') {
    return value && typeof value === 'object'
      && Object.values(value).some((item) => String(item ?? '').trim().length > 0);
  }
  if (field.type === 'file' || field.type === 'image') {
    return isFileUploadAnswer(value);
  }
  if (field.type === 'checkbox') {
    return value === true || value === 'true' || value === 'Yes' || value === field.checkedValue
      || value === false || value === 'false' || value === 'No' || value === field.uncheckedValue;
  }
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
};

export const buildSubmitPayload = (steps, formValues) => {
  const payload = {};

  steps.forEach((step) => {
    step.fields.forEach((field) => {
      if (!isFieldShown(field, formValues)) {
        return;
      }

      let value = getFieldDisplayValue(field, formValues);

      if (field.type === 'checkbox') {
        value = formatCheckboxPayloadValue(field, formValues[field.name]);
      }

      if (!shouldIncludePayloadValue(field, value)) {
        return;
      }

      payload[field.name] = value;
    });
  });

  return payload;
};
