/**
 * agent-scheduler.ts — Phase 30 Directed Acyclic Graph (DAG) Task Scheduler
 *
 * Supports dependency resolution, parallel execution, transient retries,
 * timeouts, cancellation signals, and progress events.
 */
import { AgentTask, AgentResult } from './agent-types';
import { AgentEventEmitter } from './agent-events';
export declare class AgentScheduler {
    private readonly events?;
    private cancelledTasks;
    constructor(events?: AgentEventEmitter | undefined);
    cancelTask(taskId: string): void;
    isCancelled(taskId: string): boolean;
    clearCancelled(): void;
    /**
     * Sorts tasks topologically based on dependency IDs.
     */
    buildExecutionLevels(tasks: AgentTask[]): AgentTask[][];
    /**
     * Runs tasks level by level (tasks within each level execute in parallel).
     */
    scheduleDAG(tasks: AgentTask[], executor: (task: AgentTask) => Promise<AgentResult>): Promise<Map<string, AgentResult>>;
    private emitEvent;
}
