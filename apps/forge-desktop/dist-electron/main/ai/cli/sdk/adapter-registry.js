"use strict";
/**
 * adapter-registry.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Registry for managing loaded CLI adapters, discovery, enablement status, dynamic updates, and validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterRegistry = void 0;
const adapter_discovery_1 = require("./adapter-discovery");
const adapter_loader_1 = require("./adapter-loader");
const adapter_validator_1 = require("./adapter-validator");
const adapter_diagnostics_1 = require("./adapter-diagnostics");
const cli_errors_1 = require("../cli-errors");
class AdapterRegistry {
    entries = new Map();
    discovery = new adapter_discovery_1.AdapterDiscovery();
    /**
     * Scans system discovery paths for adapters.
     */
    async discover(workspaceRoot) {
        return this.discovery.discoverAdapters(workspaceRoot);
    }
    /**
     * Loads an adapter from a directory path and registers it.
     */
    async load(directoryPath) {
        const { adapter, manifest } = await adapter_loader_1.AdapterLoader.loadFromDirectory(directoryPath);
        return this.register(adapter, manifest, directoryPath);
    }
    /**
     * Reloads an existing registered adapter.
     */
    async reload(id) {
        const existing = this.entries.get(id);
        if (!existing || !existing.sourcePath) {
            throw new cli_errors_1.AdapterError(`Cannot reload adapter "${id}": no source directory path available.`);
        }
        this.unregister(id);
        return this.load(existing.sourcePath);
    }
    /**
     * Registers a CLIAdapter instance into the registry.
     */
    register(adapter, manifest, sourcePath) {
        const entry = {
            adapter,
            manifest,
            enabled: true,
            sourcePath,
            loadedAt: Date.now(),
        };
        this.entries.set(adapter.id, entry);
        return entry;
    }
    /**
     * Unregisters an adapter from the registry.
     */
    unregister(id) {
        return this.entries.delete(id);
    }
    enable(id) {
        const entry = this.entries.get(id);
        if (entry) {
            entry.enabled = true;
        }
    }
    disable(id) {
        const entry = this.entries.get(id);
        if (entry) {
            entry.enabled = false;
        }
    }
    /**
     * Updates an existing adapter entry manifest or instance.
     */
    update(id, updatedAdapter, updatedManifest) {
        const entry = this.entries.get(id);
        if (!entry) {
            throw new cli_errors_1.AdapterError(`Cannot update adapter "${id}": not found in registry.`);
        }
        entry.adapter = updatedAdapter;
        entry.manifest = updatedManifest;
        entry.loadedAt = Date.now();
    }
    list(onlyEnabled = false) {
        const all = Array.from(this.entries.values());
        return onlyEnabled ? all.filter((e) => e.enabled) : all;
    }
    get(id) {
        return this.entries.get(id);
    }
    getAdapter(id) {
        return this.entries.get(id)?.adapter;
    }
    validate(manifest, directoryPath) {
        return adapter_validator_1.AdapterValidator.validate(manifest, directoryPath);
    }
    async runDiagnostics(id) {
        const entry = this.entries.get(id);
        if (!entry) {
            throw new cli_errors_1.AdapterError(`Cannot run diagnostics: adapter "${id}" not found.`);
        }
        return adapter_diagnostics_1.AdapterDiagnostics.runDiagnostics(entry.adapter, entry.manifest);
    }
}
exports.AdapterRegistry = AdapterRegistry;
//# sourceMappingURL=adapter-registry.js.map