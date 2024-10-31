import { Component } from '@/core/component.ts';
import { UIInputField } from '@/components/ui/ui-input-field/index.ts';
import { MessengerSidebar } from '@/components/messenger/messenger-sidebar/index.ts';
import './messenger-page.scss';
import { MessengerCard } from '@/components/messenger/messenger-card/index.ts';
import { MessengerChat } from '@/components/messenger/messenger-chat/index.ts';
import { UIMessage } from '@/components/ui/ui-message';

const template = `
  <section class="messenger-page">
    <div class="messenger-page__sidebar">
      {{{ sidebar }}}
    </div>
    <div class="messenger-page__main">
      {{{ chat }}}
    </div>
  </section>
`;

export class MessengerPage extends Component {
  constructor() {
    const searchInput = new UIInputField({
      placeholder: 'Поиск',
      name: 'search',
    });
    const sideBarItems = [
      new MessengerCard({
        name: 'Иван Иванов',
        message: 'Lorem ipsum',
        className: 'messenger-page__card',
      }),
      new MessengerCard({
        name: 'Евгений Сидоров',
        message: 'Lorem ipsum ыфвфыв фывфывф фывфцв',
        className: 'messenger-page__card',
      }),
    ];
    const chat = new MessengerChat({
      items: [
        new UIMessage({
          text: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
           Deleniti facere facilis mollitia nulla odit provident quod repellat,
            tenetur. Aspernatur consequuntur ea impedit, ratione recusandae
             temporibus vero? Ducimus eos fugiat libero nulla, pariatur tenetur
              veniam vitae. Ad animi blanditiis dolor doloremque dolores et ex
               fuga illo impedit, laboriosam laborum modi neque quam quis sed
                tempora voluptate? Consectetur dolor esse harum libero minus 
                non numquam obcaecati vel velit veniam! A accusamus deleniti 
                numquam pariatur rem sint voluptatibus? Ab animi aut est, facere
                 officia sed voluptatum. Aliquid autem commodi cumque distinctio
                  eaque, fuga ipsam magnam molestiae officia placeat quaerat quia
                   repellat repellendus voluptas?`,
        }),
        new UIMessage({
          text: 'Ок.',
          className: 'ui-message_self',
        }),
      ].reverse(),
    });
    const sidebar = new MessengerSidebar({
      className: 'asdasdaw',
      items: sideBarItems,
      input: searchInput,
    });
    super({
      sidebar,
      chat,
      pageTitle: 'Мессенджер',
    });
  }

  render() {
    return this.compile(template);
  }
}
