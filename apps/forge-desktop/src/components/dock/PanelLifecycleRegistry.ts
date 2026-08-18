/**
 * PanelLifecycleRegistry.ts — Idempotent Registry for Dock Panel Lifecycles
 */

import { IPanelLifecycle, PanelState } from './PanelLifecycleTypes';

export class PanelLifecycleRegistryImpl {
  private readonly lifecycles = new Map<string, IPanelLifecycle>();
  private readonly states = new Map<string, PanelState>();

  /**
   * Registers lifecycle callbacks for a panel.
   * Defaults state to SUSPENDED until activated.
   */
  register(panelId: string, lifecycle: Partial<IPanelLifecycle>): void {
    const fullLifecycle: IPanelLifecycle = {
      suspend: lifecycle.suspend ?? (() => {}),
      resume: lifecycle.resume ?? (() => {}),
      dispose: lifecycle.dispose ?? (() => {}),
    };
    this.lifecycles.set(panelId, fullLifecycle);
    if (!this.states.has(panelId)) {
      this.states.set(panelId, PanelState.SUSPENDED);
    }
  }

  /** Unregisters lifecycle callbacks for a panel */
  unregister(panelId: string): void {
    this.lifecycles.delete(panelId);
    this.states.delete(panelId);
  }

  /** Gets current state for a panel */
  getState(panelId: string): PanelState {
    return this.states.get(panelId) ?? PanelState.SUSPENDED;
  }

  /**
   * Idempotent resume() execution for a panel.
   * If already ACTIVE or DISPOSED, does nothing.
   */
  async resume(panelId: string): Promise<void> {
    const currentState = this.getState(panelId);
    if (currentState === PanelState.ACTIVE || currentState === PanelState.DISPOSED) {
      return;
    }

    const lifecycle = this.lifecycles.get(panelId);
    this.states.set(panelId, PanelState.ACTIVE);
    if (lifecycle) {
      try {
        await lifecycle.resume();
      } catch (err) {
        console.error(`[PanelLifecycleRegistry] Error in resume() for panel "${panelId}":`, err);
      }
    }
  }

  /**
   * Idempotent suspend() execution for a panel.
   * If already SUSPENDED or DISPOSED, does nothing.
   */
  async suspend(panelId: string): Promise<void> {
    const currentState = this.getState(panelId);
    if (currentState === PanelState.SUSPENDED || currentState === PanelState.DISPOSED) {
      return;
    }

    const lifecycle = this.lifecycles.get(panelId);
    this.states.set(panelId, PanelState.SUSPENDED);
    if (lifecycle) {
      try {
        await lifecycle.suspend();
      } catch (err) {
        console.error(`[PanelLifecycleRegistry] Error in suspend() for panel "${panelId}":`, err);
      }
    }
  }

  /**
   * Idempotent dispose() execution for a panel.
   * Sets state to DISPOSED and cleans up callbacks.
   */
  async dispose(panelId: string): Promise<void> {
    const currentState = this.getState(panelId);
    if (currentState === PanelState.DISPOSED) {
      return;
    }

    const lifecycle = this.lifecycles.get(panelId);
    this.states.set(panelId, PanelState.DISPOSED);
    if (lifecycle) {
      try {
        await lifecycle.dispose();
      } catch (err) {
        console.error(`[PanelLifecycleRegistry] Error in dispose() for panel "${panelId}":`, err);
      }
    }
    this.lifecycles.delete(panelId);
  }

  /**
   * Disposes all registered panels cleanly.
   * Invoked on workspace close or application shutdown.
   */
  async disposeAll(): Promise<void> {
    const panelIds = Array.from(this.states.keys());
    for (const id of panelIds) {
      await this.dispose(id);
    }
  }
}

export const PanelLifecycleRegistry = new PanelLifecycleRegistryImpl();
