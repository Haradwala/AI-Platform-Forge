/**
 * runtime-session-storage.ts — Phase 24 Session Persistence Storage Abstraction
 *
 * Provides ISessionStorage interface with JsonSessionStorage implementation.
 * Abstracts session metadata persistence so migrating to SQLite later requires zero caller code changes.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface RuntimeNegotiatedCapabilities {
  streaming: boolean;
  tools: boolean;
  mcp: boolean;
  approval: boolean;
  images?: boolean;
  resume?: boolean;
  thinking?: boolean;
  json?: boolean;
  vision?: boolean;
}

export interface RuntimeSessionData {
  sessionId: string;
  runtimeId: string;
  adapterId?: string;
  workspaceRoot: string;
  terminalId?: string;
  pid?: number;
  state: string;
  startTime: number;
  endTime?: number;
  capabilities: RuntimeNegotiatedCapabilities;
  eventHistory: any[];
  toolCalls: Array<{ id: string; name: string; status: string; args?: any; result?: any; timestamp: number }>;
  logs: string[];
  tokenUsage: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface ISessionStorage {
  saveSession(session: RuntimeSessionData): Promise<void>;
  getSession(sessionId: string, workspaceRoot?: string): Promise<RuntimeSessionData | null>;
  getAllSessions(workspaceRoot?: string): Promise<RuntimeSessionData[]>;
  deleteSession(sessionId: string): Promise<void>;
  clear(): Promise<void>;
}

export class JsonSessionStorage implements ISessionStorage {
  private getStoragePath(workspaceRoot: string): string {
    const forgeDir = path.join(workspaceRoot, '.forge');
    if (!fs.existsSync(forgeDir)) {
      fs.mkdirSync(forgeDir, { recursive: true });
    }
    return path.join(forgeDir, 'runtime-sessions.json');
  }

  async saveSession(session: RuntimeSessionData): Promise<void> {
    try {
      const storageFile = this.getStoragePath(session.workspaceRoot);
      let existing: Record<string, RuntimeSessionData> = {};
      if (fs.existsSync(storageFile)) {
        const raw = fs.readFileSync(storageFile, 'utf-8');
        existing = JSON.parse(raw || '{}');
      }
      existing[session.sessionId] = session;
      fs.writeFileSync(storageFile, JSON.stringify(existing, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[JsonSessionStorage] Failed to save session:', err.message);
    }
  }

  async getSession(sessionId: string, workspaceRoot = process.cwd()): Promise<RuntimeSessionData | null> {
    const all = await this.getAllSessions(workspaceRoot);
    return all.find((s) => s.sessionId === sessionId) || null;
  }

  async getAllSessions(workspaceRoot = process.cwd()): Promise<RuntimeSessionData[]> {
    try {
      const storageFile = this.getStoragePath(workspaceRoot);
      if (!fs.existsSync(storageFile)) return [];
      const raw = fs.readFileSync(storageFile, 'utf-8');
      const data = JSON.parse(raw || '{}');
      return Object.values(data);
    } catch (err: any) {
      console.error('[JsonSessionStorage] Failed to read sessions:', err.message);
      return [];
    }
  }

  async deleteSession(sessionId: string, workspaceRoot = process.cwd()): Promise<void> {
    try {
      const storageFile = this.getStoragePath(workspaceRoot);
      if (!fs.existsSync(storageFile)) return;
      const raw = fs.readFileSync(storageFile, 'utf-8');
      const data = JSON.parse(raw || '{}');
      delete data[sessionId];
      fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err: any) {
      console.error('[JsonSessionStorage] Failed to delete session:', err.message);
    }
  }

  async clear(workspaceRoot = process.cwd()): Promise<void> {
    try {
      const storageFile = this.getStoragePath(workspaceRoot);
      if (fs.existsSync(storageFile)) {
        fs.unlinkSync(storageFile);
      }
    } catch (err: any) {
      console.error('[JsonSessionStorage] Failed to clear storage:', err.message);
    }
  }
}
