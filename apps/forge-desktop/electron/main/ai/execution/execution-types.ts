import type { IDesktopLogger } from '../../container/service-interfaces';

export type ExecutionState =
  | 'pending'
  | 'queued'
  | 'waiting'
  | 'running'
  | 'paused'
  | 'retrying'
  | 'rollingback'
  | 'completed'
  | 'cancelled'
  | 'failed';

export type TaskPriority = 'critical' | 'high' | 'normal' | 'low' | 'idle';

export type ExecutionPolicy =
  | 'simulation'
  | 'dry-run'
  | 'safe'
  | 'interactive'
  | 'auto'
  | 'dangerous'
  | 'readonly'
  | 'workspace-only';

export interface IExecutionTask {
  readonly id: string;
  readonly toolId: string;
  readonly dependencies: string[];
  readonly priority: TaskPriority;
  readonly retryLimit: number;
  readonly timeout: number;
  readonly estimatedCost: number;
  readonly executionPolicy: ExecutionPolicy;
  readonly input: any;
}

export interface IExecutionResult {
  readonly taskId: string;
  readonly toolId: string;
  readonly status: 'completed' | 'failed' | 'cancelled';
  readonly durationMs: number;
  readonly cost: number;
  readonly result?: any;
  readonly error?: string;
  readonly tokensUsed?: number;
}

export interface IExecutionBudget {
  readonly tokenBudget: number;
  readonly timeBudget: number;
  readonly costBudget: number;
  readonly fileBudget: number;
  readonly retryBudget: number;
}

export interface ToolInvocation {
  readonly toolId: string;
  readonly parameters: any;
  readonly durationMs: number;
  readonly provider: string;
  readonly tokens: number;
  readonly filesMutated: string[];
  readonly result?: any;
  readonly error?: string;
}

export interface IExecutionContext {
  readonly traceId: string;
  readonly spanId: string;
  readonly parentSpan?: string;
  readonly executionId: string;
  readonly conversationId: string;
  readonly providerId: string;
  readonly workspaceSnapshotId?: string;
  readonly budget: IExecutionBudget;
  readonly logger: IDesktopLogger;
  readonly abortSignal: AbortSignal;
  readonly featureFlags: Record<string, boolean>;
  readonly rootPath: string | null;
  readonly metadata: Record<string, any>;
}

export interface IRetryStrategy {
  getDelayMs(attempt: number, baseMs: number): number;
}

export interface ExecutionResourceLease {
  readonly leaseId: string;
  readonly cpuAllocated: number;
  readonly ramAllocated: number;
  readonly activeWorkerSlot: number;
  release(): void;
}
