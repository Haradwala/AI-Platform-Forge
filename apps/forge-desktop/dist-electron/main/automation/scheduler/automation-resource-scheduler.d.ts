/**
 * automation-resource-scheduler.ts — Resource Scheduler for Engineering Automation Engine
 *
 * Throttles concurrent step execution across system resources, manages priority queues,
 * allocates runtime slots, and handles emergency cancellations.
 */
import { StepPriority } from '../contracts/automation-types';
export interface ResourceSlot {
    stepId: string;
    executionId: string;
    priority: StepPriority;
    acquiredAt: number;
}
export declare class AutomationResourceScheduler {
    private readonly maxConcurrency;
    private activeSlots;
    private queue;
    constructor(maxConcurrency?: number);
    /**
     * Acquires an execution slot. If max concurrency is reached, queues the request by priority.
     */
    acquireSlot(stepId: string, executionId: string, priority?: StepPriority): Promise<void>;
    /**
     * Releases an active slot and resolves the next queued step.
     */
    releaseSlot(stepId: string): void;
    /**
     * Cancels all queued slots for a specific pipeline execution.
     */
    cancelExecutionSlots(executionId: string): void;
    getActiveSlotCount(): number;
    getQueueLength(): number;
    private sortQueue;
}
