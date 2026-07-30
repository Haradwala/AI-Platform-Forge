import type { IRetryStrategy, IExecutionResult } from './execution-types';
import type { ExecutionGraphEngine } from './execution-graph-engine';
import type { TaskDispatcher } from './task-dispatcher';
import type { ExecutionBudgetTracker } from './execution-budget';
import type { ExecutionObserver } from './execution-observer';
export declare class ExponentialRetry implements IRetryStrategy {
    getDelayMs(attempt: number, baseMs: number): number;
}
export declare class LinearRetry implements IRetryStrategy {
    getDelayMs(attempt: number, baseMs: number): number;
}
export declare class ExecutionScheduler {
    private readonly dispatcher;
    private readonly observer;
    private readonly retryStrategy;
    private readonly completedTasks;
    private readonly runningTasks;
    constructor(dispatcher: TaskDispatcher, observer: ExecutionObserver, retryStrategy: IRetryStrategy);
    schedule(graph: ExecutionGraphEngine, budgetTracker: ExecutionBudgetTracker, abortSignal: AbortSignal, executionId: string, planId: string): Promise<IExecutionResult[]>;
}
