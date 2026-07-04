import * as crypto from 'crypto';
import { IWorkspaceManager, IWorkspaceSession } from './interfaces/workspace';
import { WorkspaceSession } from './session';
import { WorkspaceScanner } from './scanner';
import { IgnoreRuleManager } from './ignore';
import { FileWatcher } from './watcher';
import { IEventBus } from '@forge/core';

export class WorkspaceManager implements IWorkspaceManager {
  private sessions = new Map<string, IWorkspaceSession>();
  private activeSessionId?: string;

  constructor(private readonly eventBus: IEventBus) {}

  async openWorkspace(path: string): Promise<IWorkspaceSession> {
    const id = `ws-${crypto.createHash('sha256').update(path).digest('hex').substring(0, 8)}`;
    const existing = this.sessions.get(id);
    if (existing) {
      this.activeSessionId = id;
      return existing;
    }

    const scanner = new WorkspaceScanner();
    const ignore = new IgnoreRuleManager();
    const watcher = new FileWatcher(id, this.eventBus);

    const session = new WorkspaceSession(id, path, this.eventBus, scanner, ignore, watcher);
    this.sessions.set(id, session);
    this.activeSessionId = id;

    await session.initialize();
    return session;
  }

  async closeWorkspace(workspaceId: string): Promise<void> {
    const session = this.sessions.get(workspaceId);
    if (!session) {
      return;
    }

    await session.dispose();
    this.sessions.delete(workspaceId);
    if (this.activeSessionId === workspaceId) {
      this.activeSessionId = undefined;
    }
  }

  getActiveSession(): IWorkspaceSession | undefined {
    if (!this.activeSessionId) {
      return undefined;
    }
    return this.sessions.get(this.activeSessionId);
  }
}
