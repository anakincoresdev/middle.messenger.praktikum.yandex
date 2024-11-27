import { Component } from '@/core/component.ts';
import { UIAvatar } from '@/components/ui/ui-avatar/index.ts';
import { Props } from '@/core/types/index.ts';
import './messenger-chat-participant-item.scss';

const template = `
  <div class="messenger-chat-participant-item{{#if isActive}} messenger-chat-participant-item_active{{/if}}">
    <div class="messenger-chat-participant-item__info">
        {{{ avatar }}}
        {{ name }}
    </div>
    {{{ removeBtn }}}
  </div>
`;

export class MessengerChatParticipantItem extends Component {
  constructor(props: Props) {
    super({
      ...props,
      avatar: new UIAvatar({ src: props.avatarSrc }),
    });
  }

  render() {
    return this.compile(template);
  }
}
