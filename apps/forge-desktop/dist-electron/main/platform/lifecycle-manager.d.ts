import { IRuntimeService } from './runtime-service';
export type RuntimeState = 'Boot' | 'PreInitialize' | 'Initialize' | 'LoadConfiguration' | 'LoadWorkspace' | 'WorkspaceReady' | 'Running' | 'Suspended' | 'ShuttingDown' | 'Stopped';
export declare class LifecycleManager implements IRuntimeService {
    readonly id = "LifecycleManager";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private currentState;
    private readonly listeners;
    private readonly startTime;
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    getCurrentState(): RuntimeState;
    onState(state: RuntimeState, callback: () => Promise<void> | void): () => void;
    transition(nextState: RuntimeState): Promise<void>;
}
