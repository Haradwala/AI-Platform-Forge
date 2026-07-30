/**
 * action-events.ts — Phase 29 Decoupled Action Event Bus
 *
 * Emits lifecycle events: REQUESTED -> VALIDATED -> STARTED -> COMPLETED/FAILED/CANCELLED
 */

import { ActionLifecycleEvent } from './action-types';

export class ActionEventEmitter {
  private listeners: Array<(event: ActionLifecycleEvent) => void> = [];

  onActionEvent(listener: (event: ActionLifecycleEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event: ActionLifecycleEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[ActionEventEmitter] Error in action listener:', err);
      }
    }
  }
}
