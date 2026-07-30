import type { ExecutionState } from './execution-types';
export interface BaseExecutionEvent {
    readonly eventId: string;
    readonly type: string;
    readonly executionId: string;
    readonly timestamp: string;
}
export interface ExecutionQueuedEvent extends BaseExecutionEvent {
    readonly type: 'execution:queued';
    readonly planId: string;
}
export interface ExecutionStartedEvent extends BaseExecutionEvent {
    readonly type: 'execution:started';
    readonly planId: string;
    readonly tasksCount: number;
}
export interface ExecutionProgressEvent extends BaseExecutionEvent {
    readonly type: 'execution:progress';
    readonly taskId: string;
    readonly state: ExecutionState;
    readonly progressPercentage: number;
    readonly elapsedMs: number;
    readonly error?: string;
    readonly result?: any;
}
export interface ExecutionPausedEvent extends BaseExecutionEvent {
    readonly type: 'execution:paused';
}
export interface ExecutionRetriedEvent extends BaseExecutionEvent {
    readonly type: 'execution:retry';
    readonly taskId: string;
    readonly attempt: number;
    readonly delayMs: number;
    readonly error: string;
}
export interface ExecutionCompletedEvent extends BaseExecutionEvent {
    readonly type: 'execution:completed';
    readonly planId: string;
    readonly durationMs: number;
    readonly cost: number;
}
export interface ExecutionFailedEvent extends BaseExecutionEvent {
    readonly type: 'execution:failed';
    readonly planId: string;
    readonly error: string;
    readonly durationMs: number;
}
export interface ExecutionCancelledEvent extends BaseExecutionEvent {
    readonly type: 'execution:cancelled';
    readonly planId: string;
}
export interface ExecutionRollbackEvent extends BaseExecutionEvent {
    readonly type: 'execution:rollback';
    readonly targetCheckpointId: string;
    readonly affectedTaskIds: string[];
}
export type ExecutionEvent = ExecutionQueuedEvent | ExecutionStartedEvent | ExecutionProgressEvent | ExecutionPausedEvent | ExecutionRetriedEvent | ExecutionCompletedEvent | ExecutionFailedEvent | ExecutionCancelledEvent | ExecutionRollbackEvent;
