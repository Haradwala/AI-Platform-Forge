import type { IFileTreeItem, IWindowState } from '../../electron/main/container/service-interfaces';

export interface DesktopEventMap {
  // Workspace events
  'workspace:opened': { rootPath: string; tree: IFileTreeItem };
  'workspace:closed': void;
  'workspace:file-created': { path: string; isDirectory: boolean };
  'workspace:file-changed': { path: string };
  'workspace:file-deleted': { path: string };

  // Theme events
  'theme:loaded': { themeId: string };

  // Window events
  'window:state-changed': IWindowState & { workspaceOpen?: boolean; rootPath?: string | null };

  // Startup events
  'startup:stage-changed': { stage: string };

  // Focus events
  'focus:changed': { oldFocus: string | null; newFocus: string | null };

  // Dock & Panel Lifecycle events
  'dock:opened': { position: 'bottom' | 'left' | 'right'; activePanelId: string };
  'dock:closed': void;
  'dock:moved': { position: 'bottom' | 'left' | 'right' };
  'dock:resized': { size: number; position: 'bottom' | 'left' | 'right' };
  'dock:panel-activated': { panelId: string };
  'panel:resumed': { panelId: string; timestamp: string };
  'panel:suspended': { panelId: string; timestamp: string };
  'panel:disposed': { panelId: string; timestamp: string };

  // AI events
  'ai:execute-command': { commandId: string; args?: any[] };
  /** Raw orchestrator pipeline event stream from main process */
  'ai:event': { type: string; payload: any };
}
