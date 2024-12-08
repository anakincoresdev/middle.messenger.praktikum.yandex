import { Component } from '@/core/component.ts';
import { Props } from '@/core/types/index.ts';
import './ui-input.scss';

const template = `
  <input
    type="{{ type }}"
    name="{{ name }}"
    value="{{ value }}"
    placeholder="{{ placeholder }}"
  >
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
