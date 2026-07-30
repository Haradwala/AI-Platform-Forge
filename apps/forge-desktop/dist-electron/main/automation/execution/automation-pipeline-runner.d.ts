/**
 * automation-pipeline-runner.ts — Topological DAG & Matrix Pipeline Runner
 *
 * Resolves job/step dependency graphs, handles matrix strategy fan-outs, retries transient failures,
 * enforces timeouts, and manages resource acquisition.
 */
import { AutomationWorkflowDefinition, PipelineExecution } from '../contracts/automation-types';
import { AutomationResourceScheduler } from '../scheduler/automation-resource-scheduler';
import { AutomationStepExecutor } from './automation-step-executor';
import { AutomationTimelinePublisher } from '../timeline/automation-timeline-publisher';
export declare class AutomationPipelineRunner {
    private readonly stepExecutor;
    private readonly timelinePublisher;
    private readonly resourceScheduler;
    private expressionEvaluator;
    constructor(stepExecutor: AutomationStepExecutor, timelinePublisher: AutomationTimelinePublisher, resourceScheduler?: AutomationResourceScheduler);
    /**
     * Runs an entire workflow pipeline definition and returns the execution report.
     */
    executePipeline(definition: AutomationWorkflowDefinition, inputs?: Record<string, any>): Promise<PipelineExecution>;
    private executeJob;
}
