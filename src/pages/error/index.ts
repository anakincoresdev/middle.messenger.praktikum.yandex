import { Component } from '@/core/component.ts';
import './error.scss';

const template = `
  <div class="error-page">
    <h1>
      {{#if errorCode}}
        {{ errorCode }}
      {{else}}
        500
      {{/if}}
    </h1>
    <p class="error-page__text">
      {{#if errorText}}
        {{ errorText }}
      {{else}}
        Упс... Что-то пошло не так. Попробуйте позже.
      {{/if}}
    </p>
    <a class="link">На главную</a>
  </div>
`;

export class ErrorPage extends Component {
  constructor() {
    super({
      errorCode: '500',
    });
  }

  render() {
    return this.compile(template);
  }
}
