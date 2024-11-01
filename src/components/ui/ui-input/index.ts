import { Component } from '@/core/component.ts';
import { Props } from '@/core/types/index.ts';
import './ui-input.scss';

const template = `
  <input
    class="ui-input"
    type="{{ type }}"
    name="{{ name }}"
    value="{{ value }}"
    placeholder="{{ placeholder }}"
  >
`;

export class UIInput extends Component {
  constructor(props: Props) {
    console.log('input constructor');
    super({
      ...props,
      type: props.type || 'text',
    });
  }

  render() {
    console.log('input render');
    return this.compile(template);
  }
}
