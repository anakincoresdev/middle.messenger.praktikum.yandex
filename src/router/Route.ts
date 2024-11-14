import { ComponentClass } from '@/core/types/index.ts';
import { render } from '@/utils/renderDOM.ts';

type RouteProps = {
  rootQuery: string;
  onRouteUpdate?: () => void;
};

export class Route<T> {
  _pathname: string;

  _componentClass: ComponentClass<T>;

  _component: T | null;

  _props: RouteProps;

  onRouteUpdate?: () => void;

  constructor(pathname: string, componentClass: ComponentClass<T>, props: RouteProps) {
    this._pathname = pathname;
    this._componentClass = componentClass;
    this._component = null;
    this._props = props;
    this.onRouteUpdate = props.onRouteUpdate;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  match(pathname: string) {
    return this._pathname === pathname;
  }

  render() {
    this._component = new this._componentClass();
    render(this._props.rootQuery, this._component);

    // this._component.show();
  }

  leave() {
    if (this._component) {
      // this._component.hide();
    }
  }
}
