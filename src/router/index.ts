import Handlebars from 'handlebars';
import { render } from '@/utils/renderDOM.ts';
import { ROUTES } from './pages.ts';
import { Route, RouteNames } from './types.ts';

const byRouteName = (routeName: string) => (route: Route) =>
  route.name === routeName;

const get404PageView = () => {
  const page404 = ROUTES.find(byRouteName(RouteNames.Error));

  return page404!.component;
};

const mount = (page: string) => {
  render('#app', page.component);
};

function getPageData(page: Route | undefined, context = {}): [string, {}] {
  let pageView = '';
  let pageContext = context;

  if (page) {
    pageView = page.component;
  } else {
    pageView = get404PageView();
    pageContext = {
      errorCode: '404',
      errorText: 'Такой страницы не существует',
    };
  }

  return [pageView, pageContext];
}

export const navigateTo = (routeName: string) => {
  const page = ROUTES.find(byRouteName(routeName));

  mount(page);
};

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const routeName = target.getAttribute('page');
  if (routeName) {
    navigateTo(routeName);

    e.preventDefault();
    e.stopImmediatePropagation();
  }
});

export default function initRouter() {
  const { pathname } = window.location;
  const routeName = pathname.replace('/', '');

  navigateTo(routeName || RouteNames.Login);
}
