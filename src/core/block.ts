import { EventBus } from '@/core/event-bus.ts';
import Handlebars from 'handlebars';

export type Props = Record<string, any>;

export class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
  };

  readonly eventBus: () => EventBus;

  _element: HTMLElement;

  props: Props;

  _meta: {
    tagName: string;
    props: Props;
  };

  constructor(tagName = 'div', props = {}) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;
    this._meta = {
      tagName,
      props,
    };
    this.props = this._makePropsProxy(props);
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
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
        self.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        return true;
      },
    };

    return new Proxy(props, handler);
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _registerEvents(bus: EventBus) {
    bus.on(Block.EVENTS.INIT, this.init.bind(this));
    bus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    bus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createDocumentElement() {
    const documentElement = document.createElement(this._meta.tagName);
    if (this.props.className) {
      documentElement.classList.add(this.props.className);
    }
    return documentElement;
  }

  _createResources() {
    this._element = this._createDocumentElement();
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  componentDidMount() {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  render(): string

  _render() {
    const block = this.render();

    if (this._element && block) {
      this._element.innerHTML = block;
    }
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

  _componentDidUpdate() {}

  componentDidUpdate() {
    return true;
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
