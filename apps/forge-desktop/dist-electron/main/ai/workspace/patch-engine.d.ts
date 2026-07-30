/**
 * patch-engine.ts
 *
 * Multi-file patch engine with unified diff support, dry-run mode, and automatic rollback on failure.
 */
import type { FileOperations } from './file-operations';
export interface FilePatch {
    filePath: string;
    type: 'add' | 'modify' | 'delete';
    oldContent?: string;
    newContent: string;
}
export interface PatchOptions {
    dryRun?: boolean;
    signal?: AbortSignal;
}
export interface PatchResult {
    success: boolean;
    appliedPatches: number;
    dryRun: boolean;
    modifiedFiles: string[];
    error?: string;
}
export declare class PatchEngine {
    private readonly fileOps;
    constructor(fileOps: FileOperations);
    applyPatch(patches: FilePatch[], options?: PatchOptions): Promise<PatchResult>;
    private rollback;
}
