export const extractApiMessage = (source) => {
  if (!source) {
    return '';
  }

  if (typeof source === 'string') {
    return source.trim();
  }

  if (typeof source.message === 'string') {
    return source.message.trim();
  }

  const responseMessage = source?.response?.data?.message;
  if (typeof responseMessage === 'string') {
    return responseMessage.trim();
  }

  return '';
};

export const resolveCohortMessage = (apiMessage, fallbackMessage, formatMessage, values) => {
  const trimmed = (apiMessage || '').trim();
  if (trimmed) {
    return trimmed;
  }

  return formatMessage(fallbackMessage, values);
};
