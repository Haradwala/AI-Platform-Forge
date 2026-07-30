import { IRuntimeService } from './runtime-service';
import { RuntimeKernel } from './runtime-kernel';
export declare class RuntimeHealthService implements IRuntimeService {
    private readonly kernel;
    readonly id = "RuntimeHealthService";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private readonly startTime;
    constructor(kernel: RuntimeKernel);
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    checkHealth(): 'healthy' | 'warning' | 'degraded' | 'failed';
}
