/**
 * agent-events.ts — Phase 30 Decoupled Agent Event Bus
 *
 * Emits lifecycle events: AGENT_STARTED, AGENT_PROGRESS, AGENT_WAITING, AGENT_COMPLETED, AGENT_FAILED, AGENT_CANCELLED
 */

import { AgentLifecycleEvent } from './agent-types';

export class AgentEventEmitter {
  private listeners: Array<(event: AgentLifecycleEvent) => void> = [];

  onAgentEvent(listener: (event: AgentLifecycleEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event: AgentLifecycleEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[AgentEventEmitter] Error in agent listener:', err);
      }
    }
  }
}
