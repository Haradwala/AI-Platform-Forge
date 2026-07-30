/**
 * runtime-provider-registry.ts — Plugin Registry for Runtime Providers
 */

import { IRuntimeProvider } from './iruntime-provider';

export class RuntimeProviderRegistry {
  private providers = new Map<string, IRuntimeProvider>();

  registerProvider(provider: IRuntimeProvider): void {
    this.providers.set(provider.providerId, provider);
  }

  getProvider(providerId: string): IRuntimeProvider | null {
    return this.providers.get(providerId) || null;
  }

  listProviders(): IRuntimeProvider[] {
    return Array.from(this.providers.values());
  }
}
