/**
 * agent-types.ts — Phase 30 Agent Framework & Multi-Agent Orchestration Contracts
 *
 * Defines contracts for Agent Roles, Agent States, Agent Tasks, Agent Results,
 * Shared Agent Memory Entries, and Lifecycle Events.
 */
export type AgentRole = 'planner' | 'architect' | 'coder' | 'reviewer' | 'tester' | 'debugger' | 'refactorer' | 'documenter';
export type AgentState = 'IDLE' | 'SCHEDULED' | 'RUNNING' | 'WAITING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export interface AgentTask {
    id: string;
    agentRole: AgentRole;
    title: string;
    prompt: string;
    dependencies: string[];
    priority: number;
    context?: any;
    timeoutMs?: number;
}
export interface AgentResult {
    taskId: string;
    agentRole: AgentRole;
    status: AgentState;
    output: string;
    durationMs: number;
    runtimeId?: string;
    artifacts?: string[];
    diagnostics?: string[];
    actionRequests?: any[];
    error?: string;
}
export interface AgentMemoryEntry {
    id: string;
    agentRole: AgentRole;
    key: string;
    value: any;
    timestamp: number;
    workspaceRoot: string;
}
export interface AgentLifecycleEvent {
    id: string;
    taskId: string;
    agentRole: AgentRole;
    state: AgentState;
    timestamp: number;
    runtimeId?: string;
    progress?: number;
    result?: AgentResult;
    error?: string;
}
export interface IAgent {
    readonly role: AgentRole;
    readonly name: string;
    readonly description: string;
    readonly capabilities: string[];
    execute(task: AgentTask, context?: any): Promise<AgentResult>;
}
