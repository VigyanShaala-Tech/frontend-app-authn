const normalizeFieldType = (type) => {
  if (type === 'multi-select') {
    return 'multiselect';
  }
  return type;
};

const normalizeField = (field) => {
  const dependsOn = field.dependsOn || field.depends_on;
  const rawOptions = field.options;
  let options = Array.isArray(rawOptions) ? rawOptions : [];
  let optionsByParent = field.optionsByParent;

  if (dependsOn && rawOptions && !Array.isArray(rawOptions) && typeof rawOptions === 'object') {
    optionsByParent = rawOptions;
    options = [];
  }

  return {
    ...field,
    type: normalizeFieldType(field.type),
    isEligibilityField: field.isEligibilityField ?? field.iseligibilityfield ?? false,
    isFormAccessSource: field.isFormAccessSource ?? field.isformaccesssource ?? false,
    dependsOn,
    options,
    optionsByParent,
    maxSelections: (() => {
      const raw = field.maxSelections ?? field.maxselections;
      if (raw === null || raw === undefined || raw === '') {
        return null;
      }
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    })(),
  };
};

const normalizeStep = (step) => ({
  ...step,
  categoryOrder: step.categoryOrder ?? step.categoryorder,
  fields: (step.fields || []).map(normalizeField),
});

export const normalizeFormResponse = (data) => ({
  slug: data.slug,
  courseId: data.courseid || data.courseId,
  pageTitle: data.pagetitle || data.pageTitle,
  templateId: data.templateid || data.templateId,
  infoSections: data.infosections || data.infoSections,
  result: (data.result || []).map(normalizeStep),
});
