type EmitProps = any | undefined;
type Callback = (args: EmitProps) => void;
type Listeners = Record<string, Array<Callback>>;

function throwErrorIfEventNotListened(listeners: Listeners, eventName: string) {
  if (!listeners[eventName]) {
    throw new Error(`There is no handler for "${eventName}" event`);
  }
}

export class EventBus {
  private readonly listeners: Listeners;

  constructor() {
    this.listeners = {};
  }

  on(eventName: string, callback: () => void) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  off(eventName: string, callback: Callback) {
    throwErrorIfEventNotListened(this.listeners, eventName);

    this.listeners[eventName] = this.listeners[eventName].filter(
      (listener) => listener !== callback,
    );
  }

  emit(eventName: string, props?: EmitProps) {
    throwErrorIfEventNotListened(this.listeners, eventName);

    this.listeners[eventName].forEach((listener) => {
      listener(props);
    });
  }
}