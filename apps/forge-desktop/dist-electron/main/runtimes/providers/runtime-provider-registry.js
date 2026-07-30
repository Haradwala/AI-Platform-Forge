"use strict";
/**
 * runtime-provider-registry.ts — Plugin Registry for Runtime Providers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeProviderRegistry = void 0;
class RuntimeProviderRegistry {
    providers = new Map();
    registerProvider(provider) {
        this.providers.set(provider.providerId, provider);
    }
    getProvider(providerId) {
        return this.providers.get(providerId) || null;
    }
    listProviders() {
        return Array.from(this.providers.values());
    }
}
exports.RuntimeProviderRegistry = RuntimeProviderRegistry;
//# sourceMappingURL=runtime-provider-registry.js.map