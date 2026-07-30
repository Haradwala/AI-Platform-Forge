/**
 * automation-timeline-publisher.ts — Timeline Event Publisher for Engineering Automation Engine
 */
import type { IDesktopEventBus } from '../../container/service-interfaces';
import { PipelineExecution, AutomationStepDefinition, AutomationStepResult } from '../contracts/automation-types';
export declare class AutomationTimelinePublisher {
    private readonly eventBus?;
    constructor(eventBus?: IDesktopEventBus | undefined);
    publishPipelineStarted(execution: PipelineExecution): void;
    publishStepStarted(execution: PipelineExecution, step: AutomationStepDefinition): void;
    publishStepFinished(execution: PipelineExecution, step: AutomationStepDefinition, result: AutomationStepResult): void;
    publishPipelineFinished(execution: PipelineExecution): void;
    private emit;
}
