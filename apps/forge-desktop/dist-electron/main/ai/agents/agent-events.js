"use strict";
/**
 * agent-events.ts — Phase 30 Decoupled Agent Event Bus
 *
 * Emits lifecycle events: AGENT_STARTED, AGENT_PROGRESS, AGENT_WAITING, AGENT_COMPLETED, AGENT_FAILED, AGENT_CANCELLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentEventEmitter = void 0;
class AgentEventEmitter {
    listeners = [];
    onAgentEvent(listener) {
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
                console.error('[AgentEventEmitter] Error in agent listener:', err);
            }
        }
    }
}
exports.AgentEventEmitter = AgentEventEmitter;
//# sourceMappingURL=agent-events.js.map