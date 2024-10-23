import Handlebars from 'handlebars';
import { EventBus } from '@/core/event-bus.ts';
import { v4 as makeUUID } from 'uuid';
import { Events, Props } from '@/core/types';

export class Component {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
  };

  readonly eventBus: () => EventBus;

  private _element: HTMLElement | null = null;
  private readonly _id: string;

  props: Props;

  private _meta: {
    props: Props;
  };

  children;

  constructor(propsAndChildren: Props) {
    const { children, props } =
      this._separateChildrenFromProps(propsAndChildren);

    if (children) {
      this.children = children;
    }

    this._meta = {
      props,
    };

    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    this._id = makeUUID();
    this.props = this._makePropsProxy({ ...props, __id: this._id });

    this._registerEvents(eventBus);

    eventBus.emit(Component.EVENTS.INIT);
  }

  private _separateChildrenFromProps(propsAndChildren: Props) {
    const children: Record<string, Component> = {};
    const props: Props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Component) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  private _makePropsProxy(props: Props) {
    const self = this;

    const handler: ProxyHandler<Props> = {
      get(target: Props, prop: keyof Props) {
        const value = target[prop];

        if (typeof value === 'function') {
          return value.bind(self);
        }

        if (typeof value === 'object' && value !== null) {
          return new Proxy(value, handler);
        }

        return value;
      },
      set(target: Props, prop: keyof Props, value: any) {
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;
        self.eventBus().emit(Component.EVENTS.FLOW_RENDER);
        return true;
      },
    };

    return new Proxy(props, handler);
  }

  private _addEvents() {
    const events = this.props.events as Events;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([eventName, callback]) => {
      if (typeof callback !== 'function') {
        throw new Error('Error: Event callback must be a function');
      }
      this._element?.addEventListener(eventName, callback);
    });
  }

  private _removeEvents() {
    const events = this.props.events as Events;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([eventName, callback]) => {
      this._element?.removeEventListener(eventName, callback);
    });
  }

  compile(template: string) {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    const fragment = document.createElement('template');

    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      stub.replaceWith(child.getContent());
    });

    return fragment.content.firstElementChild as HTMLElement;
  }

  init() {
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  _registerEvents(bus: EventBus) {
    bus.on(Component.EVENTS.INIT, this.init.bind(this));
    bus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    bus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach(child => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount(): void {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  render(): HTMLElement {
    return document.createDocumentFragment().firstElementChild as HTMLElement;
  }

  _render() {
    const component = this.render();

    this._removeEvents();

    this._element = component;

    this._addEvents();
  }

  get element() {
    return this._element;
  }

  getContent() {
    return this.element;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  show() {
    const el = this.getContent();
    if (!el) {
      return;
    }
    el.style.display = 'block';
  }

  hide() {
    const el = this.getContent();
    if (!el) {
      return;
    }
    el.style.display = 'none';
  }
}
