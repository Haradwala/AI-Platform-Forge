/**
 * cli-manager.ts
 *
 * Facade managing the lifecycle of all external CLI sessions.
 * Supports creating, retrieving, listing, restarting, and destroying CLI process sessions.
 */

import { CLISession } from './cli-session';
import type { CLISessionInfo, CLISessionOptions } from './cli-types';

export interface ICLIManager {
  createSession(options: CLISessionOptions): Promise<CLISession>;
  getSession(id: string): CLISession | null;
  listSessions(): CLISessionInfo[];
  destroySession(id: string): Promise<void>;
  restartSession(id: string): Promise<void>;
  destroyAll(): Promise<void>;
}

export class CLIManager implements ICLIManager {
  private readonly sessions = new Map<string, CLISession>();
  private sessionCounter = 1;

  async createSession(options: CLISessionOptions): Promise<CLISession> {
    const id = `cli_session_${Date.now()}_${this.sessionCounter++}`;
    const session = new CLISession(id, options.command || '', options.args || [], options);

    session.start();
    this.sessions.set(id, session);
    return session;
  }

  getSession(id: string): CLISession | null {
    return this.sessions.get(id) || null;
  }

  listSessions(): CLISessionInfo[] {
    return Array.from(this.sessions.values()).map((s) => s.getInfo());
  }

  async destroySession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (!session) return;

    session.destroy();
    this.sessions.delete(id);
  }

  async restartSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error(`Cannot restart CLI session "${id}": session not found.`);
    }
    session.restart();
  }

  async destroyAll(): Promise<void> {
    for (const session of this.sessions.values()) {
      session.destroy();
    }
    this.sessions.clear();
  }
}
