import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface IWorkspaceConfig {
  readonly id: string;
  readonly name: string;
  readonly openedAt: string;
}

/**
 * WorkspaceMetadata — handles the creation and management of workspace-specific
 * metadata inside the .forge/ directory, and manages the global recent workspaces list.
 */
export class WorkspaceMetadata {
  /**
   * Initializes the .forge/ directory, creates subfolders, updates .gitignore,
   * and registers the folder in the recent workspaces list.
   */
  static init(workspaceRoot: string): void {
    if (!fs.existsSync(workspaceRoot)) {
      throw new Error(`Workspace root does not exist: ${workspaceRoot}`);
    }

    const forgeDir = path.join(workspaceRoot, '.forge');
    fs.mkdirSync(forgeDir, { recursive: true });

    // 1. Create subdirectories
    const subdirs = ['cache', 'logs', 'checkpoints', 'indexes'];
    for (const subdir of subdirs) {
      fs.mkdirSync(path.join(forgeDir, subdir), { recursive: true });
    }

    // 2. Create workspace.json with basic metadata
    const workspaceJsonPath = path.join(forgeDir, 'workspace.json');
    if (!fs.existsSync(workspaceJsonPath)) {
      const config: IWorkspaceConfig = {
        id: Math.random().toString(36).substring(2, 15),
        name: path.basename(workspaceRoot),
        openedAt: new Date().toISOString(),
      };
      fs.writeFileSync(workspaceJsonPath, JSON.stringify(config, null, 2), 'utf-8');
    }

    // 3. Update .gitignore if present, or create one to ignore .forge/
    const gitignorePath = path.join(workspaceRoot, '.gitignore');
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }

    const hasIgnore = gitignoreContent
      .split('\n')
      .map((line) => line.trim())
      .includes('.forge/');

    if (!hasIgnore) {
      const separator = gitignoreContent.endsWith('\n') || gitignoreContent === '' ? '' : '\n';
      fs.writeFileSync(gitignorePath, gitignoreContent + separator + '.forge/\n', 'utf-8');
    }

    // 4. Update the global list of recent workspaces
    this.addToRecent(workspaceRoot);
  }

  /**
   * Returns the list of recent workspaces.
   */
  static getRecent(): string[] {
    try {
      const recentPath = this.getRecentFilePath();
      if (fs.existsSync(recentPath)) {
        const content = fs.readFileSync(recentPath, 'utf-8');
        return JSON.parse(content) as string[];
      }
    } catch {
      // Fallback if file corrupt or unreadable
    }
    return [];
  }

  /**
   * Clears the list of recent workspaces.
   */
  static clearRecent(): void {
    try {
      const recentPath = this.getRecentFilePath();
      if (fs.existsSync(recentPath)) {
        fs.unlinkSync(recentPath);
      }
    } catch {
      // safe fallback
    }
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private static addToRecent(workspaceRoot: string): void {
    try {
      const recentPath = this.getRecentFilePath();
      let list: string[] = [];
      if (fs.existsSync(recentPath)) {
        const content = fs.readFileSync(recentPath, 'utf-8');
        list = JSON.parse(content) as string[];
      }
      // Put the current workspace root first, deduplicate
      list = [workspaceRoot, ...list.filter((p) => p !== workspaceRoot)];
      // Keep up to 10 items
      list = list.slice(0, 10);

      fs.mkdirSync(path.dirname(recentPath), { recursive: true });
      fs.writeFileSync(recentPath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      // Do not crash the application if recent storage fails
      console.error('[WorkspaceMetadata] Failed to update recent list:', err);
    }
  }

  private static getRecentFilePath(): string {
    try {
      return path.join(app.getPath('userData'), 'recent-workspaces.json');
    } catch {
      // Vitest / Node fallback during tests
      return path.join(process.cwd(), 'temp', 'recent-workspaces.json');
    }
  }
}
