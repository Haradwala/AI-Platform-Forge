import { IWorkspaceSession } from './interfaces/workspace';
import { IWorkspaceScanner, IIgnoreRuleManager, IFileWatcher } from './interfaces/filesystem';
import { IEventBus } from '@forge/core';
import { IWorkspaceFile } from '@forge/shared';

export class WorkspaceSession implements IWorkspaceSession {
  private files = new Map<string, IWorkspaceFile>();
  private _status: 'opening' | 'scanning' | 'ready' | 'closed' = 'opening';
  private subscriptions: string[] = [];

  constructor(
    public readonly id: string,
    public readonly path: string,
    private readonly eventBus: IEventBus,
    private readonly scanner: IWorkspaceScanner,
    private readonly ignore: IIgnoreRuleManager,
    private readonly watcher: IFileWatcher
  ) {}

  get status(): 'opening' | 'scanning' | 'ready' | 'closed' {
    return this._status;
  }

  getFilesList(): IWorkspaceFile[] {
    return Array.from(this.files.values());
  }

  isIgnored(relativePath: string): boolean {
    return this.ignore.isIgnored(relativePath);
  }

  async initialize(): Promise<void> {
    const timestamp = new Date();
    this.eventBus.publish('workspace.opening', { workspaceId: this.id, path: this.path, timestamp });

    this._status = 'scanning';
    this.eventBus.publish('workspace.opened', { workspaceId: this.id, path: this.path, timestamp });

    const subCreated = this.eventBus.subscribe('workspace.file.created', (event) => {
      if (event.payload.workspaceId === this.id) {
        this.files.set(event.payload.file.relativePath, event.payload.file);
      }
    });

    const subModified = this.eventBus.subscribe('workspace.file.modified', (event) => {
      if (event.payload.workspaceId === this.id) {
        this.files.set(event.payload.file.relativePath, event.payload.file);
      }
    });

    const subDeleted = this.eventBus.subscribe('workspace.file.deleted', (event) => {
      if (event.payload.workspaceId === this.id) {
        this.files.delete(event.payload.relativePath);
      }
    });

    this.subscriptions = [subCreated, subModified, subDeleted];

    this.eventBus.publish('workspace.scan.started', { workspaceId: this.id, timestamp: new Date() });
    const startTime = Date.now();
    
    try {
      await this.ignore.loadGitignore(this.path);
      for await (const file of this.scanner.scan(this.path, this.ignore)) {
        this.files.set(file.relativePath, file);
      }
      
      const durationMs = Date.now() - startTime;
      this.eventBus.publish('workspace.scan.completed', {
        workspaceId: this.id,
        filesCount: this.files.size,
        durationMs,
        timestamp: new Date(),
      });

      this.watcher.startWatching(this.path, this.ignore);

      this._status = 'ready';
      this.eventBus.publish('workspace.ready', {
        workspaceId: this.id,
        path: this.path,
        filesCount: this.files.size,
        timestamp: new Date(),
      });
    } catch (err: any) {
      this._status = 'closed';
      this.eventBus.publish('workspace.error', {
        workspaceId: this.id,
        error: err.message || String(err),
        timestamp: new Date(),
      });
      throw err;
    }
  }

  async dispose(): Promise<void> {
    const timestamp = new Date();
    this.eventBus.publish('workspace.closing', { workspaceId: this.id, path: this.path, timestamp });

    this._status = 'closed';

    for (const subId of this.subscriptions) {
      this.eventBus.unsubscribe(subId);
    }
    this.subscriptions = [];

    await this.watcher.stopWatching();

    this.eventBus.publish('workspace.closed', { workspaceId: this.id, path: this.path, timestamp });
  }
}
