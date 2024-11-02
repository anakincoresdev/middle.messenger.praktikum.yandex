import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIAvatar } from '@/components/ui/ui-avatar/index.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './profile.scss';

const template = `
  <main class="profile-page">
    <form class="profile-page__form">
      <div class="profile-page__user">
        {{{ avatar }}}
        <div>
          <h1>{{ pageTitle }}</h1>
          {{{ changeAvatarButton }}}
        </div>
      </div>
      <div class="profile-page__grid">
        {{{ formFields }}}
      </div>
      {{{ submitButton }}}
      <div class="profile-page__footer">
        <a class="link">На главную</a>
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
  display_name: validateName,
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
  display_name: 'Некорректное имя',
  phone: 'Некорректный телефон',
  message: 'Сообщение не должно быть пустым',
};

const changeAvatarButton = new UIButton({
  text: 'Сменить аватар',
});

const avatar = new UIAvatar({
  className: 'profile-page__user-avatar',
});

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

const displayNameInput = new UIInputField({
  name: 'display_name',
  label: 'Отображаемое имя',
  events: {
    input: setFieldValue('display_name'),
    focusout() {
      checkFieldValidation({
        validationRules,
        errors,
        field: displayNameInput,
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
  displayNameInput,
];

const submitButton = new UIButton({
  text: 'Сохранить изменения',
  className: 'profile-page__button',
  events: {
    click() {
      if (!validateForm(validationRules, form)) {
        formFields.forEach((input) => {
          input._children.input.props.events.focusout();
        });
        return;
      }
      console.log(form);
    },
  },
});

export class ProfilePage extends Component {
  constructor() {
    super({
      submitButton,
      changeAvatarButton,
      avatar,
      formFields,
      pageTitle: 'Профиль',
    });
  }

  render() {
    return this.compile(template);
  }
}
