import './ui-avatar.scss';
import { Component } from '@/core/component.ts';

const template = `
  <div class="ui-avatar{{#if className}} {{className}}{{/if}}">
    <img src="{{#if src}}{{src}}{{/if}}img/avatar.png" alt="Аватар" />
  </div>
`;

export class UIAvatar extends Component {
  render() {
    return this.compile(template);
  }
}
