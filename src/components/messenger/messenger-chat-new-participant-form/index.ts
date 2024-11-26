import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { Props } from '@/core/types/index.ts';
import { fetchAPI } from '@/utils/fetch.ts';
import { MessengerChatParticipantItem } from '@/components/messenger/messenger-chat-participant-item/index.ts';
import { MessengerChatParticipants } from '@/components/messenger/messenger-chat-participants/index.ts';
import { debounce } from '@/utils/common.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';

import './messenger-chat-new-participant-form.scss';
import { ChatParticipant } from '@/types/api/Chat.ts';

const template = `
  <form class="messenger-chat-new-participant-form">
    {{{ input }}}
  </form>
  {{#if selectedParticipantId}}
    {{{ button }}}
  {{/if}}
  <div class="messenger-chat-new-participant-form">
    {{{ participantsList }}}
  </div>
`;

export class MessengerChatNewParticipantForm extends Component {
  constructor(props: Props) {
    const participantsList = new MessengerChatParticipants({
      items: [],
    });

    const input = new UIInputField({
      label: 'Поиск пользователя',
      name: 'search',
      events: {
        input: debounce(async (evt: InputEvent) => {
          const login = (evt.target as HTMLInputElement).value;
          const data = await fetchAPI.post('/user/search', { data: { login } });

          if (data.status === 200) {
            const participants = JSON.parse(data.response) as ChatParticipant[];

            const items = participants.map(
              (user) =>
                new MessengerChatParticipantItem({
                  name: `${user.second_name} ${user.first_name}`,
                  userId: user.id,
                  avatarSrc: user.avatar,
                  events: {
                    click: () => {
                      items.forEach((participant) => {
                        participant.setProps({
                          isActive: participant.props.userId === user.id,
                        });
                      });
                      this.setProps({ selectedParticipantId: user.id });
                    },
                  },
                }),
            );

            participantsList.setProps({ items });
          }
        }, 300),
      },
    });

    const button = new UIButton({
      text: 'Добавить',
      className: 'messenger-chat-new-participant-form__button',
      events: {
        click: async () => {
          const form = {
            users: [this.props.selectedParticipantId],
            chatId: this.props.chatId,
          };

          const data = await fetchAPI.put('/chats/users', { data: form });

          if (data.status === 200) {
            this.props.onClose();
          }
        },
      },
    });

    super({
      ...props,
      input,
      button,
      participantsList,
      selectedParticipantId: 0,
    });
  }

  render() {
    return this.compile(template);
  }
}
