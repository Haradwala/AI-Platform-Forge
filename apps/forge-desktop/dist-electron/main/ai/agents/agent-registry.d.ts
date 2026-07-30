/**
 * agent-registry.ts — Phase 30 Agent Registry
 *
 * Manages registration, lookup, capability matching, and assignment of role-based agents.
 */
import { AgentRole, IAgent } from './agent-types';
export declare class AgentRegistry {
    private agents;
    register(agent: IAgent): void;
    unregister(role: AgentRole): boolean;
    get(role: AgentRole): IAgent | undefined;
    list(): IAgent[];
    assign(taskCapabilities: string[]): IAgent | undefined;
    capabilities(role: AgentRole): string[];
}
