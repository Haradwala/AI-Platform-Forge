"use strict";
/**
 * action-events.ts — Phase 29 Decoupled Action Event Bus
 *
 * Emits lifecycle events: REQUESTED -> VALIDATED -> STARTED -> COMPLETED/FAILED/CANCELLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionEventEmitter = void 0;
class ActionEventEmitter {
    listeners = [];
    onActionEvent(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    emit(event) {
        for (const listener of this.listeners) {
            try {
                listener(event);
            }
            catch (err) {
                console.error('[ActionEventEmitter] Error in action listener:', err);
            }
        }
    }
}
exports.ActionEventEmitter = ActionEventEmitter;
//# sourceMappingURL=action-events.js.map