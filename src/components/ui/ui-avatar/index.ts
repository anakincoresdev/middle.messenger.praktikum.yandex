import './ui-avatar.scss';
import { Component } from '@/core/component.ts';

const template = `
  <div class="ui-avatar{{#if className}} {{className}}{{/if}}">
    <img src="{{#if src}}https://ya-praktikum.tech/api/v2/resources{{src}}{{else}}img/avatar.png{{/if}}" alt="Аватар" />
  </div>
`;

export class UIAvatar extends Component {
  render() {
    return this.compile(template);
  }
}
