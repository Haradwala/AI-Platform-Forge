export interface IRuntimeService {
    readonly id: string;
    readonly version: string;
    readonly dependencies: string[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): Promise<void> | void;
    onRunning(): Promise<void> | void;
    onSuspend(): Promise<void> | void;
    onShutdown(): Promise<void> | void;
}
