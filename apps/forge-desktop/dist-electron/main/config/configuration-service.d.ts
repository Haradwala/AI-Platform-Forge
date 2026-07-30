/**
 * configuration-service.ts
 *
 * Central ConfigurationService — single source of truth for runtime settings.
 */
import type { ForgeConfig, ProviderConfig } from './configuration-schema';
import { type IFileSystem } from './configuration-loader';
import { type ValidationResult } from './configuration-validator';
export interface IConfigurationService {
    get(): ForgeConfig;
    set(newConfig: Partial<ForgeConfig>): ForgeConfig;
    getProvider(providerId: string): ProviderConfig | null;
    setProvider(providerId: string, providerConfig: Partial<ProviderConfig>): void;
    getActiveRuntime(): string;
    setActiveRuntime(runtimeId: string): void;
    getDefaultModel(runtimeId: string): string | null;
    setDefaultModel(runtimeId: string, model: string): void;
    save(): void;
    reload(): ForgeConfig;
    validate(): ValidationResult;
}
export declare class ConfigurationService implements IConfigurationService {
    private readonly loader;
    private readonly store;
    constructor(customPath?: string, customFs?: IFileSystem);
    get(): ForgeConfig;
    set(newConfig: Partial<ForgeConfig>): ForgeConfig;
    getProvider(providerId: string): ProviderConfig | null;
    setProvider(providerId: string, providerConfig: Partial<ProviderConfig>): void;
    getActiveRuntime(): string;
    setActiveRuntime(runtimeId: string): void;
    getDefaultModel(runtimeId: string): string | null;
    setDefaultModel(runtimeId: string, model: string): void;
    save(): void;
    reload(): ForgeConfig;
    validate(): ValidationResult;
}
