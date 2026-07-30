"use strict";
/**
 * workspace-engine.ts
 *
 * Phase 10 — Workspace Operations Engine Facade.
 *
 * Canonical facade for all repository modifications.
 * Coordinates FileOperations, PatchEngine, WorkspaceDiff, and WorkspaceSnapshot.
 * Enforces atomic writes, transactional rollbacks, AbortSignal support, and zero direct fs calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceEngine = void 0;
const file_operations_1 = require("./file-operations");
const patch_engine_1 = require("./patch-engine");
const workspace_diff_1 = require("./workspace-diff");
const workspace_snapshot_1 = require("./workspace-snapshot");
class WorkspaceEngine {
    fileOps = new file_operations_1.FileOperations();
    patchEngine;
    diffEngine;
    snapshotEngine;
    constructor() {
        this.patchEngine = new patch_engine_1.PatchEngine(this.fileOps);
        this.diffEngine = new workspace_diff_1.WorkspaceDiff(this.fileOps);
        this.snapshotEngine = new workspace_snapshot_1.WorkspaceSnapshot(this.fileOps);
    }
    async readFile(filePath, signal) {
        return this.fileOps.readFile(filePath, signal);
    }
    async writeFile(filePath, content, signal) {
        return this.fileOps.writeFile(filePath, content, signal);
    }
    async createFile(filePath, content = '', signal) {
        return this.fileOps.createFile(filePath, content, signal);
    }
    async deleteFile(filePath, signal) {
        return this.fileOps.deleteFile(filePath, signal);
    }
    async rename(oldPath, newPath, signal) {
        return this.fileOps.rename(oldPath, newPath, signal);
    }
    async mkdir(dirPath, signal) {
        return this.fileOps.mkdir(dirPath, signal);
    }
    async exists(filePath, signal) {
        return this.fileOps.exists(filePath, signal);
    }
    async list(dirPath, signal) {
        return this.fileOps.list(dirPath, signal);
    }
    async applyPatch(patches, options = {}) {
        return this.patchEngine.applyPatch(patches, options);
    }
    async createSnapshot(id, filePaths, signal) {
        return this.snapshotEngine.createSnapshot(id, filePaths, signal);
    }
    async restoreSnapshot(id, signal) {
        return this.snapshotEngine.restoreSnapshot(id, signal);
    }
    diff(oldContent, newContent, filePath = '') {
        return this.diffEngine.diffContent(oldContent, newContent, filePath);
    }
    generateDiffReport(items) {
        return this.diffEngine.generateReport(items);
    }
}
exports.WorkspaceEngine = WorkspaceEngine;
//# sourceMappingURL=workspace-engine.js.map