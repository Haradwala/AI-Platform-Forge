import { SystemEventMap } from '@forge/shared';

export interface IEvent<K extends keyof SystemEventMap> {
  topic: K;
  timestamp: Date;
  payload: SystemEventMap[K];
}

export type TypedEventHandler<K extends keyof SystemEventMap> = (
  event: IEvent<K>
) => void | Promise<void>;

export interface IEventBus {
  publish<K extends keyof SystemEventMap>(topic: K, payload: SystemEventMap[K]): void;
  subscribe<K extends keyof SystemEventMap>(
    topic: K,
    handler: TypedEventHandler<K>
  ): string;
  unsubscribe(subscriptionId: string): void;
}
