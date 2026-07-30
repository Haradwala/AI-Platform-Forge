/**
 * runtime-manager.ts — Runtime Manager & Health Monitor
 *
 * Manages local and cloud runtime lifecycles, periodic health probes, and capability detection.
 */
import { RuntimeProviderRegistry } from '../providers/runtime-provider-registry';
import { RuntimeTimelinePublisher } from '../timeline/runtime-timeline-publisher';
import { RuntimeCandidate, RuntimeHealthStatus, RuntimeCapabilities } from '../contracts/runtime-types';
export declare class RuntimeManager {
    private readonly providerRegistry;
    private readonly timelinePublisher?;
    private activeRuntimes;
    private healthStatuses;
    constructor(providerRegistry?: RuntimeProviderRegistry, timelinePublisher?: RuntimeTimelinePublisher | undefined);
    startRuntime(runtimeId: string): Promise<void>;
    stopRuntime(runtimeId: string): Promise<void>;
    checkHealth(runtimeId: string): Promise<RuntimeHealthStatus>;
    detectCapabilities(modelId: string): Promise<RuntimeCapabilities>;
    getActiveRuntimes(): Promise<RuntimeCandidate[]>;
}
