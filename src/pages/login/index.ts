import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './login.scss';

const template = `
  <form class="login-page__form">
    <h1>Авторизация</h1>
    {{{ loginInput }}}
    {{{ passwordInput }}}
    {{{ button }}}
  </form>
`;

const form = {
  login: '',
  password: '',
};

const { validatePassword, validateLogin } = useValidator();

const validationRules = {
  login: validateLogin,
  password: validatePassword,
};

const checkValidation = (input: Component) => {
  const name = input.props.name as 'login' | 'password';

  if (!validationRules[name](form[name])) {
    input.setProps({ errorText: 'Поле заполнено некорректно' });
    return false;
  }

  input.setProps({ errorText: '' });
  return true;
};

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
      checkValidation(loginInput);
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
    focusout: () => {
      checkValidation(passwordInput);
    },
  },
});

const button = new UIButton({
  text: 'Войти',
  className: 'login-page__button',
  events: {
    click: () => {
      const isLoginCorrect = checkValidation(loginInput);
      const isPasswordCorrect = checkValidation(passwordInput);

      if (!isLoginCorrect || !isPasswordCorrect) {
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
      attr: {
        class: 'login-page',
      },
      button,
      loginInput,
      passwordInput,
      pageTitle: 'Логин',
    }, 'main');
  }

  render() {
    return this.compile(template);
  }
}
