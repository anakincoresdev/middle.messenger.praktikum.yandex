import { render } from '@/utils/renderDOM.ts';
import { ROUTES } from './pages.ts';
import { Route, RouteNames } from './types.ts';

const byRouteName = (routeName: string) => (route: Route) =>
  route.name === routeName;

const mount = (page: Route) => {
  const pageComponent = page.component();
  render('#app', pageComponent);
};

export const navigateTo = (routeName: string) => {
  const page = ROUTES.find(byRouteName(routeName));

  if (!page) {
    throw new Error('Error: This page does not exist');
  }

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
