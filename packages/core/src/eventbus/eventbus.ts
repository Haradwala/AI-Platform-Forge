import { SystemEventMap } from '@forge/shared';
import { IEventBus, IEvent, TypedEventHandler } from './interface';
import { EventEmitter } from 'events';

export class EventBus implements IEventBus {
  private emitter = new EventEmitter();
  private subscriptionMap = new Map<string, { topic: string; wrapper: (...args: any[]) => void }>();
  private subCounter = 0;

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  publish<K extends keyof SystemEventMap>(topic: K, payload: SystemEventMap[K]): void {
    const event: IEvent<K> = {
      topic,
      timestamp: new Date(),
      payload
    };
    this.emitter.emit(topic as string, event);
  }

  subscribe<K extends keyof SystemEventMap>(
    topic: K,
    handler: TypedEventHandler<K>
  ): string {
    const subscriptionId = `sub_${topic as string}_${++this.subCounter}_${Math.random().toString(36).substring(2, 11)}`;
    
    const wrapper = (event: IEvent<K>) => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error(`EventBus handler error for topic ${topic as string}:`, err);
          });
        }
      } catch (err) {
        console.error(`EventBus handler error for topic ${topic as string}:`, err);
      }
    };

    this.emitter.on(topic as string, wrapper);
    this.subscriptionMap.set(subscriptionId, { topic: topic as string, wrapper });
    
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): void {
    const sub = this.subscriptionMap.get(subscriptionId);
    if (sub) {
      this.emitter.off(sub.topic, sub.wrapper);
      this.subscriptionMap.delete(subscriptionId);
    }
  }
}
