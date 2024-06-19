import './styles/main.scss'
import initRouter from './router';
import * as Components from '@/components/index.ts';
import Handlebars from 'handlebars';

Object.entries(Components).forEach(([ name, component ]) => {
  Handlebars.registerPartial(name, component);
})

initRouter();
