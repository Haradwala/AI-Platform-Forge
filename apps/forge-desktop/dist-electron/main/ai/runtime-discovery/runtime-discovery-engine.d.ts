/**
 * runtime-discovery-engine.ts — Phase 23 Runtime Discovery Engine
 *
 * Primary coordinator for automated discovery, validation, health monitoring,
 * environment diagnostics, and runtime workspace synchronization.
 */
import { EnvironmentDiagnostics } from './environment-doctor';
import { RuntimeEvents } from './runtime-events';
import type { DiscoveredRuntime, RuntimeDiscoveryEngineOptions, KnownRuntimeId } from './runtime-types';
import type { RuntimeManager } from '../runtime/runtime-manager';
import type { ExternalRuntimeManager } from '../external/external-runtime-manager';
export declare class RuntimeDiscoveryEngine {
    private readonly runtimeManager?;
    private readonly externalRuntimeManager?;
    private detector;
    private validator;
    private healthChecker;
    private doctor;
    private config;
    private cache;
    private events;
    private autoScanTimer;
    constructor(options?: RuntimeDiscoveryEngineOptions, runtimeManager?: RuntimeManager | undefined, externalRuntimeManager?: ExternalRuntimeManager | undefined);
    /**
     * Discovers all installed, cloud, and local runtimes across the system environment.
     */
    discoverRuntimes(forceRefresh?: boolean): Promise<DiscoveredRuntime[]>;
    /**
     * Returns a single discovered runtime by id.
     */
    getRuntime(id: KnownRuntimeId): Promise<DiscoveredRuntime | null>;
    /**
     * Validates an executable path for a runtime.
     */
    validateRuntimePath(execPath: string, versionFlag?: string): Promise<import("./runtime-validator").ValidationResult>;
    /**
     * Probes the health of a specific runtime on demand.
     */
    checkHealth(id: KnownRuntimeId): Promise<import("./runtime-health").HealthCheckResult>;
    /**
     * Runs complete system environment diagnostics.
     */
    runDiagnostics(): Promise<EnvironmentDiagnostics>;
    /**
     * Updates runtime discovery configuration and clears cache.
     */
    updateConfig(partial: Partial<RuntimeDiscoveryEngineOptions>): void;
    /**
     * Exposes event emitter listeners.
     */
    get eventsBus(): RuntimeEvents;
    startAutoScan(): void;
    stopAutoScan(): void;
    private syncWithRuntimeManagers;
    dispose(): void;
}
