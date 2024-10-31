import { Component } from '@/core/component.ts';
import './ui-button.scss';

const template = `
  <button type="button" class="ui-button{{#if className}} {{className}}{{/if}}">
    {{ text }}
  </button>
`;

export class UIButton extends Component {
  render() {
    return this.compile(template);
  }
}
