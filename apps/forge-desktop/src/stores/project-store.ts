/**
 * project-store.ts — Phase 25-28 Project & Import State Management
 */

import { create } from 'zustand';
import { RepositoryDescriptor, WorkspaceProfile } from '../../electron/main/ai/contracts/execution-contracts';

export interface ProjectState {
  isImporting: boolean;
  importError: string | null;
  currentProjectAnalysis: any | null;
  currentProfile: WorkspaceProfile | null;
  recentImports: Array<{ descriptor: RepositoryDescriptor; targetPath: string; importedAt: number }>;

  importRepository: (descriptor: RepositoryDescriptor, destinationRoot?: string) => Promise<void>;
  fetchWorkspaceProfile: (workspaceRoot: string) => Promise<void>;
  saveWorkspaceProfile: (workspaceRoot: string, profile: WorkspaceProfile) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  isImporting: false,
  importError: null,
  currentProjectAnalysis: null,
  currentProfile: null,
  recentImports: [],

  importRepository: async (descriptor: RepositoryDescriptor, destinationRoot?: string) => {
    set({ isImporting: true, importError: null });
    try {
      if (typeof window !== 'undefined' && window.forge) {
        const res: any = await window.forge.invoke('repository:import', { descriptor, destinationRoot });
        if (res?.success) {
          const result = res.result;
          set((state) => ({
            isImporting: false,
            currentProjectAnalysis: result.analysis,
            currentProfile: result.profile,
            recentImports: [
              { descriptor: result.descriptor, targetPath: result.targetPath, importedAt: result.importedAt },
              ...state.recentImports.filter((i) => i.targetPath !== result.targetPath),
            ],
          }));
        } else {
          set({ isImporting: false, importError: res?.error || 'Import failed' });
        }
      } else {
        set({ isImporting: false, importError: 'Forge IPC not available' });
      }
    } catch (err: any) {
      set({ isImporting: false, importError: err.message });
    }
  },

  fetchWorkspaceProfile: async (workspaceRoot: string) => {
    try {
      if (typeof window !== 'undefined' && window.forge) {
        const res: any = await window.forge.invoke('workspace:get-profile', workspaceRoot);
        if (res?.success) {
          set({ currentProfile: res.profile });
        }
      }
    } catch (err) {
      console.error('[ProjectStore] Failed to fetch workspace profile:', err);
    }
  },

  saveWorkspaceProfile: async (workspaceRoot: string, profile: WorkspaceProfile) => {
    try {
      if (typeof window !== 'undefined' && window.forge) {
        await window.forge.invoke('workspace:save-profile', { workspaceRoot, profile });
        set({ currentProfile: profile });
      }
    } catch (err) {
      console.error('[ProjectStore] Failed to save workspace profile:', err);
    }
  },
}));
