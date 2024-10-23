import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui-button/UIButton.ts';
import { UIInputField } from '@/components/ui-input-field/UIInputField.ts';

const template = `
  <div>
    {{ pageTitle }}
    {{#list inputs}}
      {{{ this.element }}}
    {{/list}}
    {{{ sendButton }}}
  </div>
`;

export class MessengerPage extends Component {
  constructor() {
    const input = new UIInputField({
      className: 'asdwdawd',
      label: 'Сообщение',
      name: 'message',
      events: {
        input(evt) {
          console.log('oninput', evt.target.value);
        },
      },
    });
    super({
      sendButton: new UIButton({
        text: 'Отправить',
      }),
      inputs: [input],
      pageTitle: 'Мессенджер',
    });
  }

  render() {
    return this.compile(template);
  }
}
