/**
 * action-snapshot-manager.ts
 *
 * Sprint 86 Phase 5 — Action Snapshot Manager
 *
 * Captures in-memory snapshots of file contents before applying edits,
 * enabling atomic rollback if an edit application fails.
 */
export declare class ActionSnapshotManager {
    /**
     * Capture file content snapshots for a set of file paths.
     */
    captureSnapshots(filePaths: string[]): Promise<Map<string, string>>;
    /**
     * Restore file contents from a set of snapshots.
     */
    restoreSnapshots(snapshots: Map<string, string>): Promise<void>;
}
