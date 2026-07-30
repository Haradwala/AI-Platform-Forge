import { ITaskGraph } from './task-planner';
export type ExecutionStrategyType = 'sequential' | 'parallel' | 'batch' | 'speculative' | 'conditional' | 'recovery' | 'rollback';
export interface IExecutionStrategy {
    readonly strategy: ExecutionStrategyType;
    readonly concurrencyLimit: number;
    readonly retriesAllowed: number;
    readonly rollbackEnabled: boolean;
}
export declare class ExecutionPlanner {
    determineStrategy(graph: ITaskGraph): IExecutionStrategy;
}
