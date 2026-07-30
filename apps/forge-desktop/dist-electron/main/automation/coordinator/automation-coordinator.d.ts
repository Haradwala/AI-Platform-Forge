/**
 * automation-coordinator.ts — Domain Coordinator for Execution Lifecycle & State Snapshots
 *
 * Owns workflow execution lifecycle, queue state, execution registry, cancellation APIs,
 * and persistence of execution snapshots to `.forge/executions/<executionId>.json`.
 */
import { AutomationWorkflowDefinition, PipelineExecution } from '../contracts/automation-types';
import { AutomationPipelineRunner } from '../execution/automation-pipeline-runner';
import { AutomationResourceScheduler } from '../scheduler/automation-resource-scheduler';
import { AutomationArtifactStore } from '../artifacts/automation-artifact-store';
export declare class AutomationCoordinator {
    private readonly pipelineRunner;
    private readonly resourceScheduler;
    private readonly artifactStore;
    private activeExecutions;
    constructor(pipelineRunner: AutomationPipelineRunner, resourceScheduler?: AutomationResourceScheduler, artifactStore?: AutomationArtifactStore);
    /**
     * Enqueues and coordinates the execution of a workflow pipeline.
     */
    executeWorkflow(definition: AutomationWorkflowDefinition, inputs?: Record<string, any>): Promise<PipelineExecution>;
    /**
     * Cancels a running workflow pipeline execution.
     */
    cancelExecution(executionId: string): Promise<boolean>;
    /**
     * Gets an execution by ID from active memory or snapshot storage.
     */
    getExecution(workspaceRoot: string, executionId: string): Promise<PipelineExecution | null>;
    /**
     * Lists all execution snapshots stored in `.forge/executions/`.
     */
    listExecutions(workspaceRoot: string): Promise<PipelineExecution[]>;
    private persistExecution;
}
