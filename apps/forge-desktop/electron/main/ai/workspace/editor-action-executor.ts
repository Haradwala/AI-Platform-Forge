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

import * as fs from 'fs';
import { ActionSnapshotManager } from './action-snapshot-manager';
import { ActionDiffGenerator, type WorkspaceEdit, type FileDiffPreview } from './action-diff-generator';
import type { WorkspaceEngine } from './workspace-engine';
import type { FilePatch } from './patch-engine';
import type { ReferenceEngine } from './reference-engine';

export type EditorActionKind =
  | 'rename_symbol'
  | 'extract_function'
  | 'inline_variable'
  | 'insert_code'
  | 'replace_selection'
  | 'fix_diagnostic';

export interface EditorAction {
  readonly id: string;
  readonly kind: EditorActionKind;
  readonly title: string;
  readonly description: string;
  readonly edit: WorkspaceEdit;
  readonly diffs: readonly FileDiffPreview[];
  readonly requiresApproval: boolean;
}

export type ActionState =
  | 'proposed'
  | 'approved'
  | 'applying'
  | 'applied'
  | 'rejected'
  | 'failed'
  | 'rolled_back';

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

export class EditorActionExecutor {
  private readonly snapshotManager = new ActionSnapshotManager();
  private readonly diffGenerator = new ActionDiffGenerator();
  private readonly lifecycles = new Map<string, ActionLifecycle>();

  constructor(
    private readonly workspaceEngine?: WorkspaceEngine,
    private readonly referenceEngine?: ReferenceEngine
  ) {}

  /**
   * Create a proposed EditorAction and return its initial lifecycle state.
   */
  proposeAction(
    kind: EditorActionKind,
    title: string,
    description: string,
    edit: WorkspaceEdit
  ): ActionLifecycle {
    const diffs = this.diffGenerator.generate(edit);
    const action: EditorAction = {
      id: edit.id,
      kind,
      title,
      description,
      edit,
      diffs,
      requiresApproval: true,
    };

    const lifecycle: ActionLifecycle = {
      id: edit.id,
      action,
      state: 'proposed',
    };

    this.lifecycles.set(edit.id, lifecycle);
    return lifecycle;
  }

  /**
   * Generate a rename symbol action.
   */
  generateRenameAction(symbolName: string, newName: string): ActionLifecycle {
    const edits: Array<{
      filePath: string;
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
      newText: string;
    }> = [];

    if (this.referenceEngine) {
      const refResult = this.referenceEngine.findUsages(symbolName);
      for (const loc of refResult.ordered) {
        edits.push({
          filePath: loc.filePath,
          startLine: loc.line,
          startColumn: loc.column,
          endLine: loc.line,
          endColumn: loc.column + symbolName.length,
          newText: newName,
        });
      }
    }

    const edit: WorkspaceEdit = {
      id: `rename_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      description: `Rename symbol ${symbolName} to ${newName}`,
      edits,
      createdAt: new Date().toISOString(),
    };

    return this.proposeAction(
      'rename_symbol',
      `Rename '${symbolName}' to '${newName}'`,
      `Updates ${edits.length} occurrence(s) across workspace`,
      edit
    );
  }

  /**
   * Check for file existence or line range conflict issues.
   */
  async detectConflicts(edit: WorkspaceEdit): Promise<ConflictReport> {
    const conflicts: Conflict[] = [];
    for (const textEdit of edit.edits) {
      if (!fs.existsSync(textEdit.filePath)) {
        conflicts.push({ kind: 'file_missing', filePath: textEdit.filePath });
        continue;
      }

      try {
        const content = fs.readFileSync(textEdit.filePath, 'utf8');
        const lines = content.split(/\r?\n/);
        if (textEdit.startLine < 1 || textEdit.startLine > lines.length) {
          conflicts.push({
            kind: 'line_out_of_range',
            filePath: textEdit.filePath,
            line: textEdit.startLine,
          });
        }
      } catch {
        conflicts.push({ kind: 'file_missing', filePath: textEdit.filePath });
      }
    }

    return { conflicts, hasConflicts: conflicts.length > 0 };
  }

  /**
   * Approve a proposed action.
   */
  approve(actionId: string): ActionLifecycle {
    const current = this.lifecycles.get(actionId);
    if (!current) throw new Error(`Action with id "${actionId}" not found`);

    if (current.state !== 'proposed') {
      throw new Error(`Cannot approve action in state "${current.state}"`);
    }

    const updated: ActionLifecycle = { ...current, state: 'approved' };
    this.lifecycles.set(actionId, updated);
    return updated;
  }

  /**
   * Reject a proposed action.
   */
  reject(actionId: string): ActionLifecycle {
    const current = this.lifecycles.get(actionId);
    if (!current) throw new Error(`Action with id "${actionId}" not found`);

    const updated: ActionLifecycle = { ...current, state: 'rejected' };
    this.lifecycles.set(actionId, updated);
    return updated;
  }

  /**
   * Apply an approved action with automatic snapshot rollback on failure.
   */
  async apply(actionId: string): Promise<ActionLifecycle> {
    const current = this.lifecycles.get(actionId);
    if (!current) throw new Error(`Action with id "${actionId}" not found`);

    if (current.state !== 'approved' && current.state !== 'proposed') {
      throw new Error(`Cannot apply action in state "${current.state}"`);
    }

    const filePaths = [...new Set(current.action.edit.edits.map((e) => e.filePath))];
    const snapshots = await this.snapshotManager.captureSnapshots(filePaths);

    const applyingLifecycle: ActionLifecycle = {
      ...current,
      state: 'applying',
      snapshots,
    };
    this.lifecycles.set(actionId, applyingLifecycle);

    try {
      // Group edits per file and apply replacement
      const fileEdits = new Map<string, Array<any>>();
      for (const e of current.action.edit.edits) {
        const list = fileEdits.get(e.filePath) || [];
        list.push(e);
        fileEdits.set(e.filePath, list);
      }

      for (const [filePath, edits] of fileEdits.entries()) {
        let content = '';
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, 'utf8');
        }

        const lines = content.split(/\r?\n/);
        // Apply edits in reverse line order to preserve offsets
        const sortedEdits = [...edits].sort((a, b) => b.startLine - a.startLine);

        for (const e of sortedEdits) {
          const startIdx = Math.max(0, e.startLine - 1);
          const endIdx = Math.min(lines.length, e.endLine);
          const newLines = e.newText.split(/\r?\n/);
          lines.splice(startIdx, endIdx - startIdx, ...newLines);
        }

        const newContent = lines.join('\n');
        if (this.workspaceEngine) {
          await this.workspaceEngine.writeFile(filePath, newContent);
        } else {
          fs.writeFileSync(filePath, newContent, 'utf8');
        }
      }

      const appliedLifecycle: ActionLifecycle = {
        ...applyingLifecycle,
        state: 'applied',
        appliedAt: new Date().toISOString(),
      };
      this.lifecycles.set(actionId, appliedLifecycle);
      return appliedLifecycle;
    } catch (err: any) {
      // Auto-rollback
      try {
        await this.snapshotManager.restoreSnapshots(snapshots);
        const rolledBack: ActionLifecycle = {
          ...applyingLifecycle,
          state: 'rolled_back',
          rolledBackAt: new Date().toISOString(),
          error: err?.message || String(err),
        };
        this.lifecycles.set(actionId, rolledBack);
        return rolledBack;
      } catch (rollbackErr: any) {
        const failed: ActionLifecycle = {
          ...applyingLifecycle,
          state: 'failed',
          error: `Apply failed: ${err.message}. Rollback failed: ${rollbackErr.message}`,
        };
        this.lifecycles.set(actionId, failed);
        return failed;
      }
    }
  }

  /**
   * Get lifecycle state by id.
   */
  getLifecycle(actionId: string): ActionLifecycle | undefined {
    return this.lifecycles.get(actionId);
  }
}
