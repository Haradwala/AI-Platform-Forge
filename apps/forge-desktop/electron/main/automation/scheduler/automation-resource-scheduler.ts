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

export class AutomationResourceScheduler {
  private activeSlots = new Map<string, ResourceSlot>();
  private queue: Array<{
    stepId: string;
    executionId: string;
    priority: StepPriority;
    resolve: () => void;
  }> = [];

  constructor(private readonly maxConcurrency: number = 4) {}

  /**
   * Acquires an execution slot. If max concurrency is reached, queues the request by priority.
   */
  async acquireSlot(stepId: string, executionId: string, priority: StepPriority = 'normal'): Promise<void> {
    if (this.activeSlots.size < this.maxConcurrency) {
      this.activeSlots.set(stepId, { stepId, executionId, priority, acquiredAt: Date.now() });
      return;
    }

    return new Promise<void>((resolve) => {
      this.queue.push({ stepId, executionId, priority, resolve });
      this.sortQueue();
    });
  }

  /**
   * Releases an active slot and resolves the next queued step.
   */
  releaseSlot(stepId: string): void {
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
  cancelExecutionSlots(executionId: string): void {
    this.queue = this.queue.filter((q) => q.executionId !== executionId);
    for (const [stepId, slot] of this.activeSlots.entries()) {
      if (slot.executionId === executionId) {
        this.activeSlots.delete(stepId);
      }
    }
  }

  getActiveSlotCount(): number {
    return this.activeSlots.size;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  private sortQueue(): void {
    const priorityWeight: Record<StepPriority, number> = { high: 3, normal: 2, low: 1 };
    this.queue.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  }
}
