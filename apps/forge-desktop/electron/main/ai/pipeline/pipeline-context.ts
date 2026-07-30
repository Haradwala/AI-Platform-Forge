import type { IStructuredContext } from '../../container/service-interfaces';
import type { IGoal } from '../planner/goal-extractor';
import type { IIntent } from '../planner/intent-detector';
import type { ITaskGraph } from '../planner/task-planner';
import type { IExecutionStrategy } from '../planner/execution-planner';
import type { IReasoningReport } from '../reasoning/reasoning-engine';
import type { IPlan } from '../../container/service-interfaces';
import type { IVerificationReport } from '../verification/verification-types';
import type { IRecoveryReport } from '../recovery/recovery-types';
import type { IReflectionReport } from '../reflection/reflection-engine';
import type { IExecutionOutcome } from '../outcome/outcome-types';
import type { ILearningReport } from '../learning/learning-engine';
import type { IExecutionResult } from '../execution/execution-types';

export interface PipelineTimelineEntry {
  stageName: string;
  phase: string;
  status: 'skipped' | 'completed' | 'failed';
  timestamp: string;
  durationMs: number;
}

export interface PipelineContext {
  readonly id: string;
  readonly prompt: string;
  readonly workspaceRoot: string | null;
  readonly timestamp: string;
  readonly timeline: readonly PipelineTimelineEntry[];

  readonly contextCollected?: IStructuredContext;
  readonly memoriesFetched?: any[];
  readonly intentDetected?: IIntent;
  readonly goalExtracted?: IGoal;
  readonly taskGraph?: ITaskGraph;
  readonly executionStrategy?: IExecutionStrategy;
  readonly reasoningReport?: IReasoningReport;
  readonly generatedPlan?: IPlan;
  readonly executionResults?: readonly IExecutionResult[];
  readonly verificationReport?: IVerificationReport;
  readonly recoveryReport?: IRecoveryReport | null;
  readonly reflectionReport?: IReflectionReport;
  readonly executionOutcome?: IExecutionOutcome;
  readonly learningReport?: ILearningReport;
}

export class PipelineContextHelper {
  static create(id: string, prompt: string, workspaceRoot: string | null): PipelineContext {
    return {
      id,
      prompt,
      workspaceRoot,
      timestamp: new Date().toISOString(),
      timeline: [],
    };
  }

  static cloneWith(context: PipelineContext, updates: Partial<PipelineContext>): PipelineContext {
    return {
      ...context,
      ...updates,
    };
  }

  static addTimeline(context: PipelineContext, entry: PipelineTimelineEntry): PipelineContext {
    return {
      ...context,
      timeline: [...context.timeline, entry],
    };
  }
}
