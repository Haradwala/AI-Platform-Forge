"use strict";
/**
 * configuration-service.ts
 *
 * Central ConfigurationService — single source of truth for runtime settings.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationService = void 0;
const configuration_store_1 = require("./configuration-store");
const configuration_loader_1 = require("./configuration-loader");
const configuration_validator_1 = require("./configuration-validator");
class ConfigurationService {
    loader;
    store;
    constructor(customPath, customFs) {
        this.loader = new configuration_loader_1.ConfigurationLoader(customPath, customFs);
        const initialConfig = this.loader.load();
        this.store = new configuration_store_1.ConfigurationStore(initialConfig);
    }
    get() {
        return this.store.get();
    }
    set(newConfig) {
        const updated = this.store.set(newConfig);
        this.save();
        return updated;
    }
    getProvider(providerId) {
        return this.store.getProvider(providerId);
    }
    setProvider(providerId, providerConfig) {
        this.store.setProvider(providerId, providerConfig);
        this.save();
    }
    getActiveRuntime() {
        return this.store.getActiveRuntime();
    }
    setActiveRuntime(runtimeId) {
        this.store.setActiveRuntime(runtimeId);
        this.save();
    }
    getDefaultModel(runtimeId) {
        return this.store.getDefaultModel(runtimeId);
    }
    setDefaultModel(runtimeId, model) {
        this.store.setDefaultModel(runtimeId, model);
        this.save();
    }
    save() {
        this.loader.save(this.store.get());
    }
    reload() {
        const fresh = this.loader.load();
        this.store.set(fresh);
        return this.store.get();
    }
    validate() {
        return (0, configuration_validator_1.validateConfig)(this.store.get());
    }
}
exports.ConfigurationService = ConfigurationService;
//# sourceMappingURL=configuration-service.js.map