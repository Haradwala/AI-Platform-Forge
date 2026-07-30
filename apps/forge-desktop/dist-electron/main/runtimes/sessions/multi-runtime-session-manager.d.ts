/**
 * multi-runtime-session-manager.ts — Persistent Multi-Runtime Conversation & Context Synchronization Engine
 */
import { SessionStore } from './session-store';
import { RuntimeProfileRegistry } from '../profiles/runtime-profile-registry';
import { RuntimeSession, SessionMessage } from '../contracts/runtime-types';
export declare class MultiRuntimeSessionManager {
    private readonly store;
    private readonly profileRegistry;
    constructor(store?: SessionStore, profileRegistry?: RuntimeProfileRegistry);
    createSession(workspaceRoot: string, initialModelId?: string): Promise<RuntimeSession>;
    switchRuntime(sessionId: string, newModelId: string): Promise<RuntimeSession>;
    addMessage(sessionId: string, message: SessionMessage): Promise<void>;
    getSession(sessionId: string): Promise<RuntimeSession | null>;
    listSessions(workspaceRoot: string): Promise<RuntimeSession[]>;
}
