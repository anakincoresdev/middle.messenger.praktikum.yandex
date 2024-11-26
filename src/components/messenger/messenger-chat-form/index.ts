import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { useChat } from '@/models/chat.ts';
import { Props } from '@/core/types/index.ts';

const template = `
  <div class="messenger-chat-form">
    {{{ newChatInput }}}
    {{{ newChatButton }}}
  </div>
`;

const newChatForm = {
  title: '',
};

export class MessengerChatForm extends Component {
  constructor(props: Props) {
    const { createChat } = useChat();

    const newChatInput = new UIInputField({
      placeholder: 'Название нового чата',
      name: 'chatTitle',
      attr: {
        class: 'messenger-page__new-chat-inp',
      },
      events: {
        input(evt: InputEvent) {
          newChatForm.title = (evt.target as HTMLInputElement).value;
        },
      },
    });

    const newChatButton = new UIButton({
      text: 'Добавить',
      events: {
        click: async () => {
          if (newChatForm.title) {
            await createChat(newChatForm.title);
            newChatForm.title = '';
            newChatInput.setProps({ value: '' });
            props.onChatCreated();
          }
        },
      },
    });

    super({
      onChatCreated: props.onChatCreated,
      newChatForm,
      newChatButton,
      newChatInput,
    });
  }

  render() {
    return this.compile(template);
  }
}
