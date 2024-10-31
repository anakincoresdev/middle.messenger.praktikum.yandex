import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './registration.scss';

const template = `
  <main class="registration-page">
    <form class="registration-page__form">
      <h1>{{ pageTitle }}</h1>
      <div class="registration-page__grid">
        {{{ formFields }}}
      </div>
      {{{ button }}}
      <div class="registration-page__footer">
        <a class="link">Уже есть аккаунт? Войти</a>
      </div>
    </form>
  </main>
`;

const form: Record<string, string> = {
  first_name: '',
  second_name: '',
  phone: '',
  email: '',
  login: '',
  password: '',
};

const {
  validatePassword,
  validateForm,
  validateLogin,
  validateEmail,
  validateName,
  validatePhone,
  checkFieldValidation,
} = useValidator();

const validationRules = {
  first_name: validateName,
  second_name: validateName,
  email: validateEmail,
  login: validateLogin,
  password: validatePassword,
  phone: validatePhone,
};

const setFieldValue = (fieldName: string) => (evt: InputEvent) => {
  form[fieldName] = (evt.target as HTMLInputElement).value;
};

const errors = {
  first_name: 'Некорректное имя',
  second_name: 'Некорректное имя',
  login: 'Некорректный логин',
  email: 'Некорректный email',
  password: 'Некорректный пароль',
  phone: 'Некорректный телефон',
  message: 'Сообщение не должно быть пустым',
};

const getFieldEvents = (fieldName: string) => ({
  input: setFieldValue(fieldName),
  blur: checkFieldValidation({
    validationRules,
    form,
    fieldName,
    errors,
  }),
});

const formFields = [
  new UIInputField({
    name: 'first_name',
    label: 'Имя',
    events: getFieldEvents('first_name'),
  }),
  new UIInputField({
    name: 'second_name',
    label: 'Фамилия',
    events: getFieldEvents('second_name'),
  }),
  new UIInputField({
    name: 'phone',
    label: 'Телефон',
    events: getFieldEvents('phone'),
  }),
  new UIInputField({
    name: 'email',
    label: 'Email',
    events: getFieldEvents('email'),
  }),
  new UIInputField({
    name: 'login',
    label: 'Логин',
    events: getFieldEvents('login'),
  }),
  new UIInputField({
    name: 'password',
    label: 'Пароль',
    events: getFieldEvents('password'),
  }),
];

const button = new UIButton({
  text: 'Зарегистрироваться',
  className: 'registration-page__button',
  events: {
    click() {
      if (!validateForm(validationRules, form)) {
        console.log('Форма заполнена не корректно');
        return;
      }
      console.log(form);
    },
  },
});

export class RegistrationPage extends Component {
  constructor() {
    super({
      formFields,
      button,
      pageTitle: 'Регистрация',
    });
  }

  render() {
    return this.compile(template);
  }
}
