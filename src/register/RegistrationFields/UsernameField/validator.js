// import messages from '../../messages';

// export const VALID_USERNAME_REGEX = /^[a-zA-Z0-9_-]*$/i;
// export const usernameRegex = new RegExp(VALID_USERNAME_REGEX, 'i');

// const validateUsername = (value, formatMessage) => {
//   let fieldError = '';
//   if (!value || value.length <= 1 || value.length > 30) {
//     fieldError = formatMessage(messages['username.validation.message']);
//   } else if (!usernameRegex.test(value)) {
//     fieldError = formatMessage(messages['username.format.validation.message']);
//   }
//   return fieldError;
// };

// export default validateUsername;


import messages from '../../messages';

export const validateUsername = (value, formatMessage) => {
  let fieldError = '';

  const trimmed = (value || '').trim();

  if (!trimmed) {
    fieldError = formatMessage(messages['username.validation.message']); // or a better message: "Username is required"
  }
  // That's it — no length check, no regex, no format restrictions

  return fieldError;
};

export default validateUsername;