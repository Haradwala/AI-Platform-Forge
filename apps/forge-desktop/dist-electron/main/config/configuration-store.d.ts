/**
 * configuration-store.ts
 *
 * In-memory state holder for ForgeConfig.
 */
import { type ForgeConfig, type ProviderConfig } from './configuration-schema';
export declare class ConfigurationStore {
    private config;
    constructor(initialConfig?: Partial<ForgeConfig>);
    get(): ForgeConfig;
    set(newConfig: Partial<ForgeConfig>): ForgeConfig;
    getActiveRuntime(): string;
    setActiveRuntime(runtimeId: string): void;
    getProvider(providerId: string): ProviderConfig | null;
    setProvider(providerId: string, providerConfig: Partial<ProviderConfig>): void;
    getDefaultModel(runtimeId: string): string | null;
    setDefaultModel(runtimeId: string, model: string): void;
    private mergeWithDefault;
}
