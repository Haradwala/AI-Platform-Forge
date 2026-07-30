/**
 * execution-orchestrator.ts
 *
 * Phase 8 — Execution Orchestrator.
 *
 * Central coordinator for all AI foundation subsystems:
 *  1. MemoryEngine (retrieve)
 *  2. ContextEngine (gather snapshot)
 *  3. PlanningGraph (build DAG & topological order)
 *  4. PromptAssemblyEngine (assemble prompt)
 *  5. RuntimeManager (stream response)
 *  6. ToolExecutionEngine (execute tools)
 *  7. VerificationEngine (verify results)
 *  8. ReflectionEngine (reflect on errors)
 *  9. MemoryEngine (store & consolidate)
 *
 * No subsystem should bypass ExecutionOrchestrator.
 */
import type { IRuntimeManager, IToolExecutionEngine, IContextEngine, IMemoryEngine, ToolInvocation, ToolResult } from '../../container/service-interfaces';
import { PlanningGraph } from '../planner/planning-graph';
import { PromptAssemblyEngine, type AssembledPrompt } from '../context/prompt-assembly-engine';
import type { VerificationEngine } from '../verification/verification-engine';
import type { VerificationPolicy } from '../verification/verification-types';
import type { ReflectionEngine } from '../reflection/reflection-engine';
export interface OrchestrationRequest {
    /** User goal or task objective. */
    goal: string;
    /** Optional pre-planned tool invocations. */
    toolInvocations?: ToolInvocation[];
    /** Verification policy to enforce. */
    verificationPolicy?: VerificationPolicy;
    /** Workspace root path. */
    workspaceRoot?: string | null;
    /** AbortSignal for cancellation. */
    signal?: AbortSignal;
    /** Task context override options. */
    contextOptions?: any;
}
export interface OrchestrationResult {
    success: boolean;
    assembledPrompt: AssembledPrompt;
    response: string;
    toolResults: ToolResult[];
    verificationPassed: boolean;
    verificationIssues?: string[];
    reflection?: string;
    error?: string;
    durationMs: number;
}
export interface IExecutionOrchestrator {
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
}
export declare class ExecutionOrchestrator implements IExecutionOrchestrator {
    private readonly runtimeManager;
    private readonly toolEngine?;
    private readonly contextEngine?;
    private readonly memoryEngine?;
    private readonly verificationEngine?;
    private readonly reflectionEngine?;
    private readonly planningGraph;
    private readonly promptEngine;
    constructor(runtimeManager: IRuntimeManager, toolEngine?: IToolExecutionEngine | undefined, contextEngine?: IContextEngine | undefined, memoryEngine?: IMemoryEngine | undefined, verificationEngine?: VerificationEngine | undefined, reflectionEngine?: ReflectionEngine | undefined, promptEngine?: PromptAssemblyEngine, planningGraph?: PlanningGraph);
    execute(request: OrchestrationRequest): Promise<OrchestrationResult>;
}
