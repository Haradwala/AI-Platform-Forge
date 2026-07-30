"use strict";
/**
 * agent-scheduler.ts — Phase 30 Directed Acyclic Graph (DAG) Task Scheduler
 *
 * Supports dependency resolution, parallel execution, transient retries,
 * timeouts, cancellation signals, and progress events.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentScheduler = void 0;
class AgentScheduler {
    events;
    cancelledTasks = new Set();
    constructor(events) {
        this.events = events;
    }
    cancelTask(taskId) {
        this.cancelledTasks.add(taskId);
    }
    isCancelled(taskId) {
        return this.cancelledTasks.has(taskId);
    }
    clearCancelled() {
        this.cancelledTasks.clear();
    }
    /**
     * Sorts tasks topologically based on dependency IDs.
     */
    buildExecutionLevels(tasks) {
        const levels = [];
        const completed = new Set();
        const remaining = [...tasks];
        while (remaining.length > 0) {
            const ready = remaining.filter((t) => t.dependencies.every((depId) => completed.has(depId)));
            if (ready.length === 0) {
                // Break potential cycle by taking first remaining task
                const forced = remaining.shift();
                levels.push([forced]);
                completed.add(forced.id);
            }
            else {
                levels.push(ready);
                for (const r of ready) {
                    completed.add(r.id);
                    const idx = remaining.indexOf(r);
                    if (idx >= 0)
                        remaining.splice(idx, 1);
                }
            }
        }
        return levels;
    }
    /**
     * Runs tasks level by level (tasks within each level execute in parallel).
     */
    async scheduleDAG(tasks, executor) {
        const results = new Map();
        const levels = this.buildExecutionLevels(tasks);
        let totalTasks = tasks.length;
        let completedCount = 0;
        for (const level of levels) {
            const levelPromises = level.map(async (task) => {
                if (this.isCancelled(task.id)) {
                    const cancelRes = {
                        taskId: task.id,
                        agentRole: task.agentRole,
                        status: 'CANCELLED',
                        output: '',
                        durationMs: 0,
                        error: `Task ${task.id} was cancelled before execution.`,
                    };
                    this.emitEvent(task, 'CANCELLED', 0, cancelRes);
                    return cancelRes;
                }
                this.emitEvent(task, 'RUNNING', (completedCount / totalTasks) * 100);
                // Execute task with retries for transient failure
                let attempts = 0;
                const maxAttempts = 2;
                let lastResult = null;
                while (attempts < maxAttempts) {
                    attempts++;
                    try {
                        const timeoutMs = task.timeoutMs || 30000;
                        const res = await Promise.race([
                            executor(task),
                            new Promise((_, reject) => setTimeout(() => reject(new Error(`Task ${task.id} timed out after ${timeoutMs}ms`)), timeoutMs)),
                        ]);
                        if (res.status === 'COMPLETED') {
                            completedCount++;
                            this.emitEvent(task, 'COMPLETED', (completedCount / totalTasks) * 100, res);
                            return res;
                        }
                        lastResult = res;
                    }
                    catch (err) {
                        lastResult = {
                            taskId: task.id,
                            agentRole: task.agentRole,
                            status: 'FAILED',
                            output: '',
                            durationMs: 0,
                            error: err.message,
                        };
                    }
                }
                completedCount++;
                const failRes = lastResult || {
                    taskId: task.id,
                    agentRole: task.agentRole,
                    status: 'FAILED',
                    output: '',
                    durationMs: 0,
                    error: 'Task execution failed after retries.',
                };
                this.emitEvent(task, 'FAILED', (completedCount / totalTasks) * 100, failRes);
                return failRes;
            });
            const levelResults = await Promise.all(levelPromises);
            for (const res of levelResults) {
                results.set(res.taskId, res);
            }
        }
        return results;
    }
    emitEvent(task, state, progress, result) {
        if (this.events) {
            this.events.emit({
                id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                taskId: task.id,
                agentRole: task.agentRole,
                state,
                timestamp: Date.now(),
                progress,
                result,
                error: result?.error,
            });
        }
    }
}
exports.AgentScheduler = AgentScheduler;
//# sourceMappingURL=agent-scheduler.js.map