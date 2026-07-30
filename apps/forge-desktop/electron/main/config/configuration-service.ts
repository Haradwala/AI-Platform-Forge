/**
 * configuration-service.ts
 *
 * Central ConfigurationService — single source of truth for runtime settings.
 */

import type { ForgeConfig, ProviderConfig } from './configuration-schema';
import { ConfigurationStore } from './configuration-store';
import { ConfigurationLoader, type IFileSystem } from './configuration-loader';
import { validateConfig, type ValidationResult } from './configuration-validator';

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

export class ConfigurationService implements IConfigurationService {
  private readonly loader: ConfigurationLoader;
  private readonly store: ConfigurationStore;

  constructor(customPath?: string, customFs?: IFileSystem) {
    this.loader = new ConfigurationLoader(customPath, customFs);
    const initialConfig = this.loader.load();
    this.store = new ConfigurationStore(initialConfig);
  }

  get(): ForgeConfig {
    return this.store.get();
  }

  set(newConfig: Partial<ForgeConfig>): ForgeConfig {
    const updated = this.store.set(newConfig);
    this.save();
    return updated;
  }

  getProvider(providerId: string): ProviderConfig | null {
    return this.store.getProvider(providerId);
  }

  setProvider(providerId: string, providerConfig: Partial<ProviderConfig>): void {
    this.store.setProvider(providerId, providerConfig);
    this.save();
  }

  getActiveRuntime(): string {
    return this.store.getActiveRuntime();
  }

  setActiveRuntime(runtimeId: string): void {
    this.store.setActiveRuntime(runtimeId);
    this.save();
  }

  getDefaultModel(runtimeId: string): string | null {
    return this.store.getDefaultModel(runtimeId);
  }

  setDefaultModel(runtimeId: string, model: string): void {
    this.store.setDefaultModel(runtimeId, model);
    this.save();
  }

  save(): void {
    this.loader.save(this.store.get());
  }

  reload(): ForgeConfig {
    const fresh = this.loader.load();
    this.store.set(fresh);
    return this.store.get();
  }

  validate(): ValidationResult {
    return validateConfig(this.store.get());
  }
}
