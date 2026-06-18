import { validatePasswordField } from '../../register/data/utils';
import { validatePassword } from '../../reset-password/data/service';

export const validateCohortPasswordLocally = (password, formatMessage) => (
  validatePasswordField(password, formatMessage)
);

export const validateCohortPasswordFromBackend = async (password) => {
  try {
    return await validatePassword({
      reset_password_page: true,
      password,
    });
  } catch {
    return '';
  }
};

export const validateCohortConfirmPassword = (confirmPassword, password, formatMessage, confirmMessages) => {
  if (!confirmPassword) {
    return formatMessage(confirmMessages['confirm.your.password']);
  }
  if (confirmPassword !== password) {
    return formatMessage(confirmMessages['passwords.do.not.match']);
  }
  return '';
};
