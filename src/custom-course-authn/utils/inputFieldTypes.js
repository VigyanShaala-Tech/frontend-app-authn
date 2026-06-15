export const NON_INPUT_FIELD_TYPES = ['hidden'];

export const isInputFieldType = (fieldType) => !NON_INPUT_FIELD_TYPES.includes(fieldType);

export const getHtmlInputType = (fieldType) => {
  const typeMap = {
    text: 'text',
    email: 'email',
    password: 'password',
    number: 'number',
    tel: 'tel',
    telephone: 'tel',
    url: 'url',
    search: 'search',
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
    'datetime-local': 'datetime-local',
    month: 'month',
    week: 'week',
    range: 'range',
    color: 'color',
  };

  return typeMap[fieldType] || 'text';
};

export const isNativeInputType = (fieldType) => Boolean(getHtmlInputType(fieldType))
  && !['select', 'multiselect', 'cascade_select', 'radio', 'checkbox', 'textarea', 'file', 'image'].includes(fieldType);
