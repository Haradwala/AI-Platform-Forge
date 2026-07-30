import { IRuntimeService } from './runtime-service';
export interface IFeatureMetadata {
    readonly id: string;
    readonly description: string;
    readonly stage: 'Stable' | 'Experimental' | 'Preview' | 'Deprecated' | 'Disabled';
    readonly minVersion?: string;
    readonly permissions?: string[];
}
export declare class FeatureRegistry implements IRuntimeService {
    readonly id = "FeatureRegistry";
    readonly version = "1.0.0";
    readonly dependencies: never[];
    health: 'healthy' | 'warning' | 'degraded' | 'failed';
    status: 'stopped' | 'starting' | 'running' | 'suspended' | 'error';
    private readonly features;
    private readonly startTime;
    uptime(): number;
    metrics(): Record<string, any>;
    onStart(): void;
    onRunning(): void;
    onSuspend(): void;
    onShutdown(): void;
    register(feature: IFeatureMetadata): void;
    isEnabled(id: string): boolean;
    getFeature(id: string): IFeatureMetadata | undefined;
    getAll(): IFeatureMetadata[];
}
