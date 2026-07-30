import { ForgeTheme } from './vscode-compat';

export class ThemeManager {
  /**
   * Applies the colors of a ForgeTheme to the DOM by writing CSS variables
   * to the document root element.
   */
  static applyThemeToDOM(theme: ForgeTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // 1. Clear any previous inline styling variables we applied
    // (though not strictly necessary as setProperty will override them)
    Object.keys(theme.colors).forEach((key) => {
      root.style.setProperty(`--${key}`, theme.colors[key]);
    });

    // 2. Add class toggles for light/dark theme selectors if needed
    const isLight = theme.id.includes('light') || (theme.name && theme.name.toLowerCase().includes('light'));
    if (isLight) {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    }
  }
}
