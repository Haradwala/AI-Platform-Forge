"use strict";
/**
 * automation-timeline-publisher.ts — Timeline Event Publisher for Engineering Automation Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationTimelinePublisher = void 0;
class AutomationTimelinePublisher {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publishPipelineStarted(execution) {
        this.emit('automation.pipeline.started', {
            executionId: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflowName,
            workspaceRoot: execution.workspaceRoot,
            status: execution.status,
            timestamp: execution.startTime,
        });
    }
    publishStepStarted(execution, step) {
        this.emit('automation.pipeline.step_started', {
            executionId: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflowName,
            workspaceRoot: execution.workspaceRoot,
            stepId: step.id,
            stepName: step.name,
            status: 'RUNNING',
            timestamp: Date.now(),
        });
    }
    publishStepFinished(execution, step, result) {
        this.emit('automation.pipeline.step_finished', {
            executionId: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflowName,
            workspaceRoot: execution.workspaceRoot,
            stepId: step.id,
            stepName: step.name,
            status: result.status,
            timestamp: Date.now(),
            durationMs: result.durationMs,
            stepResult: result,
            error: result.error,
        });
    }
    publishPipelineFinished(execution) {
        const eventType = execution.status === 'COMPLETED' ? 'automation.pipeline.completed' : 'automation.pipeline.failed';
        this.emit(eventType, {
            executionId: execution.id,
            workflowId: execution.workflowId,
            workflowName: execution.workflowName,
            workspaceRoot: execution.workspaceRoot,
            status: execution.status,
            timestamp: execution.endTime || Date.now(),
            durationMs: execution.durationMs,
            error: execution.error,
        });
    }
    emit(eventType, payload) {
        if (this.eventBus) {
            this.eventBus.emit('engineering.timeline', {
                type: eventType,
                payload,
            });
        }
    }
}
exports.AutomationTimelinePublisher = AutomationTimelinePublisher;
//# sourceMappingURL=automation-timeline-publisher.js.map