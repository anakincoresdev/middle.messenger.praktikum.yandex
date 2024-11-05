import { Component } from '@/core/component.ts';
import { UIInput } from '@/components/ui/ui-input/index.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { useValidator } from '@/utils/validator.ts';
import './messenger-chat.scss';
import { Props } from '@/core/types/index.ts';

const template = `
  <div class="messenger-chat">
    <div class="messenger-chat__head">
      Сообщения ({{ messagesCount }})
    </div>
    <div class="messenger-chat__messages">
      {{{ items }}}
    </div>
    <form class="messenger-chat__form">
      {{{ input }}}
      {{{ button }}}
    </form>
  </div>
`;

const { validateMessage, validateForm } = useValidator();

const form = {
  message: '',
};

const validationRules = {
  message: validateMessage,
};

const input = new UIInput({
  attr: {
    class: 'ui-input messenger-chat__input',
  },
  name: 'message',
  placeholder: 'Введите сообщение',
  events: {
    input: (evt: InputEvent) => {
      form.message = (evt.target as HTMLInputElement).value;
    },
  },
});

const button = new UIButton({
  text: 'Отправить',
  className: 'messenger-chat__button',
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

export class MessengerChat extends Component {
  constructor(props: Props) {
    super({
      ...props,
      input,
      button,
      messagesCount: props.items.length,
    });
  }

  render() {
    return this.compile(template);
  }
}
