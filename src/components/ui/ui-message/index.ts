import { Component } from '@/core/component.ts';
import './ui-message.scss';

const template = `
  <div class="ui-message{{#if isSelfMessage}} ui-message_self{{/if}}">
    <div class="ui-message__author">{{ author }}</div>
    {{ text }}
  </div>
`;

export class UIMessage extends Component {
  render() {
    return this.compile(template);
  }
}
