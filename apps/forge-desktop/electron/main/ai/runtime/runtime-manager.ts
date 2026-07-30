/**
 * runtime-manager.ts
 *
 * RuntimeManager — canonical implementation of IRuntimeManager.
 *
 * Responsibilities:
 *  - Register / unregister AI runtimes
 *  - Track the active runtime
 *  - Discover models on local runtimes (non-blocking)
 *  - Probe runtime health
 *  - Expose a metadata list for IPC / UI serialisation
 *
 * Backward compatibility:
 *  - RuntimeManager structurally satisfies IProviderRegistry because
 *    register / getById / getAll operate on IAiRuntime which extends IAiProvider.
 *  - session/provider-registry.ts re-exports this class as ProviderRegistry
 *    so existing imports continue to compile without modification.
 */

import type { IRuntimeManager, IAiRuntime, RuntimeHealth, RuntimeListEntry } from './runtime-types';
import type { IConfigurationService } from '../../config/configuration-service';

export class RuntimeManager implements IRuntimeManager {
  private readonly runtimes = new Map<string, IAiRuntime>();
  private activeId: string | null = null;

  constructor(private readonly configService?: IConfigurationService) {}

  // ─── IRuntimeRegistry ──────────────────────────────────────────────────────

  register(runtime: IAiRuntime): void {
    this.runtimes.set(runtime.id, runtime);
    // If activeId is not set yet, attempt to set from configService or default to first registered.
    if (this.activeId === null) {
      const configuredId = this.configService?.getActiveRuntime();
      if (configuredId && configuredId === runtime.id) {
        this.activeId = configuredId;
      } else if (!configuredId) {
        this.activeId = runtime.id;
      }
    } else {
      // Re-evaluate if incoming registration matches configured runtime
      const configuredId = this.configService?.getActiveRuntime();
      if (configuredId && configuredId === runtime.id) {
        this.activeId = configuredId;
      }
    }
  }

  getById(id: string): IAiRuntime | null {
    return this.runtimes.get(id) ?? null;
  }

  getAll(): IAiRuntime[] {
    return Array.from(this.runtimes.values());
  }

  // ─── IRuntimeManager ──────────────────────────────────────────────────────

  activate(id: string): void {
    if (!this.runtimes.has(id)) {
      throw new Error(`[RuntimeManager] Unknown runtime id: "${id}". Register it before activating.`);
    }
    this.activeId = id;
    if (this.configService) {
      this.configService.setActiveRuntime(id);
    }
    // Fire optional lifecycle hook; errors are not propagated to callers.
    const runtime = this.runtimes.get(id)!;
    if (runtime.initialize) {
      runtime.initialize().catch(() => {/* swallowed */});
    }
  }

  active(): IAiRuntime {
    if (this.activeId !== null && this.runtimes.has(this.activeId)) {
      return this.runtimes.get(this.activeId)!;
    }
    // Fallback to configured active runtime if registered
    const configuredId = this.configService?.getActiveRuntime();
    if (configuredId && this.runtimes.has(configuredId)) {
      this.activeId = configuredId;
      return this.runtimes.get(configuredId)!;
    }
    // Fallback to first registered
    const first = this.runtimes.values().next().value;
    if (!first) {
      throw new Error('[RuntimeManager] No runtimes registered. Call register() before active().');
    }
    this.activeId = first.id;
    return first;
  }

  /**
   * Evaluates runtime health and falls back to a healthy runtime if current active is unhealthy.
   * Fallback order:
   *  1. Configured active runtime (if healthy)
   *  2. Healthy Ollama
   *  3. First healthy Cloud runtime
   *  4. Mock / First registered
   * Never throws.
   */
  async resolveFallbackRuntime(): Promise<IAiRuntime> {
    const healthMap = await this.health();

    // 1. Try active or configured active
    const currentId = this.activeId || this.configService?.getActiveRuntime();
    if (currentId && this.runtimes.has(currentId) && healthMap[currentId]?.healthy) {
      this.activeId = currentId;
      return this.runtimes.get(currentId)!;
    }

    // 2. Try healthy Ollama
    const ollama = this.runtimes.get('ollama');
    if (ollama && healthMap['ollama']?.healthy) {
      this.activeId = 'ollama';
      return ollama;
    }

    // 3. Try healthy Cloud runtime
    for (const rt of this.getAll()) {
      if (rt.runtimeType === 'cloud' && healthMap[rt.id]?.healthy) {
        this.activeId = rt.id;
        return rt;
      }
    }

    // 4. Fallback to Mock or first registered
    const mock = this.runtimes.get('mock');
    if (mock) {
      this.activeId = 'mock';
      return mock;
    }

    return this.active();
  }

  async discover(): Promise<void> {
    const locals = this.getAll().filter((r) => r.runtimeType === 'local');
    await Promise.allSettled(locals.map((r) => r.listAvailableModels()));
  }

  async health(): Promise<Record<string, RuntimeHealth>> {
    const entries = await Promise.all(
      this.getAll().map(async (r): Promise<[string, RuntimeHealth]> => {
        try {
          const result = await r.healthCheck();
          return [r.id, result];
        } catch (err) {
          return [
            r.id,
            {
              healthy: false,
              latencyMs: -1,
              error: err instanceof Error ? err.message : String(err),
            },
          ];
        }
      })
    );
    return Object.fromEntries(entries);
  }

  list(): RuntimeListEntry[] {
    return this.getAll().map((r) => ({
      id: r.id,
      name: r.name,
      runtimeType: r.runtimeType,
    }));
  }
}
