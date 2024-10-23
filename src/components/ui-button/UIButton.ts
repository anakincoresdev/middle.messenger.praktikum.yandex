import { Component } from '@/core/component.ts';
import { Props } from '@/core/types';
import './ui-button.scss';

const template = `
  <button class="ui-button">
    {{ text }}
  </button>
`;

export class UIButton extends Component {
  render() {
    return this.compile(template);
  }
}
