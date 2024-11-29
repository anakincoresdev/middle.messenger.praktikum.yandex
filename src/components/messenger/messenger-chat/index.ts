import { Component } from '@/core/component.ts';
import { UIInput } from '@/components/ui/ui-input/index.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { useValidator } from '@/utils/validator.ts';
import { Props } from '@/core/types/index.ts';
import { UILink } from '@/components/ui/ui-link/index.ts';
import { UIModal } from '@/components/ui/ui-modal/index.ts';
import { router } from '@/router/Router.ts';
import { MessengerChatParticipants } from '@/components/messenger/messenger-chat-participants/index.ts';
import './messenger-chat.scss';
import { useChat } from '@/models/chat.ts';
import { MessengerChatParticipantItem } from '@/components/messenger/messenger-chat-participant-item/index.ts';
import { MessengerChatNewParticipantForm } from '@/components/messenger/messenger-chat-new-participant-form/index.ts';
import { ChatParticipant } from '@/types/api/Chat.ts';
import { debounce } from '@/utils/common.ts';
import { fetchAPI } from '@/utils/fetch.ts';

const template = `
  <div class="messenger-chat">
    <div class="messenger-chat__head">
      <div class="messenger-chat__title">
        {{ title }}
        {{#if currentChatId}}
          {{{ participantsLink }}}
          {{{ newParticipantLink }}}
        {{/if}}
      </div>
      
      {{{ profileSettingsLink }}}
    </div>
  {{#if isLoading}}
    <div class="messenger-chat__empty">
      Загрузка...
    </div>
  {{else if currentChatId}}
    <div class="messenger-chat__messages">
      {{{ items }}}
    </div>
    <div class="messenger-chat__form">
      {{{ input }}}
      {{{ button }}}
    </div>
  {{else}}
    <div class="messenger-chat__empty">
      Выберите чат
    </div>
  {{/if}}
  </div>
  {{#if isParticipantsWindowOpened}}
    {{{ participantsModal }}}
  {{/if}}
  {{#if isNewParticipantWindowOpened}}
    {{{ newParticipantModal }}}
  {{/if}}
`;

const { validateMessage, validateForm } = useValidator();
const { getChatParticipants, chat } = useChat();

const form = {
  message: '',
};

const validationRules = {
  message: validateMessage,
};

const chatParticipants: { items: ChatParticipant[] } = { items: [] };

const participantsForm = new MessengerChatParticipants({
  id: 0,
});

export class MessengerChat extends Component {
  constructor(props: Props) {
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
          chat.socket?.send(
            JSON.stringify({ content: form.message, type: 'message' }),
          );
          form.message = '';
          input.setProps({ value: '' });
        },
      },
    });

    const profileSettingsLink = new UILink({
      text: 'Настройки профиля',
      events: {
        click() {
          router.go('/settings');
        },
      },
    });

    const participantsModal = new UIModal({
      title: 'Участники',
      content: participantsForm,
      onClose: () => {
        this.setProps({ isParticipantsWindowOpened: false });
      },
    });

    const newParticipantModal = new UIModal({
      title: 'Участники',
      content: new MessengerChatNewParticipantForm({
        onClose: () => {
          this.setProps({ isNewParticipantWindowOpened: false });
        },
      }),
      onClose: () => {
        this.setProps({ isNewParticipantWindowOpened: false });
      },
    });

    const participantsLink = new UILink({
      text: 'Участники',
      events: {
        click: async () => {
          this.setProps({ isParticipantsWindowOpened: true });
        },
      },
    });

    const newParticipantLink = new UILink({
      text: 'Добавить участника',
      events: {
        click: () => {
          this.setProps({ isNewParticipantWindowOpened: true });
          newParticipantModal._children.content.setProps({
            chatId: this.props.currentChatId,
          });
        },
      },
    });

    super({
      ...props,
      items: props.items,
      input,
      button,
      profileSettingsLink,
      participantsLink,
      messagesCount: props.items.length,
      isParticipantsWindowOpened: false,
      isNewParticipantWindowOpened: false,
      participantsModal,
      newParticipantModal,
      newParticipantLink,
      chatParticipants,
      events: {
        keydown: debounce((event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            chat.socket?.send(
              JSON.stringify({ content: form.message, type: 'message' }),
            );
            form.message = '';
            input.setProps({ value: '' });
          }
        }, 100),
      },
    });
  }

  render() {
    return this.compile(template);
  }

  componentDidUpdate([oldProps, nextProps]: [Props, Props]) {
    getChatParticipants(this.props.currentChatId).then((data) => {
      if (data && data.length) {
        chatParticipants.items = data;
        participantsForm.setProps({
          items: data.map(
            (item) =>
              new MessengerChatParticipantItem({
                name: `${item.second_name} ${item.first_name}`,
                avatarSrc: item.avatar,
                removeBtn: new UILink({
                  text: '🗑',
                  events: {
                    click: async () => {
                      try {
                        await fetchAPI.delete('/chats/users', {
                          data: {
                            chatId: this.props.currentChatId,
                            users: [item.id],
                          },
                        });
                        this.setProps({ isParticipantsWindowOpened: false });
                      } catch (e) {
                        console.error(e);
                      }
                    },
                  },
                }),
              }),
          ),
        });
      }
    });
    return super.componentDidUpdate([oldProps, nextProps]);
  }
}
