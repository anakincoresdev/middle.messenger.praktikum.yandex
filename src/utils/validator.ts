// eslint-disable-next-line max-len
const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type ValidationRules = Record<string, (value: string) => boolean>;
type Form = Record<string, string>;
type Errors = Record<string, string>;

export function useValidator() {
  const validateName = (value: string) => /^[A-ZА-Я][a-zа-я-]+$/.test(value);

  const validatePhone = (value: string) => /^[0-9+][0-9]{9,14}$/.test(value);

  const validateEmail = (value: string) => emailRegExp.test(value);

  const validateMessage = (value: string) => Boolean(value.length);

  const validateLogin = (value: string) => {
    const hasOnlyAllowedSymbols = /^[A-Za-z0-9_-]{3,20}$/.test(value);
    const hasOnlyNumbers = /^[0-9]*$/.test(value);

    return hasOnlyAllowedSymbols && !hasOnlyNumbers;
  };

  const validatePassword = (value: string) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,40}$/.test(value);

  const validateForm = (validationRules: ValidationRules, form: Form) => {
    let isValid = true;

    Object.entries(validationRules).forEach(([key, validator]) => {
      if (!validator(form[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const checkFieldValidation = ({
    validationRules,
    errors,
    fieldName,
    form,
  }: {
    validationRules: ValidationRules,
    errors: Errors,
    fieldName: string,
    form: Form,
  }) => () => {
    const validator = validationRules[fieldName];

    if (validator && !validator(form[fieldName])) {
      console.log(errors[fieldName]);
    }
  };

  return {
    validateName,
    validateForm,
    validateEmail,
    validateLogin,
    validatePassword,
    validatePhone,
    validateMessage,
    checkFieldValidation,
  };
}
