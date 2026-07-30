import { ForgeTheme } from './vscode-compat';

export class ThemeRegistry {
  private readonly themes = new Map<string, ForgeTheme>();

  register(theme: ForgeTheme): void {
    this.themes.set(theme.id, theme);
  }

  getById(id: string): ForgeTheme | null {
    return this.themes.get(id) ?? null;
  }

  getAll(): ForgeTheme[] {
    return Array.from(this.themes.values());
  }

  unregister(id: string): void {
    this.themes.delete(id);
  }

  clear(): void {
    this.themes.clear();
  }
}

export const themeRegistry = new ThemeRegistry();
