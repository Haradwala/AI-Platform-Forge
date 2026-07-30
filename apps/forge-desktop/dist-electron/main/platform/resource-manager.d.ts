import { IRuntimeService } from './runtime-service';
export declare class ResourceManager implements IRuntimeService {
    readonly id = "ResourceManager";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private ramUsage;
    private cpuUsage;
    private ptyCount;
    private isThrottled;
    private readonly startTime;
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    private pollResources;
    checkThrottle(): boolean;
    registerPty(): void;
    unregisterPty(): void;
}
