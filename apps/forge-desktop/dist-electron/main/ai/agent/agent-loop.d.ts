/**
 * agent-loop.ts
 *
 * Phase 5 — Agent Loop.
 *
 * Generic, provider-agnostic iterative reasoning loop.
 * Flow: Goal -> Plan -> Execute -> Verify -> Reflect -> Repeat (until success or max iterations).
 *
 * Supports AbortSignal, max iteration limits, verification integration, tool execution,
 * and deterministic retry handling without provider-specific logic.
 */
import type { IAiKernel, IToolExecutionEngine, IMemoryEngine, IExecutionOrchestrator, ToolInvocation, ToolResult } from '../../container/service-interfaces';
import type { VerificationEngine } from '../verification/verification-engine';
import type { VerificationPolicy } from '../verification/verification-types';
export type AgentState = 'idle' | 'planning' | 'executing' | 'verifying' | 'reflecting' | 'completed' | 'failed' | 'cancelled';
export interface AgentStep {
    iteration: number;
    phase: AgentState;
    plan?: string;
    toolInvocations?: ToolInvocation[];
    toolResults?: ToolResult[];
    verification?: {
        passed: boolean;
        issues?: string[];
    };
    reflection?: string;
    error?: string;
    timestamp: number;
}
export interface AgentResult {
    success: boolean;
    finalState: AgentState;
    totalIterations: number;
    steps: AgentStep[];
    summary: string;
    error?: string;
    durationMs: number;
}
export interface AgentTaskOptions {
    /** Target goal or objective for the agent. */
    goal: string;
    /** Optional task context object. */
    context?: any;
    /** Maximum loop iterations allowed (default: 5). */
    maxIterations?: number;
    /** AbortSignal for cancellation. */
    signal?: AbortSignal;
    /** Verification policy to enforce during verification phase. */
    verificationPolicy?: VerificationPolicy;
    /** Workspace root path for verification engine. */
    workspaceRoot?: string | null;
    /** Optional pre-planned tool invocations per iteration (for deterministic testing/planning). */
    toolInvocations?: ToolInvocation[];
}
export interface IAgentLoop {
    runTask(options: AgentTaskOptions): Promise<AgentResult>;
}
export declare class AgentLoop implements IAgentLoop {
    private readonly aiKernel;
    private readonly toolEngine?;
    private readonly verificationEngine?;
    private readonly memoryEngine?;
    private readonly orchestrator?;
    constructor(aiKernel: IAiKernel, toolEngine?: IToolExecutionEngine | undefined, verificationEngine?: VerificationEngine | undefined, memoryEngine?: IMemoryEngine | undefined, orchestrator?: IExecutionOrchestrator | undefined);
    runTask(options: AgentTaskOptions): Promise<AgentResult>;
    private cancelResult;
}
