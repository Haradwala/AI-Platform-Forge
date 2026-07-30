/**
 * runtime-provider-registry.ts — Plugin Registry for Runtime Providers
 */
import { IRuntimeProvider } from './iruntime-provider';
export declare class RuntimeProviderRegistry {
    private providers;
    registerProvider(provider: IRuntimeProvider): void;
    getProvider(providerId: string): IRuntimeProvider | null;
    listProviders(): IRuntimeProvider[];
}
