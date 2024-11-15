import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { MessengerSidebar } from '@/components/messenger/messenger-sidebar/index.ts';
import { MessengerCard } from '@/components/messenger/messenger-card/index.ts';
import { MessengerChat } from '@/components/messenger/messenger-chat/index.ts';
import { UIMessage } from '@/components/ui/ui-message/index.ts';
import './messenger-page.scss';
import { useUser } from '@/models/user.ts';
import { router } from '@/router/Router.ts';
import { useChat } from '@/models/chat.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';

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

const { getUser } = useUser();
const { getChats, createChat, openChat } = useChat();

const chat = new MessengerChat({
  items: [
    new UIMessage({
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
    }),
    new UIMessage({
      text: 'Ок.',
      isSelfMessage: true,
    }),
  ].reverse(),
});

const newChatForm = {
  title: '',
};

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
  text: '+',
  events: {
    click: async () => {
      if (newChatForm.title) {
        await createChat(newChatForm.title);
        newChatForm.title = '';
        newChatInput.setProps({ value: '' });
      }
    },
  },
});

const sidebar = new MessengerSidebar({
  className: 'asdasdaw',
  items: [],
  newChatInput,
  newChatButton,
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
    const user = await getUser();

    if (!user) {
      router.go('/');
    }

    const chats = await getChats();
    if (chats) {
      const items = chats.reduce((acc, item) => {
        acc.push(
          new MessengerCard({
            name: item.title,
            message: item.last_message || 'Пока нет сообщений',
            events: {
              click: () => openChat(item.id),
            },
          }),
        );
        return acc;
      }, []);

      sidebar.setProps({ items });
    }
  }
}
