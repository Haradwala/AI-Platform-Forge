export interface VSCodeThemeRaw {
  name?: string;
  colors?: Record<string, string>;
  type?: 'light' | 'dark';
}

export interface ForgeTheme {
  id: string;
  name: string;
  colors: Record<string, string>;
}

/**
 * vscode-compat.ts — maps a raw VSCode theme JSON to the Forge Theme schema.
 */
export function convertVSCodeTheme(id: string, vscodeTheme: VSCodeThemeRaw): ForgeTheme {
  const name = vscodeTheme.name || id;
  const colors = vscodeTheme.colors || {};

  // Standard conversion mapping
  const forgeColors: Record<string, string> = {
    'forge-bg':           colors['editor.background'] || colors['background'] || (vscodeTheme.type === 'light' ? '#ffffff' : '#1e1e1e'),
    'forge-bg-elevated':  colors['sideBar.background'] || colors['activityBar.background'] || (vscodeTheme.type === 'light' ? '#f3f3f3' : '#252526'),
    'forge-bg-active':    colors['list.activeSelectionBackground'] || (vscodeTheme.type === 'light' ? '#e4e4e4' : '#37373d'),
    'forge-bg-hover':     colors['list.hoverBackground'] || (vscodeTheme.type === 'light' ? '#f0f0f0' : '#2a2d2e'),
    'forge-bg-selection': colors['editor.selectionBackground'] || (vscodeTheme.type === 'light' ? '#add6ff' : '#264f78'),
    'forge-border':       colors['sideBar.border'] || colors['panel.border'] || (vscodeTheme.type === 'light' ? '#e4e4e4' : '#303030'),
    'forge-border-focus': colors['focusBorder'] || '#6366f1',
    'forge-text':         colors['foreground'] || (vscodeTheme.type === 'light' ? '#333333' : '#cccccc'),
    'forge-text-muted':   colors['descriptionForeground'] || colors['editorLineNumber.foreground'] || '#888888',
    'forge-accent':       colors['button.background'] || '#6366f1',
    'forge-accent-hover': colors['button.hoverBackground'] || '#7c7ff5',
    'forge-editor-bg':    colors['editor.background'] || (vscodeTheme.type === 'light' ? '#ffffff' : '#1e1e1e'),
    'forge-gutter-bg':    colors['editorGutter.background'] || colors['editor.background'] || (vscodeTheme.type === 'light' ? '#ffffff' : '#1e1e1e'),
    'forge-line-highlight': colors['editor.lineHighlightBackground'] || (vscodeTheme.type === 'light' ? '#f7f7f7' : '#282828'),
  };

  return {
    id,
    name,
    colors: forgeColors,
  };
}
