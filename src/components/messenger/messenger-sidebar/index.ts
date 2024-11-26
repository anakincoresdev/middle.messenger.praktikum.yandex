import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui/ui-button/index.ts';
import { UIModal } from '@/components/ui/ui-modal/index.ts';
import { MessengerChatForm } from '@/components/messenger/messenger-chat-form/index.ts';
import './messenger-sidebar.scss';
import { Props } from '@/core/types/index.ts';

const template = `
  <div class="messenger-sidebar">
    <div class="messenger-sidebar__head">
    {{{ expandButton }}}
      <div>
        {{#if isNewChatWindowOpened}}
          {{{ newChatModal }}}
        {{/if}}
      </div>
    </div>
    <div class="messenger-sidebar__chats">
      {{{ items }}}
    </div>
  </div> 
`;

function toggleWindow(ctx: Component) {
  ctx.setProps({ isNewChatWindowOpened: !ctx.props.isNewChatWindowOpened });
}

export class MessengerSidebar extends Component {
  constructor(props: Props) {
    const newChatModal = new UIModal({
      title: 'Добавить чат',
      content: new MessengerChatForm({
        onChatCreated: async () => {
          await props.onChatCreated();
          toggleWindow(this);
        },
      }),
      onClose: () => {
        toggleWindow(this);
      },
    });

    const expandButton = new UIButton({
      text: 'Добавить чат',
      events: {
        click: () => {
          toggleWindow(this);
        },
      },
    });

    super({
      ...props,
      expandButton,
      newChatModal,
      isNewChatWindowOpened: false,
    });
  }

  render() {
    return this.compile(template);
  }
}
