/**
 * workspace-engine.ts
 *
 * Phase 10 — Workspace Operations Engine Facade.
 *
 * Canonical facade for all repository modifications.
 * Coordinates FileOperations, PatchEngine, WorkspaceDiff, and WorkspaceSnapshot.
 * Enforces atomic writes, transactional rollbacks, AbortSignal support, and zero direct fs calls.
 */
import { type FilePatch, type PatchOptions, type PatchResult } from './patch-engine';
import { type FileDiffItem, type WorkspaceDiffReport } from './workspace-diff';
import { type SnapshotState } from './workspace-snapshot';
export interface IWorkspaceEngine {
    readFile(filePath: string, signal?: AbortSignal): Promise<string>;
    writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void>;
    createFile(filePath: string, content?: string, signal?: AbortSignal): Promise<void>;
    deleteFile(filePath: string, signal?: AbortSignal): Promise<void>;
    rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void>;
    mkdir(dirPath: string, signal?: AbortSignal): Promise<void>;
    exists(filePath: string, signal?: AbortSignal): Promise<boolean>;
    list(dirPath: string, signal?: AbortSignal): Promise<string[]>;
    applyPatch(patches: FilePatch[], options?: PatchOptions): Promise<PatchResult>;
    createSnapshot(id: string, filePaths: string[], signal?: AbortSignal): Promise<SnapshotState>;
    restoreSnapshot(id: string, signal?: AbortSignal): Promise<void>;
    diff(oldContent?: string, newContent?: string, filePath?: string): FileDiffItem;
    generateDiffReport(items: FileDiffItem[]): WorkspaceDiffReport;
}
export declare class WorkspaceEngine implements IWorkspaceEngine {
    private readonly fileOps;
    private readonly patchEngine;
    private readonly diffEngine;
    private readonly snapshotEngine;
    constructor();
    readFile(filePath: string, signal?: AbortSignal): Promise<string>;
    writeFile(filePath: string, content: string, signal?: AbortSignal): Promise<void>;
    createFile(filePath: string, content?: string, signal?: AbortSignal): Promise<void>;
    deleteFile(filePath: string, signal?: AbortSignal): Promise<void>;
    rename(oldPath: string, newPath: string, signal?: AbortSignal): Promise<void>;
    mkdir(dirPath: string, signal?: AbortSignal): Promise<void>;
    exists(filePath: string, signal?: AbortSignal): Promise<boolean>;
    list(dirPath: string, signal?: AbortSignal): Promise<string[]>;
    applyPatch(patches: FilePatch[], options?: PatchOptions): Promise<PatchResult>;
    createSnapshot(id: string, filePaths: string[], signal?: AbortSignal): Promise<SnapshotState>;
    restoreSnapshot(id: string, signal?: AbortSignal): Promise<void>;
    diff(oldContent?: string, newContent?: string, filePath?: string): FileDiffItem;
    generateDiffReport(items: FileDiffItem[]): WorkspaceDiffReport;
}
