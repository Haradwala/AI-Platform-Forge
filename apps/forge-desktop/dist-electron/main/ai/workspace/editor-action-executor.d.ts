/**
 * editor-action-executor.ts
 *
 * Sprint 86 Phase 5 — AI Editor Action Executor
 *
 * Manages the full state machine lifecycle of AI-driven editor actions:
 *   proposed -> approved -> applying -> applied / rolled_back / failed
 *
 * Provides preview diff generation, conflict detection, atomic execution via WorkspaceEngine,
 * and snapshot-based automatic rollback on failure.
 */
import { type WorkspaceEdit, type FileDiffPreview } from './action-diff-generator';
import type { WorkspaceEngine } from './workspace-engine';
import type { ReferenceEngine } from './reference-engine';
export type EditorActionKind = 'rename_symbol' | 'extract_function' | 'inline_variable' | 'insert_code' | 'replace_selection' | 'fix_diagnostic';
export interface EditorAction {
    readonly id: string;
    readonly kind: EditorActionKind;
    readonly title: string;
    readonly description: string;
    readonly edit: WorkspaceEdit;
    readonly diffs: readonly FileDiffPreview[];
    readonly requiresApproval: boolean;
}
export type ActionState = 'proposed' | 'approved' | 'applying' | 'applied' | 'rejected' | 'failed' | 'rolled_back';
export interface ActionLifecycle {
    readonly id: string;
    readonly action: EditorAction;
    readonly state: ActionState;
    readonly error?: string;
    readonly appliedAt?: string;
    readonly rolledBackAt?: string;
    readonly snapshots?: Map<string, string>;
}
export interface Conflict {
    readonly kind: 'file_missing' | 'line_out_of_range';
    readonly filePath: string;
    readonly line?: number;
}
export interface ConflictReport {
    readonly conflicts: readonly Conflict[];
    readonly hasConflicts: boolean;
}
export declare class EditorActionExecutor {
    private readonly workspaceEngine?;
    private readonly referenceEngine?;
    private readonly snapshotManager;
    private readonly diffGenerator;
    private readonly lifecycles;
    constructor(workspaceEngine?: WorkspaceEngine | undefined, referenceEngine?: ReferenceEngine | undefined);
    /**
     * Create a proposed EditorAction and return its initial lifecycle state.
     */
    proposeAction(kind: EditorActionKind, title: string, description: string, edit: WorkspaceEdit): ActionLifecycle;
    /**
     * Generate a rename symbol action.
     */
    generateRenameAction(symbolName: string, newName: string): ActionLifecycle;
    /**
     * Check for file existence or line range conflict issues.
     */
    detectConflicts(edit: WorkspaceEdit): Promise<ConflictReport>;
    /**
     * Approve a proposed action.
     */
    approve(actionId: string): ActionLifecycle;
    /**
     * Reject a proposed action.
     */
    reject(actionId: string): ActionLifecycle;
    /**
     * Apply an approved action with automatic snapshot rollback on failure.
     */
    apply(actionId: string): Promise<ActionLifecycle>;
    /**
     * Get lifecycle state by id.
     */
    getLifecycle(actionId: string): ActionLifecycle | undefined;
}
