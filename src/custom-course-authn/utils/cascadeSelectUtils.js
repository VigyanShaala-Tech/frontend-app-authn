import { OTHER_OPTION_VALUE } from '../data/constants';

const CASCADE_FIELD_META_KEYS = new Set([
  'name',
  'type',
  'label',
  'required',
  'helper',
  'placeholder',
  'visible',
  'disabled',
  'isEligibilityField',
  'validation',
  'dependsOn',
  'defaultValue',
  'builtin',
  'rows',
  'checkboxLabel',
  'options',
  'optionsByParent',
  'cascadeData',
  'levels',
]);

const formatLevelLabel = (key) => (
  key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
);

export const getCascadeLevelKeys = (field) => {
  const rootKeys = Object.keys(field).filter(
    (key) => !CASCADE_FIELD_META_KEYS.has(key)
      && Array.isArray(field[key])
      && field[key].length > 0
      && typeof field[key][0] === 'object'
      && field[key][0].value !== undefined,
  );

  if (!rootKeys.length) {
    return [];
  }

  const keys = [rootKeys[0]];
  let current = field[rootKeys[0]][0];

  while (current) {
    const nestedKey = Object.keys(current).find(
      (key) => !['id', 'value', 'label'].includes(key)
        && Array.isArray(current[key])
        && current[key].length > 0,
    );
    if (!nestedKey) {
      break;
    }
    keys.push(nestedKey);
    current = current[nestedKey][0];
  }

  return keys;
};

export const getCascadeLevels = (field) => {
  const keys = getCascadeLevelKeys(field);
  return keys.map((key) => ({
    key,
    label: formatLevelLabel(key),
    placeholder: `Select ${formatLevelLabel(key).toLowerCase()}`,
  }));
};

export const isCascadeOtherOption = (option) => {
  if (!option || typeof option !== 'object') {
    return false;
  }
  return option.id === 'other'
    || option.value === OTHER_OPTION_VALUE
    || option.value === 'Other';
};

export const isCascadeOtherValue = (value) => (
  value === OTHER_OPTION_VALUE || value === 'Other'
);

export const findCascadeNode = (nodes, selectedValue) => (
  nodes.find((node) => node.value === selectedValue || String(node.id) === String(selectedValue))
);

const resolveLevelKey = (levels, index) => {
  const level = levels[index];
  if (!level) {
    return null;
  }
  return typeof level === 'string' ? level : level.key;
};

export const getCascadeNodesAtLevel = (field, levels, selections, levelIndex) => {
  const rootKey = resolveLevelKey(levels, 0);
  if (!rootKey) {
    return [];
  }

  let nodes = field[rootKey] || [];

  for (let i = 0; i < levelIndex; i += 1) {
    const levelKey = resolveLevelKey(levels, i);
    const childKey = resolveLevelKey(levels, i + 1);
    const selected = selections?.[levelKey];

    if (!selected || isCascadeOtherValue(selected) || !childKey) {
      return [];
    }

    const node = findCascadeNode(nodes, selected);
    if (!node?.[childKey]?.length) {
      return [];
    }

    nodes = node[childKey];
  }

  return nodes;
};

export const getCascadeOptionsAtLevel = (field, levels, selections, levelIndex) => {
  const nodes = getCascadeNodesAtLevel(field, levels, selections, levelIndex);
  return nodes.map(({ id, value, label }) => ({ id, value, label }));
};

export const cascadeLevelHasOtherOption = (field, levels, selections, levelIndex) => (
  getCascadeOptionsAtLevel(field, levels, selections, levelIndex).some(isCascadeOtherOption)
);

export const getCascadeOtherLevelIndex = (levels, selections) => {
  const index = levels.findIndex((level) => isCascadeOtherValue(selections?.[level.key]));
  return index === -1 ? null : index;
};

export const buildInitialCascadeValue = (levels) => {
  const value = {};
  levels.forEach((level) => {
    value[level.key] = '';
    value[`${level.key}_other`] = '';
  });
  return value;
};

export const getCascadeLevelValidationKey = (fieldName, levelKey) => `${fieldName}__${levelKey}`;

export const isCascadeLevelEligibilityPassed = (fieldName, levelKey, validationStatus) => {
  const statusKey = getCascadeLevelValidationKey(fieldName, levelKey);
  return validationStatus[statusKey]?.valid === true;
};

export const isCascadeLevelReady = (levels, selections, levelIndex) => {
  if (levelIndex === 0) {
    return true;
  }
  const parentKey = levels[levelIndex - 1].key;
  const parentValue = selections?.[parentKey];
  return Boolean(parentValue) && !isCascadeOtherValue(parentValue);
};

export const isCascadeLevelUnlocked = (
  field,
  levels,
  selections,
  levelIndex,
  validationStatus = {},
) => {
  if (levelIndex === 0) {
    return true;
  }

  if (!isCascadeLevelReady(levels, selections, levelIndex)) {
    return false;
  }

  if (!field.isEligibilityField) {
    return true;
  }

  const firstLevelKey = levels[0]?.key;
  if (!firstLevelKey) {
    return true;
  }

  const firstLevelValue = selections?.[firstLevelKey];
  if (!firstLevelValue) {
    return false;
  }

  return isCascadeLevelEligibilityPassed(field.name, firstLevelKey, validationStatus);
};

export const getCascadeLevelValidationKeys = (fieldName, levels) => (
  levels.map((level) => getCascadeLevelValidationKey(fieldName, level.key))
);

export const getCascadeChangedLevelIndex = (levels, previousSelections = {}, nextSelections = {}) => {
  const changedIndex = levels.findIndex(
    (level) => (previousSelections[level.key] ?? '') !== (nextSelections[level.key] ?? ''),
  );
  return changedIndex;
};

export const getCascadeLevelsToReset = (levels, changedLevelIndex) => {
  if (changedLevelIndex < 0) {
    return [];
  }
  return levels.slice(changedLevelIndex);
};

export const isCascadeFieldFilled = (field, selections) => {
  const levels = getCascadeLevels(field);
  if (!levels.length || !selections || typeof selections !== 'object') {
    return false;
  }

  const otherIndex = getCascadeOtherLevelIndex(levels, selections);

  if (otherIndex !== null) {
    for (let i = 0; i < otherIndex; i += 1) {
      const selected = selections[levels[i].key];
      if (!selected || isCascadeOtherValue(selected)) {
        return false;
      }
    }
    for (let i = otherIndex; i < levels.length; i += 1) {
      const otherKey = `${levels[i].key}_other`;
      if (!String(selections[otherKey] || '').trim()) {
        return false;
      }
    }
    return true;
  }

  return levels.every((level) => {
    const selected = selections[level.key];
    return selected !== undefined && selected !== null && String(selected).trim() !== '';
  });
};

export const buildCascadeSubmitValue = (levels, selections) => {
  const result = {};
  const otherIndex = getCascadeOtherLevelIndex(levels, selections);

  levels.forEach((level, index) => {
    if (otherIndex !== null) {
      if (index < otherIndex) {
        result[level.key] = selections[level.key] || '';
      } else {
        result[level.key] = selections[`${level.key}_other`] || '';
      }
      return;
    }
    result[level.key] = selections[level.key] || '';
  });

  return result;
};

export const updateCascadeSelection = (levels, currentValue, levelIndex, selectedValue) => {
  const next = { ...currentValue };
  const levelKey = levels[levelIndex].key;
  next[levelKey] = selectedValue;

  for (let i = levelIndex + 1; i < levels.length; i += 1) {
    next[levels[i].key] = '';
    next[`${levels[i].key}_other`] = '';
  }

  if (!isCascadeOtherValue(selectedValue)) {
    next[`${levelKey}_other`] = '';
  }

  return next;
};

export const updateCascadeOtherInput = (levels, currentValue, levelKey, text) => {
  const next = { ...currentValue };
  next[`${levelKey}_other`] = text;
  return next;
};
