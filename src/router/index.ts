import { ROUTES } from './pages.ts';
import { Route, RouteNames } from './types.ts';
import Handlebars from 'handlebars';

const byRouteName = (routeName: string) =>
  (route: Route) => route.name === routeName;

const get404PageView = () => {
  const page404= ROUTES.find(byRouteName(RouteNames.Error));

  return page404!.component;
}

const mount = (pageHTML: string, context: { [key: string]: string }) => {
  const template = Handlebars.compile(pageHTML);
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = template(context);
}

function getPageData(page: Route | undefined, context = {}) : [string, {}] {
  let pageView = '';
  let pageContext = context;

  if (page) {
    pageView = page.component;
  } else {
    pageView = get404PageView();
    pageContext = { errorCode: '404', errorText: 'Такой страницы не существует' }
  }

  return [pageView, pageContext];
}

export const navigateTo = (routeName: string) => {
  const page = ROUTES.find(byRouteName(routeName));

  mount(...getPageData(page));
}

document.addEventListener('click', e => {
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
};
