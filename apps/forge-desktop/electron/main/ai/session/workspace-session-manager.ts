/**
 * workspace-session-manager.ts — Phase 25-28 Workspace Session Manager
 *
 * Persists and restores per-workspace session state in .forge/session/session.json
 * (conversations, execution history, approvals, active terminals, open tabs, recent commands).
 */

import * as fs from 'fs';
import * as path from 'path';

export interface WorkspaceSessionData {
  workspaceRoot: string;
  lastSavedAt: number;
  openTabs: Array<{ id: string; filePath: string; line?: number }>;
  activeTabId?: string;
  recentCommands: string[];
  terminalState: {
    activeTerminals: Array<{ id: string; cwd: string; bufferSnippet?: string }>;
  };
  approvals: Array<{ id: string; toolName: string; approvedAt: number }>;
  activeSessions: Array<{ sessionId: string; runtimeId: string; state: string }>;
}

export class WorkspaceSessionManager {
  private getSessionPath(workspaceRoot: string): string {
    const dir = path.join(workspaceRoot, '.forge', 'session');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'session.json');
  }

  /**
   * Saves workspace session state.
   */
  async saveSession(session: WorkspaceSessionData): Promise<void> {
    try {
      const filePath = this.getSessionPath(session.workspaceRoot);
      session.lastSavedAt = Date.now();
      fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[WorkspaceSessionManager] Failed to save session:', err.message);
    }
  }

  /**
   * Restores workspace session state.
   */
  async restoreSession(workspaceRoot: string): Promise<WorkspaceSessionData | null> {
    try {
      const filePath = this.getSessionPath(workspaceRoot);
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (err: any) {
      console.error('[WorkspaceSessionManager] Failed to restore session:', err.message);
      return null;
    }
  }

  /**
   * Clears workspace session data.
   */
  async clearSession(workspaceRoot: string): Promise<void> {
    try {
      const filePath = this.getSessionPath(workspaceRoot);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err: any) {
      console.error('[WorkspaceSessionManager] Failed to clear session:', err.message);
    }
  }
}
