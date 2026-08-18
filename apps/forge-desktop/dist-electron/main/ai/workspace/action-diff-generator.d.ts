/**
 * action-diff-generator.ts
 *
 * Sprint 86 Phase 5 — Action Diff Generator
 *
 * Generates unified diff previews (FileDiffPreview[]) for proposed WorkspaceEdits
 * without mutating disk files.
 */
export interface TextEdit {
    readonly filePath: string;
    readonly startLine: number;
    readonly startColumn: number;
    readonly endLine: number;
    readonly endColumn: number;
    readonly newText: string;
}
export interface WorkspaceEdit {
    readonly id: string;
    readonly description: string;
    readonly edits: readonly TextEdit[];
    readonly createdAt: string;
}
export interface DiffHunk {
    readonly oldStart: number;
    readonly oldLines: number;
    readonly newStart: number;
    readonly newLines: number;
    readonly content: string;
}
export interface FileDiffPreview {
    readonly filePath: string;
    readonly hunks: readonly DiffHunk[];
}
export declare class ActionDiffGenerator {
    /**
     * Generate diff previews for all edits grouped by file.
     */
    generate(edit: WorkspaceEdit): FileDiffPreview[];
    private createHunks;
}
