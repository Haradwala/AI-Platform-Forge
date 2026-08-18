import * as fs from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';
import type { IWorkspaceService, IFileTreeItem, IDesktopLogger, IDesktopEventBus } from './container/service-interfaces';
import type { IWindowRegistry } from './window-registry';
import { WorkspaceMetadata } from './workspace-metadata';

/**
 * WorkspaceService — handles folder open/close, CRUD operations on files,
 * and watches for changes via chokidar to stream them to the renderer.
 */
export class WorkspaceService implements IWorkspaceService {
  private rootPath: string | null = null;
  private watcher: chokidar.FSWatcher | null = null;

  constructor(
    private readonly registry: IWindowRegistry,
    private readonly logger: IDesktopLogger,
    private readonly eventBus?: IDesktopEventBus,
  ) {}

  getRootPath(): string | null {
    return this.rootPath;
  }

  async open(workspaceRoot: string): Promise<IFileTreeItem> {
    const resolvedRoot = path.resolve(workspaceRoot);
    if (!fs.existsSync(resolvedRoot)) {
      throw new Error(`Workspace path does not exist: ${workspaceRoot}`);
    }
    const stats = fs.statSync(resolvedRoot);
    if (!stats.isDirectory()) {
      throw new Error(`Workspace path is not a directory: ${workspaceRoot}`);
    }

    // Close any currently active workspace
    await this.close();

    this.rootPath = resolvedRoot;
    this.logger.info(`[WorkspaceService] Opening workspace: ${this.rootPath}`);

    // 1. Initialize .forge metadata directory, update gitignore (Epic 9)
    WorkspaceMetadata.init(this.rootPath);

    // 2. Start watching folder via chokidar
    this.startWatcher();

    // 3. Build and return initial tree
    const tree = this.buildTree(this.rootPath);

    // 4. Emit workspace loaded event
    this.eventBus?.emit('workspace.loaded', { rootPath: this.rootPath });
    this.sendToAllWindows('window:state-changed', { workspaceOpen: true, rootPath: this.rootPath });

    return tree;
  }

  async close(): Promise<void> {
    if (this.rootPath) {
      this.logger.info(`[WorkspaceService] Closing workspace: ${this.rootPath}`);
      this.stopWatcher();
      const oldRoot = this.rootPath;
      this.rootPath = null;
      this.eventBus?.emit('workspace.closed', { rootPath: oldRoot });
      this.sendToAllWindows('window:state-changed', { workspaceOpen: false, rootPath: null });
    }
  }

  async getRecentWorkspaces(): Promise<string[]> {
    return WorkspaceMetadata.getRecent();
  }

  async getTree(): Promise<IFileTreeItem | null> {
    if (!this.rootPath) return null;
    return this.buildTree(this.rootPath);
  }

  async readFile(filePath: string): Promise<string> {
    const resolved = this.validatePath(filePath);
    const stats = fs.statSync(resolved);
    if (stats.isDirectory()) {
      throw new Error(`Path is a directory: ${filePath}`);
    }
    return fs.readFileSync(resolved, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const resolved = this.validatePath(filePath);
    fs.writeFileSync(resolved, content, 'utf-8');
    this.logger.info(`[WorkspaceService] Wrote file: ${resolved}`);
  }

  async createFile(filePath: string): Promise<void> {
    const resolved = this.validatePath(filePath);
    if (fs.existsSync(resolved)) {
      throw new Error(`File already exists: ${filePath}`);
    }
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, '', 'utf-8');
    this.logger.info(`[WorkspaceService] Created empty file: ${resolved}`);
  }

  async createFolder(folderPath: string): Promise<void> {
    const resolved = this.validatePath(folderPath);
    if (fs.existsSync(resolved)) {
      throw new Error(`Folder already exists: ${folderPath}`);
    }
    fs.mkdirSync(resolved, { recursive: true });
    this.logger.info(`[WorkspaceService] Created folder: ${resolved}`);
  }

  async deleteEntry(entryPath: string): Promise<void> {
    const resolved = this.validatePath(entryPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`Path does not exist: ${entryPath}`);
    }
    const stats = fs.statSync(resolved);
    if (stats.isDirectory()) {
      fs.rmSync(resolved, { recursive: true, force: true });
    } else {
      fs.unlinkSync(resolved);
    }
    this.logger.info(`[WorkspaceService] Deleted entry: ${resolved}`);
  }

  async renameEntry(oldPath: string, newPath: string): Promise<void> {
    const resolvedOld = this.validatePath(oldPath);
    const resolvedNew = this.validatePath(newPath);

    if (!fs.existsSync(resolvedOld)) {
      throw new Error(`Source path does not exist: ${oldPath}`);
    }
    if (fs.existsSync(resolvedNew)) {
      throw new Error(`Destination path already exists: ${newPath}`);
    }

    fs.renameSync(resolvedOld, resolvedNew);
    this.logger.info(`[WorkspaceService] Renamed ${resolvedOld} to ${resolvedNew}`);
  }

  // ─── Private Helpers ───────────────────────────────────────────────────────

  private validatePath(targetPath: string): string {
    const root = this.rootPath || process.cwd();
    const resolved = path.isAbsolute(targetPath)
      ? path.resolve(targetPath)
      : path.resolve(root, targetPath);

    if (this.rootPath) {
      const relative = path.relative(this.rootPath, resolved);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        if (fs.existsSync(resolved)) {
          return resolved;
        }
        throw new Error(`Access Denied: Path "${targetPath}" is outside workspace root: ${this.rootPath}`);
      }
    }
    return resolved;
  }

  private buildTree(dirPath: string): IFileTreeItem {
    const name = path.basename(dirPath);
    const stats = fs.statSync(dirPath);

    if (!stats.isDirectory()) {
      return { name, path: dirPath, isDirectory: false, size: stats.size };
    }

    const children: IFileTreeItem[] = [];
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      // Skip VCS and metadata directories to avoid clutter
      if (entry === '.git' || entry === '.forge' || entry === 'node_modules' || entry === '.DS_Store') {
        continue;
      }
      const fullPath = path.join(dirPath, entry);
      try {
        children.push(this.buildTree(fullPath));
      } catch {
        // Skip entry if permission denied or broken symlink
      }
    }

    // Sort: directories first, then alphabetically
    children.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    return { name, path: dirPath, isDirectory: true, children };
  }

  private startWatcher(): void {
    if (!this.rootPath) return;

    this.watcher = chokidar.watch(this.rootPath, {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.forge/**',
        '**/.DS_Store',
        '**/dist/**',
        '**/dist-electron/**',
        '**/coverage/**',
        '**/temp/**',
        '**/tests/temp*/**',
        '**/temp_*/**',
      ],
      persistent: true,
      ignoreInitial: true,
      depth: 99,
    });

    this.watcher.on('add', (filePath) => {
      this.logger.debug(`[WorkspaceService] Watcher: File added ${filePath}`);
      this.sendToAllWindows('workspace:file-created', { path: filePath, isDirectory: false });
    });

    this.watcher.on('addDir', (dirPath) => {
      this.logger.debug(`[WorkspaceService] Watcher: Directory added ${dirPath}`);
      this.sendToAllWindows('workspace:file-created', { path: dirPath, isDirectory: true });
    });

    this.watcher.on('change', (filePath) => {
      this.logger.debug(`[WorkspaceService] Watcher: File changed ${filePath}`);
      this.sendToAllWindows('workspace:file-changed', { path: filePath });
    });

    this.watcher.on('unlink', (filePath) => {
      this.logger.debug(`[WorkspaceService] Watcher: File deleted ${filePath}`);
      this.sendToAllWindows('workspace:file-deleted', { path: filePath });
    });

    this.watcher.on('unlinkDir', (dirPath) => {
      this.logger.debug(`[WorkspaceService] Watcher: Directory deleted ${dirPath}`);
      this.sendToAllWindows('workspace:file-deleted', { path: dirPath });
    });
  }

  private stopWatcher(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }

  private sendToAllWindows(channel: string, data: unknown): void {
    try {
      const windows = this.registry.getAll();
      for (const entry of windows) {
        if (!entry.window.isDestroyed()) {
          entry.window.webContents.send(channel, data);
        }
      }
    } catch (err) {
      this.logger.error('[WorkspaceService] Failed to send push notification to windows:', err as Error);
    }
  }
}
