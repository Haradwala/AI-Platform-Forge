import { IFileTreeItem } from '../../electron/main/container/service-interfaces';

/**
 * WorkspaceClient — provides a typed frontend interface to call workspace IPC handlers.
 *
 * Uses the window.forge.invoke API exposed via preload.
 */
export class WorkspaceClient {
  /**
   * Opens a native OS folder-picker dialog.
   * Returns the selected path, or null if the user cancelled.
   */
  static async pickFolder(): Promise<string | null> {
    const res = await window.forge.invoke('workspace:pick-folder');
    return (res as string | null) ?? null;
  }

  static async openFolder(path: string): Promise<IFileTreeItem> {
    const res = await window.forge.invoke('workspace:open-folder', path);
    return res as IFileTreeItem;
  }


  static async close(): Promise<void> {
    await window.forge.invoke('workspace:close');
  }

  static async getTree(): Promise<IFileTreeItem | null> {
    const res = await window.forge.invoke('workspace:get-tree');
    return res as IFileTreeItem | null;
  }

  static async readFile(path: string): Promise<string> {
    const res = await window.forge.invoke('workspace:read-file', path);
    return res as string;
  }

  static async writeFile(path: string, content: string): Promise<void> {
    await window.forge.invoke('workspace:write-file', path, content);
  }

  static async createFile(path: string): Promise<void> {
    await window.forge.invoke('workspace:create-file', path);
  }

  static async createFolder(path: string): Promise<void> {
    await window.forge.invoke('workspace:create-folder', path);
  }

  static async renameEntry(oldPath: string, newPath: string): Promise<void> {
    await window.forge.invoke('workspace:rename-entry', oldPath, newPath);
  }

  static async deleteEntry(path: string): Promise<void> {
    await window.forge.invoke('workspace:delete-entry', path);
  }

  static async getRecent(): Promise<string[]> {
    const res = await window.forge.invoke('workspace:get-recent');
    return res as string[];
  }
}
