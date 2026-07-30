import { create } from 'zustand';

export interface EditorTab {
  readonly path: string;
  readonly name: string;
  readonly content: string;
  readonly isDirty: boolean;
}

interface EditorState {
  tabs: readonly EditorTab[];
  activeTabPath: string | null;

  openFile: (filePath: string, name: string, content: string) => void;
  closeFile: (filePath: string) => void;
  setActiveTab: (filePath: string | null) => void;
  updateContent: (filePath: string, newContent: string) => void;
  saveActiveFile: (saveFn: (filePath: string, content: string) => Promise<void>) => Promise<void>;
  clearTabs: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [],
  activeTabPath: null,

  openFile: (filePath, name, content) => {
    const { tabs } = get();
    const existing = tabs.find((t) => t.path === filePath);

    if (!existing) {
      const newTab: EditorTab = {
        path: filePath,
        name,
        content,
        isDirty: false,
      };
      set(() => ({
        tabs: [...tabs, newTab],
        activeTabPath: filePath,
      }));
    } else {
      set(() => ({
        activeTabPath: filePath,
      }));
    }
  },

  closeFile: (filePath) => {
    const { tabs, activeTabPath } = get();
    const filtered = tabs.filter((t) => t.path !== filePath);
    let nextActive = activeTabPath;

    if (activeTabPath === filePath) {
      nextActive = filtered.length > 0 ? filtered[filtered.length - 1].path : null;
    }

    set(() => ({
      tabs: filtered,
      activeTabPath: nextActive,
    }));
  },

  setActiveTab: (filePath) => {
    set(() => ({ activeTabPath: filePath }));
  },

  updateContent: (filePath, newContent) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.path === filePath ? { ...t, content: newContent, isDirty: true } : t
      ),
    }));
  },

  saveActiveFile: async (saveFn) => {
    const { tabs, activeTabPath } = get();
    const activeTab = tabs.find((t) => t.path === activeTabPath);
    if (!activeTab || !activeTab.isDirty) return;

    try {
      await saveFn(activeTab.path, activeTab.content);
      set((state) => ({
        tabs: state.tabs.map((t) =>
          t.path === activeTabPath ? { ...t, isDirty: false } : t
        ),
      }));
    } catch (err) {
      console.error(`[EditorStore] Failed to save active file "${activeTabPath}":`, err);
      throw err;
    }
  },

  clearTabs: () => {
    set(() => ({ tabs: [], activeTabPath: null }));
  },
}));
