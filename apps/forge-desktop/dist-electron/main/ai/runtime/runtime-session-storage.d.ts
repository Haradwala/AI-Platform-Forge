/**
 * runtime-session-storage.ts — Phase 24 Session Persistence Storage Abstraction
 *
 * Provides ISessionStorage interface with JsonSessionStorage implementation.
 * Abstracts session metadata persistence so migrating to SQLite later requires zero caller code changes.
 */
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
    toolCalls: Array<{
        id: string;
        name: string;
        status: string;
        args?: any;
        result?: any;
        timestamp: number;
    }>;
    logs: string[];
    tokenUsage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export interface ISessionStorage {
    saveSession(session: RuntimeSessionData): Promise<void>;
    getSession(sessionId: string, workspaceRoot?: string): Promise<RuntimeSessionData | null>;
    getAllSessions(workspaceRoot?: string): Promise<RuntimeSessionData[]>;
    deleteSession(sessionId: string): Promise<void>;
    clear(): Promise<void>;
}
export declare class JsonSessionStorage implements ISessionStorage {
    private getStoragePath;
    saveSession(session: RuntimeSessionData): Promise<void>;
    getSession(sessionId: string, workspaceRoot?: string): Promise<RuntimeSessionData | null>;
    getAllSessions(workspaceRoot?: string): Promise<RuntimeSessionData[]>;
    deleteSession(sessionId: string, workspaceRoot?: string): Promise<void>;
    clear(workspaceRoot?: string): Promise<void>;
}
