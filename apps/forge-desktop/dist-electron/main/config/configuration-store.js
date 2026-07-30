"use strict";
/**
 * configuration-store.ts
 *
 * In-memory state holder for ForgeConfig.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationStore = void 0;
const configuration_schema_1 = require("./configuration-schema");
class ConfigurationStore {
    config;
    constructor(initialConfig) {
        this.config = this.mergeWithDefault(initialConfig);
    }
    get() {
        return JSON.parse(JSON.stringify(this.config));
    }
    set(newConfig) {
        this.config = this.mergeWithDefault(newConfig);
        return this.get();
    }
    getActiveRuntime() {
        return this.config.activeRuntime;
    }
    setActiveRuntime(runtimeId) {
        this.config.activeRuntime = runtimeId;
    }
    getProvider(providerId) {
        return this.config.providers[providerId]
            ? { ...this.config.providers[providerId] }
            : null;
    }
    setProvider(providerId, providerConfig) {
        const existing = this.config.providers[providerId] || {};
        this.config.providers[providerId] = {
            ...existing,
            ...providerConfig,
        };
    }
    getDefaultModel(runtimeId) {
        return this.config.defaultModels[runtimeId] || null;
    }
    setDefaultModel(runtimeId, model) {
        this.config.defaultModels[runtimeId] = model;
    }
    mergeWithDefault(incoming) {
        const base = (0, configuration_schema_1.createDefaultConfig)();
        if (!incoming)
            return base;
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
exports.ConfigurationStore = ConfigurationStore;
//# sourceMappingURL=configuration-store.js.map