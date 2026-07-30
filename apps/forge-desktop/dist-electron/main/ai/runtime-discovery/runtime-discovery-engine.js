"use strict";
/**
 * runtime-discovery-engine.ts — Phase 23 Runtime Discovery Engine
 *
 * Primary coordinator for automated discovery, validation, health monitoring,
 * environment diagnostics, and runtime workspace synchronization.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeDiscoveryEngine = void 0;
const runtime_detector_1 = require("./runtime-detector");
const runtime_validator_1 = require("./runtime-validator");
const runtime_health_1 = require("./runtime-health");
const environment_doctor_1 = require("./environment-doctor");
const runtime_config_1 = require("./runtime-config");
const runtime_cache_1 = require("./runtime-cache");
const runtime_events_1 = require("./runtime-events");
class RuntimeDiscoveryEngine {
    runtimeManager;
    externalRuntimeManager;
    detector = new runtime_detector_1.RuntimeDetector();
    validator = new runtime_validator_1.RuntimeValidator();
    healthChecker = new runtime_health_1.RuntimeHealthChecker();
    doctor = new environment_doctor_1.EnvironmentDoctor();
    config;
    cache = new runtime_cache_1.RuntimeCache();
    events = new runtime_events_1.RuntimeEvents();
    autoScanTimer = null;
    constructor(options, runtimeManager, externalRuntimeManager) {
        this.runtimeManager = runtimeManager;
        this.externalRuntimeManager = externalRuntimeManager;
        this.config = new runtime_config_1.RuntimeConfig(options);
        if (this.config.getConfig().autoScan) {
            this.startAutoScan();
        }
    }
    /**
     * Discovers all installed, cloud, and local runtimes across the system environment.
     */
    async discoverRuntimes(forceRefresh = false) {
        if (!forceRefresh) {
            const cached = this.cache.get('all_runtimes', this.config.getConfig().cacheTtlMs);
            if (cached)
                return cached;
        }
        this.events.emitStarted();
        const rawDetections = await this.detector.detectAll(this.config);
        const discovered = await Promise.all(rawDetections.map(async (item) => {
            let healthState = 'unknown';
            let status = 'not_installed';
            if (item.installed) {
                const healthRes = await this.healthChecker.checkHealth(item.id, item.executablePath, item.rawEnvVars);
                healthState = healthRes.health;
                status = healthState === 'healthy' || healthState === 'degraded' ? 'running' : 'unhealthy';
            }
            const runtime = {
                id: item.id,
                name: item.name,
                category: item.category,
                installed: item.installed,
                version: item.version,
                executablePath: item.executablePath,
                status,
                health: healthState,
                envVars: item.envVars,
                rawEnvVars: item.rawEnvVars,
                capabilities: item.capabilities,
                installUrl: item.installUrl,
                missingDependencies: item.missingDependencies,
                lastChecked: Date.now(),
            };
            this.events.emitDetected(runtime);
            return runtime;
        }));
        this.cache.set('all_runtimes', discovered);
        this.events.emitCompleted(discovered);
        // Sync discovered runtimes to RuntimeManager / ExternalRuntimeManager if provided
        this.syncWithRuntimeManagers(discovered);
        return discovered;
    }
    /**
     * Returns a single discovered runtime by id.
     */
    async getRuntime(id) {
        const all = await this.discoverRuntimes();
        return all.find((r) => r.id === id) || null;
    }
    /**
     * Validates an executable path for a runtime.
     */
    async validateRuntimePath(execPath, versionFlag = '--version') {
        return this.validator.validateExecutable(execPath, versionFlag);
    }
    /**
     * Probes the health of a specific runtime on demand.
     */
    async checkHealth(id) {
        const target = await this.getRuntime(id);
        const res = await this.healthChecker.checkHealth(id, target?.executablePath, target?.rawEnvVars);
        this.events.emitHealthChanged(id, res.health);
        return res;
    }
    /**
     * Runs complete system environment diagnostics.
     */
    async runDiagnostics() {
        const diag = await this.doctor.runDiagnostics();
        this.events.emitEnvironmentChanged(diag);
        return diag;
    }
    /**
     * Updates runtime discovery configuration and clears cache.
     */
    updateConfig(partial) {
        this.config.updateConfig(partial);
        this.cache.invalidate();
        if (partial.autoScan !== undefined) {
            if (partial.autoScan) {
                this.startAutoScan();
            }
            else {
                this.stopAutoScan();
            }
        }
    }
    /**
     * Exposes event emitter listeners.
     */
    get eventsBus() {
        return this.events;
    }
    startAutoScan() {
        this.stopAutoScan();
        const interval = this.config.getConfig().scanIntervalMs;
        this.autoScanTimer = setInterval(() => {
            this.discoverRuntimes(true).catch(() => { });
        }, interval);
    }
    stopAutoScan() {
        if (this.autoScanTimer) {
            clearInterval(this.autoScanTimer);
            this.autoScanTimer = null;
        }
    }
    syncWithRuntimeManagers(discovered) {
        for (const rt of discovered) {
            if (!rt.installed)
                continue;
            if (rt.category === 'external' && this.externalRuntimeManager) {
                const existing = this.externalRuntimeManager.getExternalRuntime(rt.id);
                if (!existing) {
                    this.externalRuntimeManager.registerExternalRuntime({
                        id: rt.id,
                        name: rt.name,
                        command: rt.executablePath || 'node',
                        args: [],
                        mode: 'cli',
                        transport: 'stdio',
                        env: rt.rawEnvVars,
                    });
                }
            }
        }
    }
    dispose() {
        this.stopAutoScan();
        this.events.removeAllListeners();
    }
}
exports.RuntimeDiscoveryEngine = RuntimeDiscoveryEngine;
//# sourceMappingURL=runtime-discovery-engine.js.map