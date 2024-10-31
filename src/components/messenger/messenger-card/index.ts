import { Component } from '@/core/component.ts';
import { UIAvatar } from '@/components/index.ts';
import { Props } from '@/core/types/index.ts';
import './messenger-card.scss';

const template = `
  <article class="messenger-card">
    {{{ avatar }}}
    <div class="messenger-card__info">
      <h4>{{ name }}</h4>
      <p>{{ message }}</p>
    </div>
  </article>
`;

export class MessengerCard extends Component {
  constructor(props: Props) {
    super({
      ...props,
      avatar: new UIAvatar({ className: 'messenger-card__avatar' }),
    });
  }

  render() {
    return this.compile(template);
  }
}
