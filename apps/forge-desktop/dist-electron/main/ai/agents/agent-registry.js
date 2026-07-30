"use strict";
/**
 * agent-registry.ts — Phase 30 Agent Registry
 *
 * Manages registration, lookup, capability matching, and assignment of role-based agents.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRegistry = void 0;
class AgentRegistry {
    agents = new Map();
    register(agent) {
        this.agents.set(agent.role, agent);
    }
    unregister(role) {
        return this.agents.delete(role);
    }
    get(role) {
        return this.agents.get(role);
    }
    list() {
        return Array.from(this.agents.values());
    }
    assign(taskCapabilities) {
        let bestAgent;
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
    capabilities(role) {
        const agent = this.agents.get(role);
        return agent ? agent.capabilities : [];
    }
}
exports.AgentRegistry = AgentRegistry;
//# sourceMappingURL=agent-registry.js.map