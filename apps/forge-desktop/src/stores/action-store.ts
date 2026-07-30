/**
 * action-store.ts — Phase 29 Action System Zustand Store
 *
 * State management for active actions, action history, pending approvals, and selected actions.
 */

import { create } from 'zustand';

export interface ActionStoreEntry {
  id: string;
  actionId: string;
  runtimeId: string;
  status: 'REQUESTED' | 'VALIDATED' | 'STARTED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  timestamp: number;
  durationMs?: number;
  params?: any;
  result?: any;
  error?: string;
  requiresApproval?: boolean;
}

export interface ActionStoreState {
  activeActions: ActionStoreEntry[];
  history: ActionStoreEntry[];
  pendingApprovals: ActionStoreEntry[];
  selectedAction: ActionStoreEntry | null;

  executeAction: (actionId: string, runtimeId: string, workspaceRoot: string, params: any, context?: any) => Promise<any>;
  approveAction: (requestId: string) => Promise<boolean>;
  rejectAction: (requestId: string) => Promise<boolean>;
  cancelAction: (requestId: string) => Promise<boolean>;
  loadHistory: (workspaceRoot: string) => Promise<void>;
  selectAction: (action: ActionStoreEntry | null) => void;
  handleActionEvent: (event: any) => void;
}

export const useActionStore = create<ActionStoreState>((set, get) => ({
  activeActions: [],
  history: [],
  pendingApprovals: [],
  selectedAction: null,

  executeAction: async (actionId, runtimeId, workspaceRoot, params, context) => {
    const request = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionId,
      runtimeId,
      workspaceRoot,
      params,
      context,
      timestamp: Date.now(),
    };

    if (window.forge?.invoke) {
      const response = (await window.forge.invoke('action:execute', request)) as any;
      if (response && response.result) {
        return response.result;
      }
    }
    return null;
  },

  approveAction: async (requestId) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('action:approve', { requestId })) as any;
      if (res?.success) {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.filter((a) => a.id !== requestId),
        }));
        return true;
      }
    }
    return false;
  },

  rejectAction: async (requestId) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('action:reject', { requestId })) as any;
      if (res?.success) {
        set((state) => ({
          pendingApprovals: state.pendingApprovals.filter((a) => a.id !== requestId),
        }));
        return true;
      }
    }
    return false;
  },

  cancelAction: async (requestId) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('action:cancel', { requestId })) as any;
      if (res?.success) {
        set((state) => ({
          activeActions: state.activeActions.filter((a) => a.id !== requestId),
        }));
        return true;
      }
    }
    return false;
  },

  loadHistory: async (workspaceRoot) => {
    if (window.forge?.invoke) {
      const res = (await window.forge.invoke('action:history', workspaceRoot)) as any;
      if (res?.success && Array.isArray(res.history)) {
        set({ history: res.history });
      }
    }
  },

  selectAction: (action) => set({ selectedAction: action }),

  handleActionEvent: (event: any) => {
    if (!event || !event.id) return;
    const entry: ActionStoreEntry = {
      id: event.id,
      actionId: event.actionId,
      runtimeId: event.runtimeId,
      status: event.state,
      timestamp: event.timestamp || Date.now(),
      durationMs: event.result?.durationMs,
      params: event.request?.params,
      result: event.result?.data,
      error: event.error || event.result?.error,
      requiresApproval: event.request?.context?.requiresApproval,
    };

    set((state) => {
      const activeIdx = state.activeActions.findIndex((a) => a.id === entry.id);
      let updatedActive = [...state.activeActions];
      if (activeIdx >= 0) {
        updatedActive[activeIdx] = entry;
      } else if (entry.status === 'STARTED' || entry.status === 'REQUESTED') {
        updatedActive.unshift(entry);
      }

      if (entry.status === 'COMPLETED' || entry.status === 'FAILED' || entry.status === 'CANCELLED') {
        updatedActive = updatedActive.filter((a) => a.id !== entry.id);
      }

      let updatedPending = [...state.pendingApprovals];
      if (entry.requiresApproval && entry.status === 'STARTED') {
        if (!updatedPending.some((p) => p.id === entry.id)) {
          updatedPending.push(entry);
        }
      } else if (entry.status === 'COMPLETED' || entry.status === 'CANCELLED' || entry.status === 'FAILED') {
        updatedPending = updatedPending.filter((p) => p.id !== entry.id);
      }

      return {
        activeActions: updatedActive,
        pendingApprovals: updatedPending,
        history: [entry, ...state.history.filter((h) => h.id !== entry.id)].slice(0, 100),
      };
    });
  },
}));
