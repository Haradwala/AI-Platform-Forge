/**
 * runtime-manager.ts
 *
 * RuntimeManager — canonical implementation of IRuntimeManager.
 *
 * Responsibilities:
 *  - Register / unregister AI runtimes
 *  - Track the active runtime
 *  - Discover models on local runtimes (non-blocking)
 *  - Probe runtime health
 *  - Expose a metadata list for IPC / UI serialisation
 *
 * Backward compatibility:
 *  - RuntimeManager structurally satisfies IProviderRegistry because
 *    register / getById / getAll operate on IAiRuntime which extends IAiProvider.
 *  - session/provider-registry.ts re-exports this class as ProviderRegistry
 *    so existing imports continue to compile without modification.
 */
import type { IRuntimeManager, IAiRuntime, RuntimeHealth, RuntimeListEntry } from './runtime-types';
import type { IConfigurationService } from '../../config/configuration-service';
export declare class RuntimeManager implements IRuntimeManager {
    private readonly configService?;
    private readonly runtimes;
    private activeId;
    constructor(configService?: IConfigurationService | undefined);
    register(runtime: IAiRuntime): void;
    getById(id: string): IAiRuntime | null;
    getAll(): IAiRuntime[];
    activate(id: string): void;
    active(): IAiRuntime;
    /**
     * Evaluates runtime health and falls back to a healthy runtime if current active is unhealthy.
     * Fallback order:
     *  1. Configured active runtime (if healthy)
     *  2. Healthy Ollama
     *  3. First healthy Cloud runtime
     *  4. Mock / First registered
     * Never throws.
     */
    resolveFallbackRuntime(): Promise<IAiRuntime>;
    discover(): Promise<void>;
    health(): Promise<Record<string, RuntimeHealth>>;
    list(): RuntimeListEntry[];
}
