import { Component } from '@/core/component.ts';
import './messenger-sidebar.scss';

const template = `
  <div class="messenger-sidebar">
    <div class="messenger-sidebar__head">
      {{{ input }}}
    </div>
    {{{ items }}}
  </div> 
`;

export class MessengerSidebar extends Component {
  render() {
    return this.compile(template);
  }
}
