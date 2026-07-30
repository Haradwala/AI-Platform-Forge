/**
 * session-store.ts — Persistent Storage for Multi-Runtime Sessions (.forge/runtime_sessions.json)
 */
import { RuntimeSession } from '../contracts/runtime-types';
export declare class SessionStore {
    private sessions;
    private storePath;
    initialize(workspaceRoot: string): Promise<void>;
    saveSession(session: RuntimeSession): Promise<void>;
    getSession(sessionId: string): Promise<RuntimeSession | null>;
    listSessions(workspaceRoot: string): Promise<RuntimeSession[]>;
    private loadFromDisk;
    private persistToDisk;
}
