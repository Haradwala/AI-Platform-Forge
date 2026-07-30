/**
 * session-store.ts — Phase 25-28 Workspace Session & Persistence Store
 */

import { create } from 'zustand';

export interface SessionState {
  workspaceRoot: string | null;
  lastSavedAt: number | null;
  openTabs: Array<{ id: string; filePath: string; line?: number }>;
  activeTabId: string | null;
  recentCommands: string[];
  terminalState: {
    activeTerminals: Array<{ id: string; cwd: string }>;
  };
  approvals: Array<{ id: string; toolName: string; approvedAt: number }>;
  isSaving: boolean;

  setWorkspaceRoot: (root: string | null) => void;
  saveSession: () => Promise<void>;
  restoreSession: (workspaceRoot: string) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  workspaceRoot: null,
  lastSavedAt: null,
  openTabs: [],
  activeTabId: null,
  recentCommands: [],
  terminalState: { activeTerminals: [] },
  approvals: [],
  isSaving: false,

  setWorkspaceRoot: (root: string | null) => {
    set({ workspaceRoot: root });
    if (root) {
      get().restoreSession(root);
    }
  },

  saveSession: async () => {
    const root = get().workspaceRoot;
    if (!root) return;
    set({ isSaving: true });
    try {
      if (typeof window !== 'undefined' && window.forge) {
        await window.forge.invoke('workspace:save-session', {
          workspaceRoot: root,
          lastSavedAt: Date.now(),
          openTabs: get().openTabs,
          activeTabId: get().activeTabId ?? undefined,
          recentCommands: get().recentCommands,
          terminalState: get().terminalState,
          approvals: get().approvals,
          activeSessions: [],
        });
        set({ lastSavedAt: Date.now(), isSaving: false });
      }
    } catch (err) {
      console.error('[SessionStore] Save session failed:', err);
      set({ isSaving: false });
    }
  },

  restoreSession: async (workspaceRoot: string) => {
    try {
      if (typeof window !== 'undefined' && window.forge) {
        const res: any = await window.forge.invoke('workspace:restore-session', workspaceRoot);
        if (res?.success && res.session) {
          const s = res.session;
          set({
            workspaceRoot,
            lastSavedAt: s.lastSavedAt,
            openTabs: s.openTabs || [],
            activeTabId: s.activeTabId || null,
            recentCommands: s.recentCommands || [],
            terminalState: s.terminalState || { activeTerminals: [] },
            approvals: s.approvals || [],
          });
        }
      }
    } catch (err) {
      console.error('[SessionStore] Restore session failed:', err);
    }
  },
}));
