/**
 * external-runtime-manager.ts — Phase 18 External Runtime Foundation
 *
 * Manages external runtime instances, process lifecycles, and session tracking.
 */
import { ExternalRuntime } from './external-runtime';
import type { ExternalRuntimeConfig, ExternalRuntimeState } from './external-types';
import type { RuntimeManager } from '../runtime/runtime-manager';
export declare class ExternalRuntimeManager {
    private readonly runtimeManager?;
    private readonly externalRuntimes;
    constructor(runtimeManager?: RuntimeManager | undefined);
    /**
     * Registers a new ExternalRuntime configuration.
     */
    registerExternalRuntime(config: ExternalRuntimeConfig): ExternalRuntime;
    getExternalRuntime(id: string): ExternalRuntime | undefined;
    getAllExternalRuntimes(): ExternalRuntime[];
    startRuntime(id: string): Promise<void>;
    stopRuntime(id: string): Promise<void>;
    stopAll(): Promise<void>;
    getRuntimeStates(): Record<string, ExternalRuntimeState>;
}
