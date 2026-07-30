/**
 * workspace-session-manager.ts — Phase 25-28 Workspace Session Manager
 *
 * Persists and restores per-workspace session state in .forge/session/session.json
 * (conversations, execution history, approvals, active terminals, open tabs, recent commands).
 */
export interface WorkspaceSessionData {
    workspaceRoot: string;
    lastSavedAt: number;
    openTabs: Array<{
        id: string;
        filePath: string;
        line?: number;
    }>;
    activeTabId?: string;
    recentCommands: string[];
    terminalState: {
        activeTerminals: Array<{
            id: string;
            cwd: string;
            bufferSnippet?: string;
        }>;
    };
    approvals: Array<{
        id: string;
        toolName: string;
        approvedAt: number;
    }>;
    activeSessions: Array<{
        sessionId: string;
        runtimeId: string;
        state: string;
    }>;
}
export declare class WorkspaceSessionManager {
    private getSessionPath;
    /**
     * Saves workspace session state.
     */
    saveSession(session: WorkspaceSessionData): Promise<void>;
    /**
     * Restores workspace session state.
     */
    restoreSession(workspaceRoot: string): Promise<WorkspaceSessionData | null>;
    /**
     * Clears workspace session data.
     */
    clearSession(workspaceRoot: string): Promise<void>;
}
