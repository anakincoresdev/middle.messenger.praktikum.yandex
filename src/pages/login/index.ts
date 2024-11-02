import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './login.scss';

const template = `
  <main class="login-page">
    <form class="login-page__form">
      <h1>Авторизация</h1>
      {{{ loginInput }}}
      {{{ passwordInput }}}
      {{{ button }}}
    </form>
  </main>
`;

const form = {
  login: '',
  password: '',
};

const { validatePassword, validateLogin, validateForm } = useValidator();

const loginInput = new UIInputField({
  label: 'Логин',
  name: 'login',
  attr: {
    class: 'ui-input-field login-page__field',
  },
  value: form.login,
  events: {
    input: (evt: InputEvent) => {
      form.login = (evt.target as HTMLInputElement).value;
    },
    focusout() {
      if (!validateLogin(form.login)) {
        loginInput.setProps({ errorText: 'Некорректный логин' });
      } else {
        loginInput.setProps({ errorText: '' });
      }
    },
  },
});

const passwordInput = new UIInputField({
  label: 'Пароль',
  name: 'password',
  attr: {
    class: 'ui-input-field login-page__field',
  },
  events: {
    input: (evt: InputEvent) => {
      form.password = (evt.target as HTMLInputElement).value;
    },
    blur: () => {
      if (!validatePassword(form.password)) {
        console.log('Некорректный пароль');
      }
    },
  },
});

const validationRules = {
  login: validateLogin,
  password: validatePassword,
};

const button = new UIButton({
  text: 'Войти',
  className: 'login-page__button',
  events: {
    click: () => {
      if (!validateForm(validationRules, form)) {
        console.log('Форма заполнена не корректно');
        return;
      }
      console.log(form);
    },
  },
});

export class LoginPage extends Component {
  constructor() {
    super({
      button,
      loginInput,
      passwordInput,
      pageTitle: 'Логин',
    });
  }

  render() {
    return this.compile(template);
  }
}
