import { Component } from '@/core/component.ts';
import { Props } from '@/core/types/index.ts';
import { UILink } from '@/components/ui/ui-link/index.ts';
import './messenger-card.scss';

const template = `
  <article class="messenger-card{{#if isActive}} messenger-card_active{{/if}}">
    <div class="messenger-card__info">
      <h4>{{ name }}</h4>
      <p>{{ message }}</p>
    </div>
    {{{ deleteLink }}}
  </article>
`;

export class MessengerCard extends Component {
  constructor(props: Props) {
    const deleteLink = new UILink({
      text: '🗑',
      className: 'messenger-card__delete',
      events: {
        click() {
          props.deleteChat();
        },
      },
    });
    super({
      ...props,
      deleteLink,
    });
  }

  render() {
    return this.compile(template);
  }
}
