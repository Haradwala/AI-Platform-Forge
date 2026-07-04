import chokidar from 'chokidar';
import { IFileWatcher, IIgnoreRuleManager } from './interfaces/filesystem';
import { IEventBus } from '@forge/core';
import { WorkspaceFile } from '@forge/shared';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileWatcher implements IFileWatcher {
  private watcher?: chokidar.FSWatcher;
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private pendingEvents = new Map<string, 'created' | 'modified' | 'deleted'>();

  constructor(
    private readonly workspaceId: string,
    private readonly eventBus: IEventBus
  ) {}

  private getRelativePath(root: string, file: string): string {
    let r = root.replace(/\\/g, '/');
    let f = file.replace(/\\/g, '/');
    if (r.match(/^[A-Za-z]:/) && f.match(/^[A-Za-z]:/)) {
      if (r[0].toLowerCase() === f[0].toLowerCase()) {
        r = r[0].toLowerCase() + r.substring(1);
        f = f[0].toLowerCase() + f.substring(1);
      }
    }
    return path.posix.relative(r, f);
  }

  startWatching(rootPath: string, ignore: IIgnoreRuleManager): void {
    if (this.watcher) {
      return;
    }

    this.watcher = chokidar.watch(rootPath, {
      ignored: (filePath) => {
        const relativePath = this.getRelativePath(rootPath, filePath);
        if (relativePath === '') return false;
        return ignore.isIgnored(relativePath);
      },
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('add', (filePath) => this.queueEvent(rootPath, filePath, 'created'))
      .on('change', (filePath) => this.queueEvent(rootPath, filePath, 'modified'))
      .on('unlink', (filePath) => this.queueEvent(rootPath, filePath, 'deleted'))
      .on('error', (error) => {
        this.eventBus.publish('workspace.error', {
          workspaceId: this.workspaceId,
          error: error.message,
          timestamp: new Date()
        });
      });
  }

  async stopWatching(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = undefined;
    }
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.pendingEvents.clear();
  }

  private queueEvent(rootPath: string, filePath: string, type: 'created' | 'modified' | 'deleted'): void {
    const relativePath = this.getRelativePath(rootPath, filePath);

    const existingType = this.pendingEvents.get(relativePath);
    if (existingType) {
      if (existingType === 'created' && type === 'modified') {
        type = 'created';
      }
    }

    this.pendingEvents.set(relativePath, type);

    const existingTimer = this.debounceTimers.get(relativePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.flushEvent(rootPath, filePath, relativePath);
    }, 50);

    this.debounceTimers.set(relativePath, timer);
  }

  private async flushEvent(rootPath: string, filePath: string, relativePath: string): Promise<void> {
    const type = this.pendingEvents.get(relativePath);
    this.pendingEvents.delete(relativePath);
    this.debounceTimers.delete(relativePath);

    if (!type) return;

    const timestamp = new Date();

    if (type === 'deleted') {
      this.eventBus.publish('workspace.file.deleted', {
        workspaceId: this.workspaceId,
        relativePath,
        timestamp
      });
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      const isDir = stat.isDirectory();
      const name = path.basename(filePath);
      const ext = isDir ? '' : path.extname(filePath);

      const file = new WorkspaceFile(
        name,
        relativePath,
        filePath,
        ext,
        stat.size,
        stat.mtime,
        isDir
      );

      if (type === 'created') {
        this.eventBus.publish('workspace.file.created', {
          workspaceId: this.workspaceId,
          file,
          timestamp
        });
      } else {
        this.eventBus.publish('workspace.file.modified', {
          workspaceId: this.workspaceId,
          file,
          timestamp
        });
      }
    } catch {
      this.eventBus.publish('workspace.file.deleted', {
        workspaceId: this.workspaceId,
        relativePath,
        timestamp
      });
    }
  }
}
