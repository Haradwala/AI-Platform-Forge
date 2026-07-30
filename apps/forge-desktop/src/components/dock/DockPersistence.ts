/**
 * DockPersistence.ts — LocalStorage State Persistence for WorkbenchDock
 */

export interface SavedDockState {
  targetHeightPx: number;
  lastExpandedHeightPx: number;
  snapPoint: string;
  dockMode: 'bottom' | 'docked' | 'floating';
  activeTabId: string;
  isCollapsed: boolean;
}

const STORAGE_KEY = 'forge_workbench_dock_state_v1';

export class DockPersistence {
  static save(state: SavedDockState): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignored
    }
  }

  static load(): SavedDockState | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SavedDockState;
    } catch {
      return null;
    }
  }
}
