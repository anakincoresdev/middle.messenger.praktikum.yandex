import { Component } from '@/core/component.ts';
import './ui-input-field.scss';
import { UIInput } from '@/components/ui/ui-input/index.ts';
import { Props } from '@/core/types/index.ts';

const template = `
  <div class="ui-input-field__label">{{ label }}</div>
  {{{ input }}}
  <div class="ui-input-field__error">
    {{ errorText }}
  </div>
`;

export class UIInputField extends Component {
  constructor(props: Props) {
    super({
      label: props.label,
      errorText: props.errorText,
      attr: props.attr,
      name: props.name,
      input: new UIInput({
        attr: {
          class: 'ui-input',
        },
        events: props.events,
        type: props.type,
        name: props.name,
        value: props.value,
        placeholder: props.placeholder,
      }),
    }, 'label');
  }

  render() {
    return this.compile(template);
  }
}
