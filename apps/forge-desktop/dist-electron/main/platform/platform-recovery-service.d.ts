import { IRuntimeService } from './runtime-service';
import { IWorkspaceService } from '../container/service-interfaces';
export declare class PlatformRecoveryService implements IRuntimeService {
    private readonly workspaceService;
    readonly id = "PlatformRecoveryService";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private snapshotsCount;
    private readonly startTime;
    constructor(workspaceService: IWorkspaceService);
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    saveSnapshot(state: any): void;
    loadSnapshot(): any;
}
