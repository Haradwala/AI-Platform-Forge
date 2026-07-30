import { IRuntimeService } from './runtime-service';

export type JobPriority = 'Critical' | 'High' | 'Normal' | 'Low' | 'Idle';
export type WorkerPool = 'Filesystem' | 'Indexing' | 'AI' | 'Git' | 'Diagnostics';

export interface IJob {
  readonly id: string;
  readonly priority: JobPriority;
  readonly pool: WorkerPool;
  readonly timeout?: number;
  readonly retries?: number;
  readonly estimatedDuration?: number;
  progress?: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  readonly execute: () => Promise<any>;
}

export class BackgroundScheduler implements IRuntimeService {
  readonly id = 'BackgroundScheduler';
  readonly version = '1.0.0';
  readonly dependencies = [];
  health: 'healthy' | 'warning' | 'degraded' | 'failed' = 'healthy';
  status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error' = 'stopped';

  private readonly queue: IJob[] = [];
  private activeJobsCount = 0;
  private readonly startTime = Date.now();

  constructor(private readonly maxConcurrent = 4) {}

  uptime(): number {
    return Date.now() - this.startTime;
  }

  metrics(): Record<string, any> {
    return {
      queueLength: this.queue.length,
      activeJobsCount: this.activeJobsCount,
    };
  }

  onStart(): void {}
  onRunning(): void {}
  onSuspend(): void {}
  onShutdown(): void {
    for (const job of this.queue) {
      job.status = 'cancelled';
    }
    this.queue.length = 0;
  }

  enqueue(job: IJob): void {
    job.status = 'pending';
    job.progress = 0;
    this.queue.push(job);
    this.sortQueue();
    this.processQueue();
  }

  private sortQueue(): void {
    const priorityWeights: Record<JobPriority, number> = {
      Critical: 4,
      High: 3,
      Normal: 2,
      Low: 1,
      Idle: 0,
    };
    this.queue.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
  }

  private async processQueue(): Promise<void> {
    if (this.activeJobsCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift()!;
    this.activeJobsCount++;
    job.status = 'running';

    try {
      const timeoutPromise = job.timeout
        ? new Promise((_, reject) => setTimeout(() => reject(new Error('Job timeout exceeded')), job.timeout))
        : null;

      const runPromise = job.execute();

      if (timeoutPromise) {
        await Promise.race([runPromise, timeoutPromise]);
      } else {
        await runPromise;
      }

      job.status = 'completed';
      job.progress = 100;
    } catch (err) {
      job.status = 'failed';
      this.health = 'warning';
    } finally {
      this.activeJobsCount--;
      this.processQueue();
    }
  }
}
