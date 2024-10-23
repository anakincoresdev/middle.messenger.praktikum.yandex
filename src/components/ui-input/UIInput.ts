import { Component } from '@/core/component.ts';
import { Props } from '@/core/types';
import './ui-input.scss';

const template = `
  <div class="ui-input{{#if className}} {{className}}{{/if}}">
    <input
      class="ui-input__input"
      type="{{ type }}"
      name="{{ name }}"
      value="{{ value }}"
    >
  </div>
`;

export class UIInput extends Component {
  constructor(props: Props) {
    super({
      ...props,
      type: props.type || 'text',
    });
  }

  render() {
    return this.compile(template);
  }
}
