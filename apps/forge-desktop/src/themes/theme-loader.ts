import { ForgeTheme, convertVSCodeTheme } from './vscode-compat';
import forgeDark from './built-in/forge-dark.json';
import forgeLight from './built-in/forge-light.json';

export class ThemeLoader {
  private static readonly BUILT_IN_THEMES: Record<string, ForgeTheme> = {
    'forge-dark': forgeDark as ForgeTheme,
    'forge-light': forgeLight as ForgeTheme,
  };

  /**
   * Loads a theme definition by its ID. Falls back to static built-ins,
   * otherwise queries the Electron main process if available.
   */
  static async loadTheme(id: string): Promise<ForgeTheme> {
    // 1. Check built-in themes
    if (this.BUILT_IN_THEMES[id]) {
      return this.BUILT_IN_THEMES[id];
    }

    // 2. Query Electron main process if running in container context
    if (typeof window !== 'undefined' && window.forge) {
      try {
        const rawTheme = await window.forge.invoke('theme:load', id) as any;
        if (rawTheme) {
          if (rawTheme.colors) {
            return convertVSCodeTheme(id, rawTheme);
          }
          return rawTheme as ForgeTheme;
        }
      } catch (err) {
        console.error(`[ThemeLoader] Failed to query theme "${id}" over IPC:`, err);
      }
    }

    // Fallback to dark theme
    return this.BUILT_IN_THEMES['forge-dark'];
  }
}
