import { describe, it, expect } from 'vitest';
import { BackgroundScheduler, IJob } from '../electron/main/platform/background-scheduler';

describe('BackgroundScheduler', () => {
  it('executes enqueued jobs in priority order with concurrency limits', async () => {
    const scheduler = new BackgroundScheduler(1); // Limit concurrency to 1 to queue jobs
    const executionOrder: string[] = [];

    const jobLow: IJob = {
      id: 'low',
      priority: 'Low',
      pool: 'Indexing',
      status: 'pending',
      execute: async () => {
        // Slow execution to allow other jobs to enqueue and sort
        await new Promise((resolve) => setTimeout(resolve, 30));
        executionOrder.push('low');
      }
    };

    const jobCritical: IJob = {
      id: 'critical',
      priority: 'Critical',
      pool: 'Filesystem',
      status: 'pending',
      execute: async () => { executionOrder.push('critical'); }
    };

    const jobHigh: IJob = {
      id: 'high',
      priority: 'High',
      pool: 'Git',
      status: 'pending',
      execute: async () => { executionOrder.push('high'); }
    };

    // Enqueue first job (starts executing immediately since concurrency is 1 and active is 0)
    scheduler.enqueue(jobLow);

    // Enqueue other jobs (waiting in queue, gets sorted by priority)
    scheduler.enqueue(jobHigh);
    scheduler.enqueue(jobCritical);

    // Wait for all jobs to complete
    await new Promise((resolve) => setTimeout(resolve, 80));

    expect(executionOrder[0]).toBe('low');        // Low started first and ran
    expect(executionOrder[1]).toBe('critical');   // Critical was popped next due to highest weight (4)
    expect(executionOrder[2]).toBe('high');       // High was popped last (weight 3)
  });

  it('handles job timeout thresholds safely', async () => {
    const scheduler = new BackgroundScheduler(1);
    
    const jobTimeout: IJob = {
      id: 'timeout-job',
      priority: 'Normal',
      pool: 'Indexing',
      timeout: 10,
      status: 'pending',
      execute: () => new Promise((resolve) => setTimeout(resolve, 100))
    };

    scheduler.enqueue(jobTimeout);

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(jobTimeout.status).toBe('failed');
  });
});
