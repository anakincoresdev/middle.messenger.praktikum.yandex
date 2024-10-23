import { Component } from '@/core/component.ts';
import './ui-input-field.scss';
import { UIInput } from '@/components/ui-input/UIInput.ts';

const template = `
  <label class="ui-input-field{{#if className}} {{className}}{{/if}}">
    <div class="ui-input-field__label">{{ label }}</div>
    {{{ input }}}
  </label>
`;

export class UIInputField extends Component {
  constructor(props) {
    super({
      label: props.label,
      input: new UIInput({
        events: props.events,
        type: props.type,
        name: props.name,
        value: props.value,
      }),
    });
  }
  render() {
    console.log(2323232)
    return this.compile(template);
  }
}
