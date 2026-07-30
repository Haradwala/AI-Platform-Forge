/**
 * configuration-store.ts
 *
 * In-memory state holder for ForgeConfig.
 */

import { createDefaultConfig, type ForgeConfig, type ProviderConfig } from './configuration-schema';

export class ConfigurationStore {
  private config: ForgeConfig;

  constructor(initialConfig?: Partial<ForgeConfig>) {
    this.config = this.mergeWithDefault(initialConfig);
  }

  get(): ForgeConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  set(newConfig: Partial<ForgeConfig>): ForgeConfig {
    this.config = this.mergeWithDefault(newConfig);
    return this.get();
  }

  getActiveRuntime(): string {
    return this.config.activeRuntime;
  }

  setActiveRuntime(runtimeId: string): void {
    this.config.activeRuntime = runtimeId;
  }

  getProvider(providerId: string): ProviderConfig | null {
    return this.config.providers[providerId]
      ? { ...this.config.providers[providerId] }
      : null;
  }

  setProvider(providerId: string, providerConfig: Partial<ProviderConfig>): void {
    const existing = this.config.providers[providerId] || {};
    this.config.providers[providerId] = {
      ...existing,
      ...providerConfig,
    };
  }

  getDefaultModel(runtimeId: string): string | null {
    return this.config.defaultModels[runtimeId] || null;
  }

  setDefaultModel(runtimeId: string, model: string): void {
    this.config.defaultModels[runtimeId] = model;
  }

  private mergeWithDefault(incoming?: Partial<ForgeConfig>): ForgeConfig {
    const base = createDefaultConfig();
    if (!incoming) return base;

    return {
      ...base,
      ...incoming,
      defaultModels: {
        ...base.defaultModels,
        ...(incoming.defaultModels || {}),
      },
      providers: {
        ...base.providers,
        ...(incoming.providers || {}),
      },
    };
  }
}
