/**
 * action-history.ts — Phase 29 Multi-File Action History Audit Persistence
 *
 * Persists action execution history and timeline to .forge/history/
 * (actions.json, timeline.json, artifacts.json, errors.json).
 */
import { ActionRequest, ActionResult } from './action-types';
export interface ActionHistoryEntry {
    id: string;
    actionId: string;
    runtimeId: string;
    workspaceRoot: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELLED';
    timestamp: number;
    durationMs: number;
    params: any;
    result?: any;
    error?: string;
}
export declare class ActionHistory {
    private getHistoryDir;
    /**
     * Logs an action execution into multi-file audit logs.
     */
    recordAction(req: ActionRequest, res: ActionResult): Promise<void>;
    /**
     * Retrieves action history entries for a workspace.
     */
    getHistory(workspaceRoot: string): Promise<ActionHistoryEntry[]>;
}
