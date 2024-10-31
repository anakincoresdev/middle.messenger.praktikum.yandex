import { Component } from '@/core/component.ts';
import './ui-input-field.scss';
import { UIInput } from '@/components/ui/ui-input/index.ts';
import { Props } from '@/core/types/index.ts';

const template = `
  <label class="ui-input-field{{#if className}} {{className}}{{/if}}">
    <div class="ui-input-field__label">{{ label }}</div>
    {{{ input }}}
  </label>
`;

export class UIInputField extends Component {
  constructor(props: Props) {
    super({
      ...props,
      events: null,
      input: new UIInput({
        events: props.events,
        type: props.type,
        name: props.name,
        value: props.value,
        placeholder: props.placeholder,
      }),
    });
  }

  render() {
    return this.compile(template);
  }
}
