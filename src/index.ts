import './styles/main.scss';
import * as Components from '@/components/index.ts';
import Handlebars from 'handlebars';
import { UIButton } from '@/components/ui-button/UIButton.ts';
import { render } from '@/utils/renderDOM.ts';
import initRouter from './router';

Object.entries(Components).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component);
});

const button = new UIButton({ text: 'Кнопка', className: 'ui-button' });

render('#app', button);

// setTimeout(() => {
//   button.setProps({ text: 'Кнопка обновлена' });
// }, 2000);

initRouter();
