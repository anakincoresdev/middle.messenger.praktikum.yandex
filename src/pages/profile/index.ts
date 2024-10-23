import { Component } from '@/core/component.ts';
import { UIButton } from '@/components/ui-button/UIButton.ts';

const template = `
  <div>
    {{ userName }}
    {{{ button }}}
  </div>
`;

const button = new UIButton({
  text: 'Кнопка',
  className: 'ui-button',
  withInternalID: true,
  events: {
    click() {
      console.log(123123123);
    },
  },
});

export class ProfilePage extends Component {
  constructor() {
    super({
      button,
      userName: 'Профиль',
    });
  }

  render() {
    return this.compile(template);
  }
}
