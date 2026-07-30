import { create } from 'zustand';
import { IFileTreeItem } from '../../electron/main/container/service-interfaces';
import { WorkspaceClient } from '../services/workspace-client';
import { restoreSession } from '../services/session-helper';
import { useEditorStore } from './editor-store';

interface WorkspaceState {
  rootPath: string | null;
  fileTree: IFileTreeItem | null;
  recentWorkspaces: string[];
  isLoading: boolean;
  error: string | null;

  openWorkspace: (path: string) => Promise<void>;
  closeWorkspace: () => Promise<void>;
  refreshTree: () => Promise<void>;
  loadRecentWorkspaces: () => Promise<void>;
  clearRecent: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => {
  // Subscribe to file watch events from Main Process to trigger automatic reload of the tree
  if (typeof window !== 'undefined' && window.forge) {
    const handleFileChange = () => {
      // Throttle or simply trigger a tree refresh
      get().refreshTree();
    };

    window.forge.on('workspace:file-created', handleFileChange);
    window.forge.on('workspace:file-changed', handleFileChange);
    window.forge.on('workspace:file-deleted', handleFileChange);
  }

  return {
    rootPath: null,
    fileTree: null,
    recentWorkspaces: [],
    isLoading: false,
    error: null,

    openWorkspace: async (path: string) => {
      set({ isLoading: true, error: null });
      try {
        const tree = await WorkspaceClient.openFolder(path);
        set({
          rootPath: path,
          fileTree: tree,
          isLoading: false,
        });
        await get().loadRecentWorkspaces();
        // Restore active editor tabs and layout
        await restoreSession();
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : String(err),
          isLoading: false,
        });
      }
    },

    closeWorkspace: async () => {
      set({ isLoading: true, error: null });
      try {
        await WorkspaceClient.close();
        set({
          rootPath: null,
          fileTree: null,
          isLoading: false,
        });
        // Clear active editor tabs
        useEditorStore.getState().clearTabs();
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : String(err),
          isLoading: false,
        });
      }
    },

    refreshTree: async () => {
      if (!get().rootPath) return;
      try {
        const tree = await WorkspaceClient.getTree();
        set({ fileTree: tree });
      } catch (err) {
        console.error('[WorkspaceStore] Failed to refresh file tree:', err);
      }
    },

    loadRecentWorkspaces: async () => {
      try {
        const recent = await WorkspaceClient.getRecent();
        set({ recentWorkspaces: recent });
      } catch (err) {
        console.error('[WorkspaceStore] Failed to load recent workspaces:', err);
      }
    },

    clearRecent: async () => {
      try {
        await window.forge.invoke('session:clear'); // or clear recent file
        set({ recentWorkspaces: [] });
      } catch (err) {
        console.error('[WorkspaceStore] Failed to clear recent workspaces:', err);
      }
    },
  };
});
