/**
 * multi-runtime-session-manager.ts — Persistent Multi-Runtime Conversation & Context Synchronization Engine
 */

import { SessionStore } from './session-store';
import { RuntimeProfileRegistry } from '../profiles/runtime-profile-registry';
import { RuntimeSession, SessionMessage } from '../contracts/runtime-types';

export class MultiRuntimeSessionManager {
  constructor(
    private readonly store: SessionStore = new SessionStore(),
    private readonly profileRegistry: RuntimeProfileRegistry = new RuntimeProfileRegistry()
  ) {}

  async createSession(workspaceRoot: string, initialModelId: string = 'gpt-4o'): Promise<RuntimeSession> {
    await this.store.initialize(workspaceRoot);
    const session: RuntimeSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      workspaceRoot,
      currentModelId: initialModelId,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.store.saveSession(session);
    return session;
  }

  async switchRuntime(sessionId: string, newModelId: string): Promise<RuntimeSession> {
    const session = await this.store.getSession(sessionId);
    if (!session) throw new Error(`Session [${sessionId}] not found`);

    session.currentModelId = newModelId;
    session.updatedAt = Date.now();

    // Context synchronization & window boundary check
    const profile = this.profileRegistry.getProfile(newModelId);
    if (profile && profile.contextWindow < 16000 && session.messages.length > 20) {
      // Trim older messages to fit within smaller model context window
      session.messages = session.messages.slice(-10);
    }

    await this.store.saveSession(session);
    return session;
  }

  async addMessage(sessionId: string, message: SessionMessage): Promise<void> {
    const session = await this.store.getSession(sessionId);
    if (!session) throw new Error(`Session [${sessionId}] not found`);

    session.messages.push(message);
    session.updatedAt = Date.now();
    await this.store.saveSession(session);
  }

  async getSession(sessionId: string): Promise<RuntimeSession | null> {
    return this.store.getSession(sessionId);
  }

  async listSessions(workspaceRoot: string): Promise<RuntimeSession[]> {
    await this.store.initialize(workspaceRoot);
    return this.store.listSessions(workspaceRoot);
  }
}
