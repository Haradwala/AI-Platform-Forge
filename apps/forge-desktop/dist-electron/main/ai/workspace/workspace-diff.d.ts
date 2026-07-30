/**
 * workspace-diff.ts
 *
 * Workspace diff engine computing file additions, deletions, modifications,
 * renames, and binary file detection.
 */
import type { FileOperations } from './file-operations';
export interface FileDiffItem {
    path: string;
    oldPath?: string;
    type: 'added' | 'removed' | 'modified' | 'renamed';
    isBinary: boolean;
    additions: number;
    deletions: number;
}
export interface WorkspaceDiffReport {
    timestamp: string;
    items: FileDiffItem[];
    totalAdded: number;
    totalRemoved: number;
    totalModified: number;
}
export declare class WorkspaceDiff {
    private readonly fileOps;
    constructor(fileOps: FileOperations);
    isBinary(content: string): boolean;
    diffContent(oldContent?: string, newContent?: string, filePath?: string): FileDiffItem;
    generateReport(items: FileDiffItem[]): WorkspaceDiffReport;
}
