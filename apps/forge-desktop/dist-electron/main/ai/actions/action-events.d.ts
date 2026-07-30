/**
 * action-events.ts — Phase 29 Decoupled Action Event Bus
 *
 * Emits lifecycle events: REQUESTED -> VALIDATED -> STARTED -> COMPLETED/FAILED/CANCELLED
 */
import { ActionLifecycleEvent } from './action-types';
export declare class ActionEventEmitter {
    private listeners;
    onActionEvent(listener: (event: ActionLifecycleEvent) => void): () => void;
    emit(event: ActionLifecycleEvent): void;
}
