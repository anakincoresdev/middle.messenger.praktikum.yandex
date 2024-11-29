import { Component } from '@/core/component.ts';
import { MessengerSidebar } from '@/components/messenger/messenger-sidebar/index.ts';
import { MessengerCard } from '@/components/messenger/messenger-card/index.ts';
import { MessengerChat } from '@/components/messenger/messenger-chat/index.ts';
import { UIMessage } from '@/components/ui/ui-message/index.ts';
import { useUser } from '@/models/user.ts';
import { router } from '@/router/Router.ts';
import { useChat } from '@/models/chat.ts';
import './messenger-page.scss';
import { Chat } from '@/types/api/Chat.ts';

const template = `
  <section class="messenger-page">
    <div class="messenger-page__sidebar">
      {{{ sidebar }}}
    </div>
    <div class="messenger-page__main">
      {{{ chat }}}
    </div>
  </section>
`;

const { getUser, user } = useUser();
const {
  getChats,
  openChat,
  deleteChat,
  closeChat,
  getChatParticipants,
} = useChat();

const chat = new MessengerChat({
  title: 'Выберите чат',
  currentChatId: 0,
  items: [],
  isLoading: false,
});

function onChatCardClick(item: Chat) {
  return async () => {
    if (!user.data?.id) {
      return;
    }

    chat.setProps({ isLoading: true });
    closeChat();
    const socket = await openChat(item.id, user.data.id);
    const participants = await getChatParticipants(item.id);

    if (!socket) {
      return;
    }

    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'pong') {
          return;
        }

        if (Array.isArray(data)) {
          const messageComponents = data.map(
            (message) => {
              const messageUser = participants?.find((participant) => participant.id === message.user_id);
              const messageUserName = `${messageUser?.second_name} ${messageUser?.first_name}`;

              return new UIMessage({
                author: messageUserName,
                text: message.content,
                isSelfMessage: message.user_id === user.data?.id,
              });
            },
          );

          chat.setProps({
            items: messageComponents,
            title: item.title,
            currentChatId: item.id,
            isLoading: false,
          });
        } else {
          const messages = chat._lists.items.slice();
          const messageUser = participants?.find((participant) => participant.id === data.user_id);
          const messageUserName = `${messageUser?.second_name} ${messageUser?.first_name}`;

          messages.unshift(
            new UIMessage({
              author: messageUserName,
              text: data.content,
              isSelfMessage: data.user_id === user.data?.id,
            }),
          );
          chat.setProps({ items: messages, isLoading: false });
        }
      } catch (e) {
        console.error(e);
      }
    });
  };
}

async function getAndSetChatList(itemsParentComponent: Component) {
  const chats = await getChats();

  if (chats) {
    const items = chats.map(
      (item) =>
        new MessengerCard({
          name: item.title,
          message: item.last_message?.content || 'Пока нет сообщений',
          isActive: false,
          deleteChat: async () => {
            try {
              await deleteChat(item.id);
            } catch (e) {
              console.error(e);
              return;
            }
            await getAndSetChatList(itemsParentComponent);
          },
          events: {
            click() {
              onChatCardClick.bind(this)(item)();
              items.forEach((card) => {
                card.setProps({ isActive: card._id === this._id });
              });
            },
          },
        }),
    );

    itemsParentComponent.setProps({ items });
  }
}

const sidebar = new MessengerSidebar({
  items: [],
  onChatCreated: async () => {
    await getAndSetChatList(sidebar);
  },
});

export class MessengerPage extends Component {
  constructor() {
    super({
      sidebar,
      chat,
      pageTitle: 'Мессенджер',
    });
  }

  render() {
    return this.compile(template);
  }

  async componentDidMount() {
    await getUser();

    if (!user.data) {
      router.go('/');
    }

    await getAndSetChatList(sidebar);
  }
}
