import { ICancellationToken, ICancellationTokenSource, IParseJob, IParseScheduler } from './interfaces/scheduler';
import { IParseWorkerPool } from './interfaces/worker-pool';

export class CancellationToken implements ICancellationToken {
  private _cancelled = false;

  get isCancellationRequested(): boolean {
    return this._cancelled;
  }

  cancel(): void {
    this._cancelled = true;
  }

  throwIfCancelled(): void {
    if (this._cancelled) {
      throw new Error('CancellationToken: Operation was cancelled.');
    }
  }
}

export class CancellationTokenSource implements ICancellationTokenSource {
  public readonly token = new CancellationToken();

  cancel(): void {
    this.token.cancel();
  }
}

interface IQueueEntry {
  job: IParseJob;
  resolve: () => void;
  reject: (err: any) => void;
}

export class ParseScheduler implements IParseScheduler {
  private jobQueue: IQueueEntry[] = [];
  private activeJobs = new Map<string, { cts: CancellationTokenSource; reject: (err: any) => void }>();
  private isProcessing = false;

  constructor(private readonly workerPool: IParseWorkerPool) {}

  schedule(job: IParseJob): Promise<void> {
    this.cancelJob(job.fileId);

    return new Promise<void>((resolve, reject) => {
      this.jobQueue.push({ job, resolve, reject });
      this.jobQueue.sort((a, b) => b.job.priority - a.job.priority);
      this.triggerProcessing();
    });
  }

  cancelJob(fileId: string): void {
    const active = this.activeJobs.get(fileId);
    if (active) {
      active.cts.cancel();
    }

    const entriesToCancel = this.jobQueue.filter((e) => e.job.fileId === fileId);
    for (const entry of entriesToCancel) {
      entry.reject(new Error('CancellationToken: Operation was cancelled.'));
    }
    this.jobQueue = this.jobQueue.filter((e) => e.job.fileId !== fileId);
  }

  cancelAll(): void {
    for (const active of this.activeJobs.values()) {
      active.cts.cancel();
    }
    this.activeJobs.clear();

    for (const entry of this.jobQueue) {
      entry.reject(new Error('CancellationToken: Operation was cancelled.'));
    }
    this.jobQueue = [];
  }

  private async triggerProcessing(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      while (this.jobQueue.length > 0) {
        const entry = this.jobQueue.shift()!;
        const cts = new CancellationTokenSource();
        this.activeJobs.set(entry.job.fileId, { cts, reject: entry.reject });

        try {
          await this.workerPool.execute(entry.job, cts.token);
          entry.resolve();
        } catch (err: any) {
          entry.reject(err);
        } finally {
          this.activeJobs.delete(entry.job.fileId);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
}
