/**
 * agent-orchestrator.ts — Phase 30 Multi-Agent Orchestrator
 *
 * Coordinates multi-agent workflows, task DAG scheduling, RuntimeRouter selection,
 * RuntimeExecutionManager execution, ActionExecutor actions, and AgentMemory storage.
 */
import { AgentTask, AgentResult } from './agent-types';
import { AgentRegistry } from './agent-registry';
import { AgentScheduler } from './agent-scheduler';
import { AgentMemory } from './agent-memory';
import { AgentEventEmitter } from './agent-events';
export interface WorkflowRequest {
    id: string;
    goal: string;
    workspaceRoot: string;
    tasks?: AgentTask[];
    context?: any;
}
export interface WorkflowResult {
    workflowId: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
    durationMs: number;
    taskResults: AgentResult[];
    outputs: Record<string, string>;
    artifacts: string[];
}
export declare class AgentOrchestrator {
    private readonly runtimeRouter?;
    private readonly runtimeExecutionManager?;
    private readonly actionExecutor?;
    readonly registry: AgentRegistry;
    readonly scheduler: AgentScheduler;
    readonly memory: AgentMemory;
    readonly events: AgentEventEmitter;
    constructor(registry?: AgentRegistry, scheduler?: AgentScheduler, memory?: AgentMemory, events?: AgentEventEmitter, runtimeRouter?: any | undefined, runtimeExecutionManager?: any | undefined, actionExecutor?: any | undefined);
    /**
     * Decomposes a high-level goal into a standard multi-agent DAG pipeline if tasks are not explicitly provided.
     */
    createDefaultPipeline(goal: string): AgentTask[];
    private getRouter;
    private getExecutionManager;
    /**
     * Executes a multi-agent workflow DAG.
     */
    runWorkflow(request: WorkflowRequest): Promise<WorkflowResult>;
}
