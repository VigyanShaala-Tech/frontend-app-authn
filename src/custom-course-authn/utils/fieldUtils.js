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

// --- "Show fields when condition matches" eligibility rules -------------------------------
// The backend attaches a `visibleWhen` condition list (see cohort_management_form.services
// _mark_field_visibility_conditions) to any field targeted by an active field_visibility
// rule. Evaluated entirely client-side — mirrors rule_matches() so the field reacts live as
// the trigger field changes, with no extra round trip per keystroke.

const RULE_EXPECTED_ALL = '__all__';

const isDynamicToday = (value) => {
  const token = String(value == null ? '' : value).trim().toLowerCase();
  return token === '__today__' || token === 'today';
};

const resolveConditionExpectedValue = (value) => (
  isDynamicToday(value) ? new Date().toISOString().slice(0, 10) : value
);

const conditionExpectedIsAll = (expected) => {
  if (expected === RULE_EXPECTED_ALL) {
    return true;
  }
  // eslint-disable-next-line no-underscore-dangle -- mirrors the backend's __all__ sentinel key
  if (expected && typeof expected === 'object' && !Array.isArray(expected) && expected.__all__ === true) {
    return true;
  }
  if (typeof expected === 'string' && ['__all__', 'all'].includes(expected.trim().toLowerCase())) {
    return true;
  }
  return false;
};

// yyyy-mm-dd (native <input type="date"> value) or dd-mm-yyyy / dd/mm/yyyy (Control Hub
// "Expected value" input) — matches the backend's supported formats exactly.
const coerceConditionDate = (value) => {
  if (value == null || value === '') {
    return null;
  }
  const text = String(value).trim();
  let m = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  m = text.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) {
    return Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  }
  return null;
};

const coerceConditionNumber = (value) => {
  if (value == null || value === '') {
    return null;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const conditionValueMatchesItem = (actual, expectedItem) => {
  const resolved = resolveConditionExpectedValue(expectedItem);
  const actualDate = coerceConditionDate(actual);
  const expectedDate = coerceConditionDate(resolved);
  if (actualDate != null && expectedDate != null) {
    return actualDate === expectedDate;
  }
  return String(actual).trim().toLowerCase() === String(expectedItem).trim().toLowerCase();
};

const compareConditionOrdered = (actual, operator, expected) => {
  const resolved = resolveConditionExpectedValue(expected);
  const actualDate = coerceConditionDate(actual);
  const expectedDate = coerceConditionDate(resolved);
  if (actualDate != null && expectedDate != null) {
    if (operator === 'gte') { return actualDate >= expectedDate; }
    if (operator === 'lte') { return actualDate <= expectedDate; }
    if (operator === 'gt') { return actualDate > expectedDate; }
    if (operator === 'lt') { return actualDate < expectedDate; }
    return false;
  }
  const actualNum = coerceConditionNumber(actual);
  const expectedNum = coerceConditionNumber(resolved);
  if (actualNum == null || expectedNum == null) {
    return false;
  }
  if (operator === 'gte') { return actualNum >= expectedNum; }
  if (operator === 'lte') { return actualNum <= expectedNum; }
  if (operator === 'gt') { return actualNum > expectedNum; }
  if (operator === 'lt') { return actualNum < expectedNum; }
  return false;
};

const conditionMatches = (actual, operator, expected) => {
  const isEmpty = actual == null || actual === '' || (Array.isArray(actual) && actual.length === 0);
  if (isEmpty) {
    return false;
  }
  if (conditionExpectedIsAll(expected)) {
    return operator !== 'not_in';
  }

  if (Array.isArray(actual)) {
    const actualSet = new Set(actual.map((v) => String(v).trim().toLowerCase()));
    const expectedList = Array.isArray(expected) ? expected : [expected];
    const expectedSet = new Set(expectedList.map((v) => String(v).trim().toLowerCase()));
    const overlaps = [...actualSet].some((v) => expectedSet.has(v));
    if (operator === 'eq' || operator === 'in') { return overlaps; }
    if (operator === 'ne' || operator === 'not_in') { return !overlaps; }
    return false;
  }

  if (['eq', 'ne', 'in', 'not_in'].includes(operator)) {
    const expectedList = Array.isArray(expected) ? expected : [expected];
    const anyMatch = expectedList.some((item) => conditionValueMatchesItem(actual, item));
    return (operator === 'eq' || operator === 'in') ? anyMatch : !anyMatch;
  }

  return compareConditionOrdered(actual, operator, expected);
};

// Fields with no visibleWhen conditions are always shown (identical to today's behavior).
// A field targeted by more than one field_visibility rule is shown when ANY condition
// matches (OR), mirroring compute_field_visibility() server-side.
const isFieldVisibleByConditions = (field, formValues) => {
  const conditions = field.visibleWhen;
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return true;
  }
  return conditions.some((condition) => (
    conditionMatches(formValues[condition.field], condition.operator, condition.expectedValue)
  ));
};

export const isFieldShown = (field, formValues) => {
  if (field.type === 'hidden') {
    return false;
  }
  if (field.dependsOn && !formValues[field.dependsOn]) {
    return false;
  }
  return isFieldVisibleByConditions(field, formValues);
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
