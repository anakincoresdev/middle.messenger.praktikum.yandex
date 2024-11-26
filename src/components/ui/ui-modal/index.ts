import { Component } from '@/core/component.ts';
import { UILink } from '@/components/ui/ui-link/index.ts';
import { Props } from '@/core/types/index.ts';
import './ui-modal.scss';

const template = `
  <div class="ui-modal__content">
    <div class="ui-modal__head">
      <h2 class="ui-modal__title">{{ title }}</h2>
      <div class="ui-modal__close">{{{ closeLink }}}</div>
    </div>
    {{{ content }}}
  </div> 
`;

export class UIModal extends Component {
  constructor(props: Props) {
    const closeLink = new UILink({
      text: 'Закрыть',
      events: {
        click: props.onClose,
      },
    });
    super({
      ...props,
      closeLink,
      attr: {
        class: 'ui-modal',
      },
    });
  }

  render() {
    return this.compile(template);
  }
}
