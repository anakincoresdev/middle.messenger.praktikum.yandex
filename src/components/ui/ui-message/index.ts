import { Component } from '@/core/component.ts';
import './ui-message.scss';

const template = `
  <div class="ui-message{{#if className}} {{className}}{{/if}}">
    {{ text }}
  </div>
`;

export class UIMessage extends Component {
  render() {
    return this.compile(template);
  }
}
