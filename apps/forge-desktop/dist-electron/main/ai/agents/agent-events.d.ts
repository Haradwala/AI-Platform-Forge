/**
 * agent-events.ts — Phase 30 Decoupled Agent Event Bus
 *
 * Emits lifecycle events: AGENT_STARTED, AGENT_PROGRESS, AGENT_WAITING, AGENT_COMPLETED, AGENT_FAILED, AGENT_CANCELLED
 */
import { AgentLifecycleEvent } from './agent-types';
export declare class AgentEventEmitter {
    private listeners;
    onAgentEvent(listener: (event: AgentLifecycleEvent) => void): () => void;
    emit(event: AgentLifecycleEvent): void;
}
