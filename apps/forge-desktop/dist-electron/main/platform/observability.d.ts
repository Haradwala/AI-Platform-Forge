import { IRuntimeService } from './runtime-service';
export declare class Observability implements IRuntimeService {
    readonly id = "Observability";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private activeSpanId;
    private logsCount;
    private readonly startTime;
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    createTrace(): string;
    logInfo(message: string, traceId?: string): void;
    logError(message: string, err: any, traceId?: string): void;
    startProfiler(label: string): () => void;
}
