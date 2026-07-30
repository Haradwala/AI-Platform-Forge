import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ForgeTheme } from '../themes/vscode-compat';
import { ThemeLoader } from '../themes/theme-loader';
import { ThemeManager } from '../themes/theme-manager';
import { themeRegistry } from '../themes/theme-registry';

interface ThemeState {
  activeThemeId: string;
  theme: ForgeTheme | null;

  setTheme: (id: string) => Promise<void>;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      activeThemeId: 'forge-dark',
      theme: null,

      setTheme: async (id) => {
        try {
          const themeDef = await ThemeLoader.loadTheme(id);
          themeRegistry.register(themeDef);
          ThemeManager.applyThemeToDOM(themeDef);

          set(() => ({
            activeThemeId: id,
            theme: themeDef,
          }));

          // Notify Electron main process if available
          if (typeof window !== 'undefined' && window.forge) {
            await window.forge.invoke('theme:set', id);
          }
        } catch (err) {
          console.error(`[ThemeStore] Failed to set theme "${id}":`, err);
        }
      },

      initializeTheme: async () => {
        const currentId = get().activeThemeId || 'forge-dark';
        await get().setTheme(currentId);
      },
    }),
    {
      name: 'forge-theme-store',
      // Only persist activeThemeId
      partialize: (state) => ({ activeThemeId: state.activeThemeId }),
    }
  )
);
