"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionScheduler = exports.LinearRetry = exports.ExponentialRetry = void 0;
const planning_errors_1 = require("../errors/planning-errors");
const tool_execution_engine_1 = require("../tools/tool-execution-engine");
class ExponentialRetry {
    getDelayMs(attempt, baseMs) {
        return Math.pow(2, attempt) * baseMs;
    }
}
exports.ExponentialRetry = ExponentialRetry;
class LinearRetry {
    getDelayMs(attempt, baseMs) {
        return attempt * baseMs;
    }
}
exports.LinearRetry = LinearRetry;
class ExecutionScheduler {
    dispatcher;
    observer;
    retryStrategy;
    completedTasks = new Set();
    runningTasks = new Set();
    constructor(dispatcher, observer, retryStrategy) {
        this.dispatcher = dispatcher;
        this.observer = observer;
        this.retryStrategy = retryStrategy;
    }
    async schedule(graph, budgetTracker, abortSignal, executionId, planId) {
        this.completedTasks.clear();
        this.runningTasks.clear();
        const executionResults = [];
        const allTasks = graph.getAllTasks();
        while (this.completedTasks.size < allTasks.length) {
            if (abortSignal.aborted) {
                throw new Error('Execution aborted by user signal.');
            }
            const budgetCheck = budgetTracker.isExceeded();
            if (budgetCheck.exceeded) {
                throw new Error(`Execution aborted: ${budgetCheck.reason}`);
            }
            const readyTasks = graph
                .findReadyTasks(Array.from(this.completedTasks))
                .filter((t) => !this.runningTasks.has(t.id));
            if (readyTasks.length === 0 && this.runningTasks.size === 0) {
                throw new Error('Deadlock detected or invalid task graph (unresolved dependencies).');
            }
            if (readyTasks.length > 0) {
                const priorityOrder = {
                    critical: 0,
                    high: 1,
                    normal: 2,
                    low: 3,
                    idle: 4,
                };
                readyTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                const dispatchPromises = readyTasks.map(async (task) => {
                    this.runningTasks.add(task.id);
                    this.observer.notify({
                        eventId: `${task.id}-running`,
                        type: 'execution:progress',
                        executionId,
                        timestamp: new Date().toISOString(),
                        taskId: task.id,
                        state: 'running',
                        progressPercentage: Math.floor((this.completedTasks.size / allTasks.length) * 100),
                        elapsedMs: 0,
                    });
                    let attempt = 0;
                    let success = false;
                    let lastError = '';
                    while (attempt <= task.retryLimit) {
                        if (abortSignal.aborted) {
                            this.runningTasks.delete(task.id);
                            this.observer.notify({
                                eventId: `${task.id}-cancelled`,
                                type: 'execution:cancelled',
                                executionId,
                                timestamp: new Date().toISOString(),
                                planId,
                            });
                            return;
                        }
                        try {
                            const startTime = Date.now();
                            const result = await this.dispatcher.dispatch(task, abortSignal, executionId);
                            const durationMs = Date.now() - startTime;
                            success = true;
                            this.completedTasks.add(task.id);
                            this.runningTasks.delete(task.id);
                            executionResults.push({
                                taskId: task.id,
                                toolId: task.toolId,
                                status: 'completed',
                                durationMs,
                                cost: task.estimatedCost || 0,
                                result,
                            });
                            this.observer.notify({
                                eventId: `${task.id}-completed`,
                                type: 'execution:progress',
                                executionId,
                                timestamp: new Date().toISOString(),
                                taskId: task.id,
                                state: 'completed',
                                progressPercentage: Math.floor((this.completedTasks.size / allTasks.length) * 100),
                                elapsedMs: durationMs,
                                result,
                            });
                            break;
                        }
                        catch (err) {
                            // ── Non-retriable error classification ──────────────────────────
                            // Deterministic failures (bad plan, missing tool, validation)
                            // must surface immediately. Retrying them wastes time and masks
                            // the true cause. Only transient failures (timeout, network,
                            // rate-limit) should be retried.
                            if ((0, planning_errors_1.isNonRetriable)(err) || err instanceof tool_execution_engine_1.ToolNotFoundError) {
                                lastError = err.message || String(err);
                                this.runningTasks.delete(task.id);
                                executionResults.push({
                                    taskId: task.id,
                                    toolId: task.toolId,
                                    status: 'failed',
                                    durationMs: 0,
                                    cost: task.estimatedCost || 0,
                                    error: lastError,
                                });
                                this.observer.notify({
                                    eventId: `${task.id}-failed`,
                                    type: 'execution:progress',
                                    executionId,
                                    timestamp: new Date().toISOString(),
                                    taskId: task.id,
                                    state: 'failed',
                                    progressPercentage: Math.floor((this.completedTasks.size / allTasks.length) * 100),
                                    elapsedMs: 0,
                                    error: lastError,
                                });
                                // Re-throw immediately — do NOT enter the retry loop
                                throw new Error(`[${err.code ?? 'ERROR'}] Task ${task.id}: ${lastError}`);
                            }
                            attempt++;
                            lastError = err.message || String(err);
                            budgetTracker.recordRetry();
                            if (attempt <= task.retryLimit) {
                                const delayMs = this.retryStrategy.getDelayMs(attempt, 200);
                                this.observer.notify({
                                    eventId: `${task.id}-retry-${attempt}`,
                                    type: 'execution:retry',
                                    executionId,
                                    timestamp: new Date().toISOString(),
                                    taskId: task.id,
                                    attempt,
                                    delayMs,
                                    error: lastError,
                                });
                                await new Promise((resolve) => setTimeout(resolve, delayMs));
                            }
                        }
                    }
                    if (!success) {
                        this.runningTasks.delete(task.id);
                        executionResults.push({
                            taskId: task.id,
                            toolId: task.toolId,
                            status: 'failed',
                            durationMs: 0,
                            cost: task.estimatedCost || 0,
                            error: lastError,
                        });
                        this.observer.notify({
                            eventId: `${task.id}-failed`,
                            type: 'execution:progress',
                            executionId,
                            timestamp: new Date().toISOString(),
                            taskId: task.id,
                            state: 'failed',
                            progressPercentage: Math.floor((this.completedTasks.size / allTasks.length) * 100),
                            elapsedMs: 0,
                            error: lastError,
                        });
                        throw new Error(`Task ${task.id} failed after ${attempt} attempts: ${lastError}`);
                    }
                });
                await Promise.all(dispatchPromises);
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
        return executionResults;
    }
}
exports.ExecutionScheduler = ExecutionScheduler;
//# sourceMappingURL=execution-scheduler.js.map