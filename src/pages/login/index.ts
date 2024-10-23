import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui-button/UIButton.ts';

const template = `
  <div>
    {{ pageTitle }}
    {{{ button }}}
  </div>
`;

const button = new UIButton({
  text: 'Войти',
  className: 'ui-button',
});

export class LoginPage extends Component {
  constructor() {
    console.log('login page');
    super({
      button,
      pageTitle: 'Логин',
    });
  }

  render() {
    return this.compile(template);
  }
}
