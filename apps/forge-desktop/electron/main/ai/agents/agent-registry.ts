/**
 * agent-registry.ts — Phase 30 Agent Registry
 *
 * Manages registration, lookup, capability matching, and assignment of role-based agents.
 */

import { AgentRole, IAgent } from './agent-types';

export class AgentRegistry {
  private agents: Map<AgentRole, IAgent> = new Map();

  register(agent: IAgent): void {
    this.agents.set(agent.role, agent);
  }

  unregister(role: AgentRole): boolean {
    return this.agents.delete(role);
  }

  get(role: AgentRole): IAgent | undefined {
    return this.agents.get(role);
  }

  list(): IAgent[] {
    return Array.from(this.agents.values());
  }

  assign(taskCapabilities: string[]): IAgent | undefined {
    let bestAgent: IAgent | undefined;
    let maxMatch = -1;

    for (const agent of this.agents.values()) {
      let matchCount = 0;
      for (const cap of taskCapabilities) {
        if (agent.capabilities.includes(cap)) {
          matchCount++;
        }
      }
      if (matchCount > maxMatch) {
        maxMatch = matchCount;
        bestAgent = agent;
      }
    }

    return bestAgent;
  }

  capabilities(role: AgentRole): string[] {
    const agent = this.agents.get(role);
    return agent ? agent.capabilities : [];
  }
}
