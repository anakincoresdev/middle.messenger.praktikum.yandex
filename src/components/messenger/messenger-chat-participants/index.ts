import { Component } from '@/core/component.ts';
import './messenger-chat-participants.scss';

const template = `
  <div class="messenger-chat-participants">
    {{{ items }}}
  </div>
`;

export class MessengerChatParticipants extends Component {
  render() {
    return this.compile(template);
  }
}
