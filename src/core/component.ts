import Handlebars from 'handlebars';
import { EventBus } from '@/core/event-bus.ts';
import { v4 as makeUUID } from 'uuid';
import { Events, Props } from '@/core/types/index.ts';

export abstract class Component {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  readonly eventBus: () => EventBus;

  private _element: Node;

  readonly _id: string;

  props: Props;

  _props: Props;

  _isUpdate: boolean = false;

  _children;

  _lists;

  tag: string;

  constructor(propsAndChildren: Props, tag: string = 'div') {
    const { children, props, lists } = this._separateProps(propsAndChildren);

    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    this._props = props;

    this.tag = tag;

    this._id = makeUUID();

    this._element = document.createElement(this.tag);

    this.props = this._makePropsProxy({ ...props, __id: this._id });
    this._children = this._makePropsProxy(children);
    this._lists = this._makePropsProxy(lists);

    this._registerEvents(eventBus);

    eventBus.emit(Component.EVENTS.INIT);
  }

  private _separateProps(propsAndChildren: Props) {
    const children: Record<string, Component> = {};
    const props: Props = {};
    const lists: Props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Component) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    this._isUpdate = false;
    const oldProps = { ...this.props };

    const { children, props, lists } = this._separateProps(nextProps);

    Object.assign(this._children, children);
    Object.assign(this._lists, lists);
    Object.assign(this.props, props);

    if (this._isUpdate) {
      this.eventBus().emit(Component.EVENTS.FLOW_CDU, oldProps, this.props);
      this._isUpdate = false;
    }
  };

  private _makePropsProxy(props: Props) {
    const handler: ProxyHandler<Props> = {
      get: (target: Props, prop: keyof Props) => {
        const value = target[prop];

        if (typeof value === 'function') {
          return value.bind(this);
        }

        return value;
      },
      set: (target: Props, prop: keyof Props, value: any) => {
        if (target[prop] !== value) {
          /* eslint-disable-next-line no-param-reassign */
          target[prop] = value;
          this._isUpdate = true;
        }
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

      this._element?.addEventListener(eventName, callback.bind(this));
    });
  }

  private _addAttributes() {
    const attr = this.props.attr as Record<string, string>;

    if (!attr) {
      return;
    }

    Object.entries(attr).forEach(([key, value]) => {
      (this._element as HTMLElement).setAttribute(key, value);
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

    Object.entries(this._children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this._lists).forEach((list) => {
      const key = list[0];
      propsAndStubs[key] = `<div data-id="list_${key}"></div>`;
    });

    const fragment = document.createElement('template');

    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this._children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this._lists).forEach(([key, list]) => {
      const stub = fragment.content.querySelector(`[data-id="list_${key}"]`);

      if (!stub) {
        return;
      }

      const listFragment = document.createElement('template');

      list.forEach((item: Component | string) => {
        if (item instanceof Component) {
          const content = item.getContent();
          if (content) {
            listFragment.content.append(content);
          } else {
            throw new Error('Error: component has no content');
          }
        } else {
          listFragment.content.append(item);
        }
      });

      stub.replaceWith(listFragment.content);
    });

    return fragment.content;
  }

  init() {
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  _registerEvents(bus: EventBus) {
    bus.on(Component.EVENTS.INIT, this.init.bind(this));
    bus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    bus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    bus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _componentDidMount() {
    this.componentDidMount();

    Object.values(this._children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount(): void {}

  componentDidUpdate([oldProps, nextProps]: Props[]): boolean {
    return Boolean(oldProps) && Boolean(nextProps);
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate([oldProps, nextProps]: Props[]) {
    const isReRender = this.componentDidUpdate([oldProps, nextProps]);
    if (isReRender) {
      this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
    }
  }

  render(): DocumentFragment {
    return document.createDocumentFragment();
  }

  _render() {
    const component = this.render();

    this._removeEvents();

    (this._element as HTMLElement).innerHTML = '';
    this._element.appendChild(component);

    this._addAttributes();
    this._addEvents();
  }

  get element() {
    return this._element;
  }

  getContent() {
    return this.element;
  }
}
