"use strict";
/**
 * automation-resource-scheduler.ts — Resource Scheduler for Engineering Automation Engine
 *
 * Throttles concurrent step execution across system resources, manages priority queues,
 * allocates runtime slots, and handles emergency cancellations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationResourceScheduler = void 0;
class AutomationResourceScheduler {
    maxConcurrency;
    activeSlots = new Map();
    queue = [];
    constructor(maxConcurrency = 4) {
        this.maxConcurrency = maxConcurrency;
    }
    /**
     * Acquires an execution slot. If max concurrency is reached, queues the request by priority.
     */
    async acquireSlot(stepId, executionId, priority = 'normal') {
        if (this.activeSlots.size < this.maxConcurrency) {
            this.activeSlots.set(stepId, { stepId, executionId, priority, acquiredAt: Date.now() });
            return;
        }
        return new Promise((resolve) => {
            this.queue.push({ stepId, executionId, priority, resolve });
            this.sortQueue();
        });
    }
    /**
     * Releases an active slot and resolves the next queued step.
     */
    releaseSlot(stepId) {
        this.activeSlots.delete(stepId);
        if (this.queue.length > 0 && this.activeSlots.size < this.maxConcurrency) {
            const next = this.queue.shift();
            if (next) {
                this.activeSlots.set(next.stepId, {
                    stepId: next.stepId,
                    executionId: next.executionId,
                    priority: next.priority,
                    acquiredAt: Date.now(),
                });
                next.resolve();
            }
        }
    }
    /**
     * Cancels all queued slots for a specific pipeline execution.
     */
    cancelExecutionSlots(executionId) {
        this.queue = this.queue.filter((q) => q.executionId !== executionId);
        for (const [stepId, slot] of this.activeSlots.entries()) {
            if (slot.executionId === executionId) {
                this.activeSlots.delete(stepId);
            }
        }
    }
    getActiveSlotCount() {
        return this.activeSlots.size;
    }
    getQueueLength() {
        return this.queue.length;
    }
    sortQueue() {
        const priorityWeight = { high: 3, normal: 2, low: 1 };
        this.queue.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    }
}
exports.AutomationResourceScheduler = AutomationResourceScheduler;
//# sourceMappingURL=automation-resource-scheduler.js.map