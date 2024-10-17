import { Block, Props } from '@/core/block.ts';
import Handlebars from 'handlebars';
import './ui-button.scss';

const buttonTemplate = `
  {{ text }}
`;

export class UIButton extends Block {
  constructor(props: Props) {
    super('button', props);
  }

  render() {
    const template = Handlebars.compile(buttonTemplate);
    return template({
      text: this.props.text,
      className: this.props.className,
    });
  }
}
