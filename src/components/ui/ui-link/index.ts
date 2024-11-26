import { Component } from '@/core/component.ts';
import './ui-link.scss';

const template = `
  <a class="ui-link{{#if className}} {{className}}{{/if}}">{{ text }}</a>
`;

export class UILink extends Component {
  render() {
    return this.compile(template);
  }
}
