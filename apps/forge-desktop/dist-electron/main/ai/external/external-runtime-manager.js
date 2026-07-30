"use strict";
/**
 * external-runtime-manager.ts — Phase 18 External Runtime Foundation
 *
 * Manages external runtime instances, process lifecycles, and session tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalRuntimeManager = void 0;
const external_runtime_1 = require("./external-runtime");
class ExternalRuntimeManager {
    runtimeManager;
    externalRuntimes = new Map();
    constructor(runtimeManager) {
        this.runtimeManager = runtimeManager;
    }
    /**
     * Registers a new ExternalRuntime configuration.
     */
    registerExternalRuntime(config) {
        const runtime = new external_runtime_1.ExternalRuntime(config);
        this.externalRuntimes.set(runtime.id, runtime);
        if (this.runtimeManager) {
            this.runtimeManager.register(runtime);
        }
        return runtime;
    }
    getExternalRuntime(id) {
        return this.externalRuntimes.get(id);
    }
    getAllExternalRuntimes() {
        return Array.from(this.externalRuntimes.values());
    }
    async startRuntime(id) {
        const rt = this.externalRuntimes.get(id);
        if (!rt) {
            throw new Error(`[ExternalRuntimeManager] Runtime with id "${id}" not found.`);
        }
        await rt.start();
    }
    async stopRuntime(id) {
        const rt = this.externalRuntimes.get(id);
        if (rt) {
            await rt.stop();
        }
    }
    async stopAll() {
        for (const rt of this.externalRuntimes.values()) {
            await rt.dispose();
        }
        this.externalRuntimes.clear();
    }
    getRuntimeStates() {
        const states = {};
        for (const [id, rt] of this.externalRuntimes.entries()) {
            states[id] = rt.getState();
        }
        return states;
    }
}
exports.ExternalRuntimeManager = ExternalRuntimeManager;
//# sourceMappingURL=external-runtime-manager.js.map