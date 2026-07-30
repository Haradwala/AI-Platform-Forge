/**
 * DockStore.ts — Zustand Store for Forge WorkbenchDock
 */

import { create } from 'zustand';
import { DockSnapEngine, SnapPointName } from './DockSnapEngine';
import { DockPersistence } from './DockPersistence';

export type DockMode = 'bottom' | 'docked' | 'floating';

export interface DockState {
  targetHeightPx: number;
  actualHeightPx: number;
  lastExpandedHeightPx: number;
  snapPoint: SnapPointName;
  dockMode: DockMode;
  activeTabId: string;
  isDragging: boolean;
  isCollapsed: boolean;

  // Actions
  setHeightPx: (heightPx: number) => void;
  setSnapPoint: (snap: SnapPointName, viewportHeightPx?: number) => void;
  setDockMode: (mode: DockMode) => void;
  setActiveTab: (tabId: string) => void;
  toggleMaximize: (viewportHeightPx?: number) => void;
  collapse: () => void;
  restoreLastExpanded: (viewportHeightPx?: number) => void;
  startDragging: () => void;
  stopDragging: (velocityPx?: number, viewportHeightPx?: number) => void;
  persist: () => void;
}

const saved = DockPersistence.load();

export const useDockStore = create<DockState>((set, get) => ({
  targetHeightPx: saved?.targetHeightPx ?? 280,
  actualHeightPx: saved?.targetHeightPx ?? 280,
  lastExpandedHeightPx: saved?.lastExpandedHeightPx ?? 280,
  snapPoint: (saved?.snapPoint as SnapPointName) ?? 'quarter',
  dockMode: saved?.dockMode ?? 'bottom',
  activeTabId: saved?.activeTabId ?? 'terminal',
  isDragging: false,
  isCollapsed: saved?.isCollapsed ?? false,

  setHeightPx: (heightPx: number) => {
    const clamped = Math.max(0, heightPx);
    set({ targetHeightPx: clamped, actualHeightPx: clamped });
  },

  setSnapPoint: (snap: SnapPointName, viewportHeightPx: number = 800) => {
    const targets = DockSnapEngine.getSnapTargets(viewportHeightPx);
    const found = targets.find((t) => t.name === snap) || targets[2];

    const isCollapsed = snap === 'hidden' || snap === 'peek';
    const nextLastExp = !isCollapsed ? found.heightPx : get().lastExpandedHeightPx;

    set({
      snapPoint: snap,
      targetHeightPx: found.heightPx,
      actualHeightPx: found.heightPx,
      isCollapsed,
      lastExpandedHeightPx: nextLastExp,
    });
    get().persist();
  },

  setDockMode: (mode: DockMode) => {
    set({ dockMode: mode });
    get().persist();
  },

  setActiveTab: (tabId: string) => {
    set({ activeTabId: tabId });
    if (get().isCollapsed) {
      get().restoreLastExpanded();
    }
    get().persist();
  },

  toggleMaximize: (viewportHeightPx: number = 800) => {
    const current = get().snapPoint;
    if (current === 'threeQuarter' || current === 'full') {
      get().setSnapPoint('quarter', viewportHeightPx);
    } else {
      get().setSnapPoint('threeQuarter', viewportHeightPx);
    }
  },

  collapse: () => {
    get().setSnapPoint('peek');
  },

  restoreLastExpanded: (viewportHeightPx: number = 800) => {
    const last = get().lastExpandedHeightPx;
    const vh = Math.max(viewportHeightPx, 300);
    const snap = DockSnapEngine.findNearestSnap(last, 0, vh);
    get().setSnapPoint(snap.name, vh);
  },

  startDragging: () => {
    set({ isDragging: true });
  },

  stopDragging: (velocityPx: number = 0, viewportHeightPx: number = 800) => {
    const { actualHeightPx } = get();
    const nearest = DockSnapEngine.findNearestSnap(actualHeightPx, velocityPx, viewportHeightPx);
    set({ isDragging: false });
    get().setSnapPoint(nearest.name, viewportHeightPx);
  },

  persist: () => {
    const { targetHeightPx, lastExpandedHeightPx, snapPoint, dockMode, activeTabId, isCollapsed } = get();
    DockPersistence.save({
      targetHeightPx,
      lastExpandedHeightPx,
      snapPoint,
      dockMode,
      activeTabId,
      isCollapsed,
    });
  },
}));
