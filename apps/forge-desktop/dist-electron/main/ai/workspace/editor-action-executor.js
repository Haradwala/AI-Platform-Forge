"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorActionExecutor = void 0;
const fs = __importStar(require("fs"));
const action_snapshot_manager_1 = require("./action-snapshot-manager");
const action_diff_generator_1 = require("./action-diff-generator");
class EditorActionExecutor {
    workspaceEngine;
    referenceEngine;
    snapshotManager = new action_snapshot_manager_1.ActionSnapshotManager();
    diffGenerator = new action_diff_generator_1.ActionDiffGenerator();
    lifecycles = new Map();
    constructor(workspaceEngine, referenceEngine) {
        this.workspaceEngine = workspaceEngine;
        this.referenceEngine = referenceEngine;
    }
    /**
     * Create a proposed EditorAction and return its initial lifecycle state.
     */
    proposeAction(kind, title, description, edit) {
        const diffs = this.diffGenerator.generate(edit);
        const action = {
            id: edit.id,
            kind,
            title,
            description,
            edit,
            diffs,
            requiresApproval: true,
        };
        const lifecycle = {
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
    generateRenameAction(symbolName, newName) {
        const edits = [];
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
        const edit = {
            id: `rename_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            description: `Rename symbol ${symbolName} to ${newName}`,
            edits,
            createdAt: new Date().toISOString(),
        };
        return this.proposeAction('rename_symbol', `Rename '${symbolName}' to '${newName}'`, `Updates ${edits.length} occurrence(s) across workspace`, edit);
    }
    /**
     * Check for file existence or line range conflict issues.
     */
    async detectConflicts(edit) {
        const conflicts = [];
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
            }
            catch {
                conflicts.push({ kind: 'file_missing', filePath: textEdit.filePath });
            }
        }
        return { conflicts, hasConflicts: conflicts.length > 0 };
    }
    /**
     * Approve a proposed action.
     */
    approve(actionId) {
        const current = this.lifecycles.get(actionId);
        if (!current)
            throw new Error(`Action with id "${actionId}" not found`);
        if (current.state !== 'proposed') {
            throw new Error(`Cannot approve action in state "${current.state}"`);
        }
        const updated = { ...current, state: 'approved' };
        this.lifecycles.set(actionId, updated);
        return updated;
    }
    /**
     * Reject a proposed action.
     */
    reject(actionId) {
        const current = this.lifecycles.get(actionId);
        if (!current)
            throw new Error(`Action with id "${actionId}" not found`);
        const updated = { ...current, state: 'rejected' };
        this.lifecycles.set(actionId, updated);
        return updated;
    }
    /**
     * Apply an approved action with automatic snapshot rollback on failure.
     */
    async apply(actionId) {
        const current = this.lifecycles.get(actionId);
        if (!current)
            throw new Error(`Action with id "${actionId}" not found`);
        if (current.state !== 'approved' && current.state !== 'proposed') {
            throw new Error(`Cannot apply action in state "${current.state}"`);
        }
        const filePaths = [...new Set(current.action.edit.edits.map((e) => e.filePath))];
        const snapshots = await this.snapshotManager.captureSnapshots(filePaths);
        const applyingLifecycle = {
            ...current,
            state: 'applying',
            snapshots,
        };
        this.lifecycles.set(actionId, applyingLifecycle);
        try {
            // Group edits per file and apply replacement
            const fileEdits = new Map();
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
                }
                else {
                    fs.writeFileSync(filePath, newContent, 'utf8');
                }
            }
            const appliedLifecycle = {
                ...applyingLifecycle,
                state: 'applied',
                appliedAt: new Date().toISOString(),
            };
            this.lifecycles.set(actionId, appliedLifecycle);
            return appliedLifecycle;
        }
        catch (err) {
            // Auto-rollback
            try {
                await this.snapshotManager.restoreSnapshots(snapshots);
                const rolledBack = {
                    ...applyingLifecycle,
                    state: 'rolled_back',
                    rolledBackAt: new Date().toISOString(),
                    error: err?.message || String(err),
                };
                this.lifecycles.set(actionId, rolledBack);
                return rolledBack;
            }
            catch (rollbackErr) {
                const failed = {
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
    getLifecycle(actionId) {
        return this.lifecycles.get(actionId);
    }
}
exports.EditorActionExecutor = EditorActionExecutor;
//# sourceMappingURL=editor-action-executor.js.map