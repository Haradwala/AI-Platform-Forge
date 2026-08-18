/**
 * execution-domain.ts
 *
 * Execution Domain Store — pure event store for ExecutionEvents.
 * Implements an immutable timeline of tool, file, and system execution events.
 * Contains no AI entity extraction logic (delegated to ExecutionEntityExtractor).
 */

import type { ExecutionEvent, ExecutionEventType } from '../events/execution-event';

export interface IExecutionDomain {
  emitEvent<T = Record<string, unknown>>(event: ExecutionEvent<T>): void;
  getEvents(filter?: { turnId?: string; type?: ExecutionEventType }): readonly ExecutionEvent[];
  getLatestEvent(type?: ExecutionEventType): ExecutionEvent | undefined;
  clear(): void;
}

export class ExecutionDomain implements IExecutionDomain {
  private readonly events: ExecutionEvent[] = [];

  emitEvent<T = Record<string, unknown>>(event: ExecutionEvent<T>): void {
    this.events.push(event as unknown as ExecutionEvent);
  }

  getEvents(filter?: { turnId?: string; type?: ExecutionEventType }): readonly ExecutionEvent[] {
    if (!filter) {
      return [...this.events];
    }
    return this.events.filter((e) => {
      if (filter.turnId && e.turnId !== filter.turnId) return false;
      if (filter.type && e.type !== filter.type) return false;
      return true;
    });
  }

  getLatestEvent(type?: ExecutionEventType): ExecutionEvent | undefined {
    if (!type) {
      return this.events[this.events.length - 1];
    }
    for (let i = this.events.length - 1; i >= 0; i--) {
      if (this.events[i].type === type) {
        return this.events[i];
      }
    }
    return undefined;
  }

  clear(): void {
    this.events.length = 0;
  }
}
