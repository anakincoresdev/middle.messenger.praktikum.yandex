import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { useValidator } from '@/utils/validator.ts';
import { fetchAPI } from '@/utils/fetch.ts';
import './registration.scss';
import { router } from '@/router/Router.ts';
import { useUser } from '@/utils/user.ts';

const template = `
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
  second_name: 'Некорректная фамилия',
  login: 'Некорректный логин',
  email: 'Некорректный email',
  password: 'Некорректный пароль',
  phone: 'Некорректный телефон',
  message: 'Сообщение не должно быть пустым',
};

const nameInput = new UIInputField({
  name: 'first_name',
  label: 'Имя',
  events: {
    input: setFieldValue('first_name'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: nameInput,
        form,
      });
    },
  },
});

const secondNameInput = new UIInputField({
  name: 'second_name',
  label: 'Фамилия',
  events: {
    input: setFieldValue('second_name'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: secondNameInput,
        form,
      });
    },
  },
});

const phoneInput = new UIInputField({
  name: 'phone',
  label: 'Телефон',
  events: {
    input: setFieldValue('phone'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: phoneInput,
        form,
      });
    },
  },
});

const emailInput = new UIInputField({
  name: 'email',
  label: 'Email',
  events: {
    input: setFieldValue('email'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: emailInput,
        form,
      });
    },
  },
});

const loginInput = new UIInputField({
  name: 'login',
  label: 'Логин',
  events: {
    input: setFieldValue('login'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: loginInput,
        form,
      });
    },
  },
});

const passwordInput = new UIInputField({
  name: 'password',
  label: 'Пароль',
  events: {
    input: setFieldValue('password'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: passwordInput,
        form,
      });
    },
  },
});

const formFields = [
  nameInput,
  secondNameInput,
  phoneInput,
  emailInput,
  loginInput,
  passwordInput,
];

const button = new UIButton({
  text: 'Зарегистрироваться',
  className: 'registration-page__button',
  events: {
    click: async () => {
      if (!validateForm(validationRules, form)) {
        formFields.forEach((input) => {
          input._children.input.props.events.focusout();
        });
        return;
      }

      const data = await fetchAPI.post('/auth/signup', { data: form, headers: { 'Content-Type': 'application/json' } });

      if (data && data.status === 200) {
        router.go('/');
      }
    },
  },
});

export class RegistrationPage extends Component {
  constructor() {
    super(
      {
        attr: {
          class: 'registration-page',
        },
        formFields,
        button,
        pageTitle: 'Регистрация',
      },
      'main',
    );
  }

  render() {
    return this.compile(template);
  }

  async componentDidMount() {
    const { getUser } = useUser();
    const user = await getUser();

    if (user) {
      router.go('/messenger');
    }
  }
}
