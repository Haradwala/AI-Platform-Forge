/**
 * agent-memory.ts — Phase 30 Shared Workspace Agent Memory
 *
 * Workspace-scoped memory shared by all agents, storing plans, reasoning,
 * artifacts, diagnostics, and outputs. Persists to .forge/session/agents.json.
 */
import { AgentMemoryEntry, AgentRole } from './agent-types';
export declare class AgentMemory {
    private getMemoryFile;
    set(workspaceRoot: string, agentRole: AgentRole, key: string, value: any): Promise<AgentMemoryEntry>;
    get(workspaceRoot: string, key: string): Promise<AgentMemoryEntry | undefined>;
    getAll(workspaceRoot: string): Promise<AgentMemoryEntry[]>;
    clear(workspaceRoot: string): Promise<void>;
}
