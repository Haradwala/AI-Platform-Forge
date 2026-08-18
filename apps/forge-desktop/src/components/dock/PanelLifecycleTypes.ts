/**
 * PanelLifecycleTypes.ts — Type Definitions for Forge Dock Panel Lifecycle
 */

export enum PanelState {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DISPOSED = 'DISPOSED',
}

export interface IPanelLifecycle {
  /**
   * Called when panel becomes invisible or dock collapses.
   * Implementation must pause timers, observers, and polling without destroying UI state.
   */
  suspend: () => void | Promise<void>;

  /**
   * Called when panel becomes visible.
   * Implementation reconnects observers, resynchronizes view, and triggers layout refit.
   */
  resume: () => void | Promise<void>;

  /**
   * Called when panel is permanently teardown or application shuts down.
   * Implementation disposes underlying native resources (xterm, PTY, listeners).
   */
  dispose: () => void | Promise<void>;
}

export interface PanelLifecycleEventPayload {
  panelId: string;
  timestamp: string;
}
