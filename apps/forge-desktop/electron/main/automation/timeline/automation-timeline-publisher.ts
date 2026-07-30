/**
 * automation-timeline-publisher.ts — Timeline Event Publisher for Engineering Automation Engine
 */

import type { IDesktopEventBus } from '../../container/service-interfaces';
import { PipelineExecution, AutomationStepDefinition, AutomationStepResult } from '../contracts/automation-types';
import { AutomationTimelineEventPayload } from '../contracts/automation-events';

export class AutomationTimelinePublisher {
  constructor(private readonly eventBus?: IDesktopEventBus) {}

  publishPipelineStarted(execution: PipelineExecution): void {
    this.emit('automation.pipeline.started', {
      executionId: execution.id,
      workflowId: execution.workflowId,
      workflowName: execution.workflowName,
      workspaceRoot: execution.workspaceRoot,
      status: execution.status,
      timestamp: execution.startTime,
    });
  }

  publishStepStarted(execution: PipelineExecution, step: AutomationStepDefinition): void {
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

  publishStepFinished(execution: PipelineExecution, step: AutomationStepDefinition, result: AutomationStepResult): void {
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

  publishPipelineFinished(execution: PipelineExecution): void {
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

  private emit(eventType: string, payload: AutomationTimelineEventPayload): void {
    if (this.eventBus) {
      this.eventBus.emit('engineering.timeline', {
        type: eventType,
        payload,
      });
    }
  }
}
