/**
 * execution-graph-engine.ts
 *
 * Execution graph engine leveraging Phase 8 PlanningGraph for DAG validation,
 * cycle detection, topological sorting, and parallel ready-task resolution.
 */
import type { IPlan } from '../../container/service-interfaces';
import type { IExecutionTask } from './execution-types';
export interface IRunnableNode {
    readonly task: IExecutionTask;
    readonly dependencies: string[];
}
export declare class ExecutionGraphEngine {
    private readonly graph;
    build(plan: IPlan): void;
    validate(): {
        valid: boolean;
        reason?: string;
    };
    serialize(): string;
    deserialize(serialized: string): void;
    topologicalSort(): string[];
    findReadyTasks(completedTaskIds: string[]): IExecutionTask[];
    getTask(taskId: string): IExecutionTask | null;
    getAllTasks(): IExecutionTask[];
}
