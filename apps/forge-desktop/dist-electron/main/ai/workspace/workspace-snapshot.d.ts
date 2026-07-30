/**
 * workspace-snapshot.ts
 *
 * Captures workspace state snapshots and manages temporary checkpoints for rollback & state restoration.
 */
import type { FileOperations } from './file-operations';
export interface SnapshotState {
    id: string;
    timestamp: number;
    files: Map<string, string>;
}
export declare class WorkspaceSnapshot {
    private readonly fileOps;
    private readonly snapshots;
    constructor(fileOps: FileOperations);
    createSnapshot(id: string, filePaths: string[], signal?: AbortSignal): Promise<SnapshotState>;
    restoreSnapshot(id: string, signal?: AbortSignal): Promise<void>;
    getSnapshot(id: string): SnapshotState | null;
    deleteSnapshot(id: string): void;
    clear(): void;
}
