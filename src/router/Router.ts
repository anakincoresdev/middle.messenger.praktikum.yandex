import { Route } from '@/router/Route.ts';
import { ComponentClass } from '@/core/types/index.ts';

class Router<T> {
  __instance;

  routes;

  history;

  _currentRoute: Route<T> | null;

  _rootQuery = '#app';

  constructor() {
    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
  }

  use(path: string, component: ComponentClass<T>, onRouteUpdateFunc?: () => void) {
    const route = new Route(path, component, { rootQuery: this._rootQuery, onRouteUpdate: onRouteUpdateFunc });

    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = (event) => {
      this._onRoute(event.currentTarget.location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  onRouteUpdate(currentRoute: Route<T>) {
    if (currentRoute && currentRoute.onRouteUpdate) {
      currentRoute.onRouteUpdate();
    }
  }

  go(pathname) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    this._currentRoute = route;

    this.onRouteUpdate(this._currentRoute as Route<T>);

    route.navigate(pathname);
  }

  getRoute(pathname) {
    return this.routes.find((route) => route.match(pathname));
  }
}

export const router = new Router();
