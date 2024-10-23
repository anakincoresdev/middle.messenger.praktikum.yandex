import Handlebars from 'handlebars';
import './styles/main.scss';
import * as Components from '@/components/index.ts';
import initRouter from './router/index.ts';

Object.entries(Components).forEach(([name, component]) => {
  Handlebars.registerPartial(name, component);
});

Handlebars.registerHelper('list', (context, options) => {
  let ret = '';

  for (let i = 0, j = context.length; i < j; i++) {
    ret += `<div data-id="${context[i]._id}"></div>`;
  }

  return options.fn(ret);
});

initRouter();
