/**
 * session-store.ts — Persistent Storage for Multi-Runtime Sessions (.forge/runtime_sessions.json)
 */

import * as fs from 'fs';
import * as path from 'path';
import { RuntimeSession } from '../contracts/runtime-types';

export class SessionStore {
  private sessions = new Map<string, RuntimeSession>();
  private storePath: string = '';

  async initialize(workspaceRoot: string): Promise<void> {
    if (!workspaceRoot) return;
    const forgeDir = path.join(workspaceRoot, '.forge');
    if (!fs.existsSync(forgeDir)) {
      fs.mkdirSync(forgeDir, { recursive: true });
    }
    this.storePath = path.join(forgeDir, 'runtime_sessions.json');
    this.loadFromDisk();
  }

  async saveSession(session: RuntimeSession): Promise<void> {
    this.sessions.set(session.id, session);
    this.persistToDisk();
  }

  async getSession(sessionId: string): Promise<RuntimeSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async listSessions(workspaceRoot: string): Promise<RuntimeSession[]> {
    return Array.from(this.sessions.values()).filter((s) => s.workspaceRoot === workspaceRoot);
  }

  private loadFromDisk(): void {
    if (this.storePath && fs.existsSync(this.storePath)) {
      try {
        const raw = fs.readFileSync(this.storePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: RuntimeSession) => this.sessions.set(s.id, s));
        }
      } catch {
        // Ignore corrupt storage files
      }
    }
  }

  private persistToDisk(): void {
    if (this.storePath) {
      try {
        const data = JSON.stringify(Array.from(this.sessions.values()), null, 2);
        fs.writeFileSync(this.storePath, data, 'utf-8');
      } catch {
        // Ignore disk write errors in ephemeral environments
      }
    }
  }
}
