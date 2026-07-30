/**
 * external-runtime-manager.ts — Phase 18 External Runtime Foundation
 *
 * Manages external runtime instances, process lifecycles, and session tracking.
 */

import { ExternalRuntime } from './external-runtime';
import type { ExternalRuntimeConfig, ExternalRuntimeState } from './external-types';
import type { RuntimeManager } from '../runtime/runtime-manager';

export class ExternalRuntimeManager {
  private readonly externalRuntimes = new Map<string, ExternalRuntime>();

  constructor(private readonly runtimeManager?: RuntimeManager) {}

  /**
   * Registers a new ExternalRuntime configuration.
   */
  registerExternalRuntime(config: ExternalRuntimeConfig): ExternalRuntime {
    const runtime = new ExternalRuntime(config);
    this.externalRuntimes.set(runtime.id, runtime);

    if (this.runtimeManager) {
      this.runtimeManager.register(runtime);
    }

    return runtime;
  }

  getExternalRuntime(id: string): ExternalRuntime | undefined {
    return this.externalRuntimes.get(id);
  }

  getAllExternalRuntimes(): ExternalRuntime[] {
    return Array.from(this.externalRuntimes.values());
  }

  async startRuntime(id: string): Promise<void> {
    const rt = this.externalRuntimes.get(id);
    if (!rt) {
      throw new Error(`[ExternalRuntimeManager] Runtime with id "${id}" not found.`);
    }
    await rt.start();
  }

  async stopRuntime(id: string): Promise<void> {
    const rt = this.externalRuntimes.get(id);
    if (rt) {
      await rt.stop();
    }
  }

  async stopAll(): Promise<void> {
    for (const rt of this.externalRuntimes.values()) {
      await rt.dispose();
    }
    this.externalRuntimes.clear();
  }

  getRuntimeStates(): Record<string, ExternalRuntimeState> {
    const states: Record<string, ExternalRuntimeState> = {};
    for (const [id, rt] of this.externalRuntimes.entries()) {
      states[id] = rt.getState();
    }
    return states;
  }
}
