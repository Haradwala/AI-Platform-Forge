/**
 * runtime-discovery-engine.ts — Phase 23 Runtime Discovery Engine
 *
 * Primary coordinator for automated discovery, validation, health monitoring,
 * environment diagnostics, and runtime workspace synchronization.
 */

import { RuntimeDetector } from './runtime-detector';
import { RuntimeValidator } from './runtime-validator';
import { RuntimeHealthChecker } from './runtime-health';
import { EnvironmentDoctor, EnvironmentDiagnostics } from './environment-doctor';
import { RuntimeConfig } from './runtime-config';
import { RuntimeCache } from './runtime-cache';
import { RuntimeEvents } from './runtime-events';
import type {
  DiscoveredRuntime,
  RuntimeDiscoveryEngineOptions,
  KnownRuntimeId,
} from './runtime-types';
import type { RuntimeManager } from '../runtime/runtime-manager';
import type { ExternalRuntimeManager } from '../external/external-runtime-manager';

export class RuntimeDiscoveryEngine {
  private detector = new RuntimeDetector();
  private validator = new RuntimeValidator();
  private healthChecker = new RuntimeHealthChecker();
  private doctor = new EnvironmentDoctor();
  private config: RuntimeConfig;
  private cache = new RuntimeCache<DiscoveredRuntime[]>();
  private events = new RuntimeEvents();
  private autoScanTimer: NodeJS.Timeout | null = null;

  constructor(
    options?: RuntimeDiscoveryEngineOptions,
    private readonly runtimeManager?: RuntimeManager,
    private readonly externalRuntimeManager?: ExternalRuntimeManager
  ) {
    this.config = new RuntimeConfig(options);
    if (this.config.getConfig().autoScan) {
      this.startAutoScan();
    }
  }

  /**
   * Discovers all installed, cloud, and local runtimes across the system environment.
   */
  async discoverRuntimes(forceRefresh = false): Promise<DiscoveredRuntime[]> {
    if (!forceRefresh) {
      const cached = this.cache.get('all_runtimes', this.config.getConfig().cacheTtlMs);
      if (cached) return cached;
    }

    this.events.emitStarted();

    const rawDetections = await this.detector.detectAll(this.config);

    const discovered: DiscoveredRuntime[] = await Promise.all(
      rawDetections.map(async (item) => {
        let healthState: 'healthy' | 'degraded' | 'unhealthy' | 'unknown' = 'unknown';
        let status: 'stopped' | 'running' | 'unhealthy' | 'error' | 'not_installed' = 'not_installed';

        if (item.installed) {
          const healthRes = await this.healthChecker.checkHealth(
            item.id,
            item.executablePath,
            item.rawEnvVars
          );
          healthState = healthRes.health;
          status = healthState === 'healthy' || healthState === 'degraded' ? 'running' : 'unhealthy';
        }

        const runtime: DiscoveredRuntime = {
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
      })
    );

    this.cache.set('all_runtimes', discovered);
    this.events.emitCompleted(discovered);

    // Sync discovered runtimes to RuntimeManager / ExternalRuntimeManager if provided
    this.syncWithRuntimeManagers(discovered);

    return discovered;
  }

  /**
   * Returns a single discovered runtime by id.
   */
  async getRuntime(id: KnownRuntimeId): Promise<DiscoveredRuntime | null> {
    const all = await this.discoverRuntimes();
    return all.find((r) => r.id === id) || null;
  }

  /**
   * Validates an executable path for a runtime.
   */
  async validateRuntimePath(
    execPath: string,
    versionFlag = '--version'
  ) {
    return this.validator.validateExecutable(execPath, versionFlag);
  }

  /**
   * Probes the health of a specific runtime on demand.
   */
  async checkHealth(id: KnownRuntimeId) {
    const target = await this.getRuntime(id);
    const res = await this.healthChecker.checkHealth(
      id,
      target?.executablePath,
      target?.rawEnvVars
    );
    this.events.emitHealthChanged(id, res.health);
    return res;
  }

  /**
   * Runs complete system environment diagnostics.
   */
  async runDiagnostics(): Promise<EnvironmentDiagnostics> {
    const diag = await this.doctor.runDiagnostics();
    this.events.emitEnvironmentChanged(diag);
    return diag;
  }

  /**
   * Updates runtime discovery configuration and clears cache.
   */
  updateConfig(partial: Partial<RuntimeDiscoveryEngineOptions>): void {
    this.config.updateConfig(partial);
    this.cache.invalidate();
    if (partial.autoScan !== undefined) {
      if (partial.autoScan) {
        this.startAutoScan();
      } else {
        this.stopAutoScan();
      }
    }
  }

  /**
   * Exposes event emitter listeners.
   */
  get eventsBus(): RuntimeEvents {
    return this.events;
  }

  startAutoScan(): void {
    this.stopAutoScan();
    const interval = this.config.getConfig().scanIntervalMs;
    this.autoScanTimer = setInterval(() => {
      this.discoverRuntimes(true).catch(() => {});
    }, interval);
  }

  stopAutoScan(): void {
    if (this.autoScanTimer) {
      clearInterval(this.autoScanTimer);
      this.autoScanTimer = null;
    }
  }

  private syncWithRuntimeManagers(discovered: DiscoveredRuntime[]): void {
    for (const rt of discovered) {
      if (!rt.installed) continue;

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

  dispose(): void {
    this.stopAutoScan();
    this.events.removeAllListeners();
  }
}
