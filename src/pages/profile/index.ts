import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIAvatar } from '@/components/ui/ui-avatar/index.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './profile.scss';
import { UILink } from '@/components/ui/ui-link/index.ts';
import { router } from '@/router/Router.ts';
import { fetchAPI } from '@/utils/fetch.ts';
import { useUser } from '@/models/user.ts';
import { User } from '@/types/api/User.ts';
import { UIFile } from '@/components/ui/ui-file/index.ts';

const template = `
  <main class="profile-page">
    <form class="profile-page__form">
      <div class="profile-page__head">
        <div class="profile-page__user">
          {{{ avatar }}}
          <div>
            <h1>{{ pageTitle }}</h1>
            {{{ fileInput }}}
          </div>
        </div>
        {{{ logoutButton }}}
      </div>
      <div class="profile-page__grid">
        {{{ formFields }}}
      </div>
      {{{ submitButton }}}
      <div class="profile-page__footer">
        {{{ messengerLink }}}
      </div>
    </form>
  </main>
`;

type Form = {
  first_name: string,
  second_name: string,
  phone: string,
  email: string,
  login: string,
  display_name: string,
}

const form: Form = {
  first_name: '',
  second_name: '',
  phone: '',
  email: '',
  login: '',
  display_name: '',
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

const setFieldValue = (fieldName: keyof Form) => (evt: InputEvent) => {
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

const logoutButton = new UIButton({
  text: 'Выйти',
  events: {
    click: async () => {
      try {
        await fetchAPI.post('/auth/logout');
        router.go('/');
      } catch (e) {
        console.error(e);
      }
    },
  },
});

const avatar = new UIAvatar({
  className: 'profile-page__user-avatar',
});

const nameInput = new UIInputField({
  name: 'first_name',
  label: 'Имя',
  value: form.first_name,
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
  value: form.second_name,
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
  value: form.phone,
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
  value: form.email,
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
  value: form.login,
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

const displayNameInput = new UIInputField({
  name: 'display_name',
  label: 'Отображаемое имя',
  value: form.display_name,
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
    click: async () => {
      if (!validateForm(validationRules, form)) {
        formFields.forEach((input) => {
          input._children.input.props.events.focusout();
        });
        return;
      }

      try {
        await fetchAPI.put('/user/profile', { data: form });
        router.go('/messenger');
      } catch (e) {
        console.error(e);
      }
    },
  },
});

const messengerLink = new UILink({
  text: 'Назад к чату',
  events: {
    click() {
      router.go('/messenger');
    },
  },
});

function fillFormValues(user: User) {
  form.first_name = user.first_name;
  nameInput.setProps({ value: form.first_name });
  form.second_name = user.second_name;
  secondNameInput.setProps({ value: form.second_name });
  form.phone = user.phone;
  phoneInput.setProps({ value: form.phone });
  form.email = user.email;
  emailInput.setProps({ value: form.email });
  form.login = user.login;
  loginInput.setProps({ value: form.login });
  form.display_name = user.display_name;
  displayNameInput.setProps({ value: form.display_name });

  avatar.setProps({ src: user.avatar });
}

const fileInput = new UIFile({
  button: changeAvatarButton,
  events: {
    async change(evt: InputEvent) {
      const { target } = evt;
      const { files } = target as HTMLFormElement;
      const { 0: file } = files;

      if (!file) {
        return;
      }

      const { name } = file;

      const formData = new FormData();

      formData.append('avatar', file, name.replace(/\s/g, ''));

      try {
        await fetchAPI.put('/user/profile/avatar', { data: formData });
      } catch (e) {
        console.error(e);
      }
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
      messengerLink,
      logoutButton,
      fileInput,
      pageTitle: 'Профиль',
    });
  }

  render() {
    return this.compile(template);
  }

  async componentDidMount() {
    const { getUser } = useUser();
    const user = await getUser();

    if (user) {
      fillFormValues(user);
    } else {
      router.go('/');
    }
  }
}
