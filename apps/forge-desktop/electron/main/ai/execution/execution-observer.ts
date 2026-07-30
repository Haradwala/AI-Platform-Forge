import type { ExecutionEvent } from './execution-events';

export type ExecutionObserverCallback = (event: ExecutionEvent) => void;

export class ExecutionObserver {
  private readonly callbacks = new Set<ExecutionObserverCallback>();

  subscribe(callback: ExecutionObserverCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  notify(event: ExecutionEvent): void {
    for (const callback of this.callbacks) {
      try {
        callback(event);
      } catch (err) {
        console.error('[ExecutionObserver] Listener threw error:', err);
      }
    }
  }

  clear(): void {
    this.callbacks.clear();
  }
}
