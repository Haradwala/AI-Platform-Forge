import { describe, it, expect, vi, beforeEach } from 'vitest';
import { convertVSCodeTheme } from '../src/themes/vscode-compat';
import { themeRegistry } from '../src/themes/theme-registry';
import { ThemeManager } from '../src/themes/theme-manager';
import { ThemeLoader } from '../src/themes/theme-loader';
import { useThemeStore } from '../src/stores/theme-store';

describe('Theme Engine', () => {
  beforeEach(() => {
    themeRegistry.clear();

    // Mock document structure
    if (typeof global !== 'undefined') {
      const properties: Record<string, string> = {};
      const classList = new Set<string>();

      (global as any).document = {
        documentElement: {
          style: {
            setProperty: vi.fn().mockImplementation((key, val) => {
              properties[key] = val;
            }),
          },
          classList: {
            add: vi.fn().mockImplementation((cls) => classList.add(cls)),
            remove: vi.fn().mockImplementation((cls) => classList.delete(cls)),
            contains: (cls: string) => classList.has(cls),
          },
        },
      } as any;

      (global as any).window = {
        forge: {
          invoke: vi.fn().mockImplementation(async (channel, ...args) => {
            if (channel === 'theme:load') {
              return {
                name: 'Custom main process theme',
                colors: {
                  'editor.background': '#ffffff',
                },
              };
            }
            if (channel === 'theme:list') {
              return ['forge-dark', 'forge-light', 'custom-theme'];
            }
            return { success: true };
          }),
        },
      };
    }
  });

  it('converts VSCode themes to Forge format', () => {
    const raw = {
      name: 'Dracula',
      type: 'dark',
      colors: {
        'editor.background': '#282a36',
        'foreground': '#f8f8f2',
      },
    } as any;

    const forgeTheme = convertVSCodeTheme('dracula', raw);
    expect(forgeTheme.id).toBe('dracula');
    expect(forgeTheme.name).toBe('Dracula');
    expect(forgeTheme.colors['forge-editor-bg']).toBe('#282a36');
    expect(forgeTheme.colors['forge-text']).toBe('#f8f8f2');
  });

  it('registers and retrieves themes', () => {
    const theme = { id: 'test', name: 'Test', colors: { 'forge-bg': '#000' } };
    themeRegistry.register(theme);
    expect(themeRegistry.getById('test')).toEqual(theme);
    expect(themeRegistry.getAll()).toContainEqual(theme);
  });

  it('applies theme variables to document element root', () => {
    const theme = { id: 'forge-light', name: 'Forge Light', colors: { 'forge-bg': '#fff', 'forge-text': '#000' } };
    ThemeManager.applyThemeToDOM(theme);

    const docRoot = document.documentElement;
    expect(docRoot.style.setProperty).toHaveBeenCalledWith('--forge-bg', '#fff');
    expect(docRoot.style.setProperty).toHaveBeenCalledWith('--forge-text', '#000');
    expect(docRoot.classList.add).toHaveBeenCalledWith('theme-light');
  });

  it('ThemeLoader loads built-in and falls back to main process IPC', async () => {
    // 1. Built-in
    const dark = await ThemeLoader.loadTheme('forge-dark');
    expect(dark.id).toBe('forge-dark');

    // 2. Custom via main-process IPC fallback
    const custom = await ThemeLoader.loadTheme('vscode-dracula');
    expect(custom.name).toBe('Custom main process theme');
    expect(custom.colors['forge-editor-bg']).toBe('#ffffff');
  });

  it('ThemeStore updates DOM and persists active selection', async () => {
    const store = useThemeStore.getState();
    await store.initializeTheme();

    expect(useThemeStore.getState().activeThemeId).toBe('forge-dark');
    expect(document.documentElement.style.setProperty).toHaveBeenCalled();
  });
});
