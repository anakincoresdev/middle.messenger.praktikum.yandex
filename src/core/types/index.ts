export type EventName = 'click';

export type Events = Record<EventName, () => void>;

export type Props = Record<string, any>;

export type ComponentClass<T> = { new(): T };
