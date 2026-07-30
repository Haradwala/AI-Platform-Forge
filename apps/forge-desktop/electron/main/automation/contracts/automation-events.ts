/**
 * automation-events.ts — Engineering Timeline & Lifecycle Events for Automation Engine
 */

import { PipelineExecutionStatus, AutomationStepStatus, AutomationStepResult } from './automation-types';

export type AutomationTimelineEventType =
  | 'automation.pipeline.queued'
  | 'automation.pipeline.started'
  | 'automation.pipeline.step_started'
  | 'automation.pipeline.step_finished'
  | 'automation.pipeline.completed'
  | 'automation.pipeline.failed'
  | 'automation.pipeline.cancelled';

export interface AutomationTimelineEventPayload {
  executionId: string;
  workflowId: string;
  workflowName: string;
  workspaceRoot: string;
  stepId?: string;
  stepName?: string;
  status: PipelineExecutionStatus | AutomationStepStatus;
  timestamp: number;
  durationMs?: number;
  stepResult?: AutomationStepResult;
  error?: string;
  metadata?: Record<string, any>;
}
