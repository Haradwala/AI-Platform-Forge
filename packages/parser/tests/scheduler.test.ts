import { describe, it, expect } from 'vitest';
import { ParseScheduler, CancellationToken } from '../src/scheduler';
import { IParseWorkerPool } from '../src/interfaces/worker-pool';
import { IParseJob } from '../src/interfaces/scheduler';
import { IParseResult } from '../src/interfaces/parser';

describe('ParseScheduler & Cancellation', () => {
  it('should process jobs and wait for execution completions', async () => {
    const executedFiles: string[] = [];

    const mockWorkerPool: IParseWorkerPool = {
      async execute(job: IParseJob, cancellationToken: CancellationToken): Promise<IParseResult> {
        cancellationToken.throwIfCancelled();
        await new Promise((resolve) => setTimeout(resolve, 10));
        cancellationToken.throwIfCancelled();
        executedFiles.push(job.fileId);
        return { symbols: [], relationships: [], diagnostics: [] };
      },
      async shutdown() {}
    };

    const scheduler = new ParseScheduler(mockWorkerPool);

    const jobLow: IParseJob = { fileId: 'low', workspaceId: 'w', path: 'low.ts', priority: 1 };
    const jobHigh: IParseJob = { fileId: 'high', workspaceId: 'w', path: 'high.ts', priority: 10 };
    const jobMedium: IParseJob = { fileId: 'med', workspaceId: 'w', path: 'med.ts', priority: 5 };

    const p1 = scheduler.schedule(jobLow);
    const p2 = scheduler.schedule(jobHigh);
    const p3 = scheduler.schedule(jobMedium);

    await Promise.all([p1, p2, p3]);

    expect(executedFiles).toContain('low');
    expect(executedFiles).toContain('high');
    expect(executedFiles).toContain('med');
  });

  it('should support job cancellation', async () => {
    let wasCancelled = false;

    const mockWorkerPool: IParseWorkerPool = {
      async execute(job: IParseJob, cancellationToken: CancellationToken): Promise<IParseResult> {
        try {
          await new Promise((resolve) => setTimeout(resolve, 50));
          cancellationToken.throwIfCancelled();
        } catch {
          wasCancelled = true;
          throw new Error('Cancelled');
        }
        return { symbols: [], relationships: [], diagnostics: [] };
      },
      async shutdown() {}
    };

    const scheduler = new ParseScheduler(mockWorkerPool);
    const job: IParseJob = { fileId: 'file1', workspaceId: 'w', path: 'file1.ts', priority: 1 };

    const promise = scheduler.schedule(job);
    
    setTimeout(() => {
      scheduler.cancelJob('file1');
    }, 10);

    try {
      await promise;
    } catch (err) {
      // Expected rejection
    }

    expect(wasCancelled).toBe(true);
  });
});
