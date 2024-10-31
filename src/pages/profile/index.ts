import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIAvatar, UIInputField } from '@/components/index.ts';
import './profile.scss';
import { useValidator } from '@/utils/validator.ts';

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

const getFieldEvents = (fieldName: string) => ({
  input: setFieldValue(fieldName),
  blur: checkFieldValidation({
    validationRules,
    form,
    fieldName,
    errors,
  }),
});

const submitButton = new UIButton({
  text: 'Сохранить изменения',
  className: 'profile-page__button',
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

const changeAvatarButton = new UIButton({
  text: 'Сменить аватар',
});

const avatar = new UIAvatar({
  className: 'profile-page__user-avatar',
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
    name: 'display_name',
    label: 'Отображаемое имя',
    events: getFieldEvents('display_name'),
  }),
];

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
