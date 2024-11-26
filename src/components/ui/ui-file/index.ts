import { Component } from '@/core/component.ts';
import './ui-file.scss';

const template = `
  <label class="ui-file">
    Сменить аватар
    <input
      type="file"
      accept=".jpg,.jpeg,.png"
    />
  </label>
`;

export class UIFile extends Component {
  render() {
    return this.compile(template);
  }
}
