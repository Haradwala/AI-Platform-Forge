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
export declare class BackgroundScheduler implements IRuntimeService {
    private readonly maxConcurrent;
    readonly id = "BackgroundScheduler";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private readonly queue;
    private activeJobsCount;
    private readonly startTime;
    constructor(maxConcurrent?: number);
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    enqueue(job: IJob): void;
    private sortQueue;
    private processQueue;
}
