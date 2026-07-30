"use strict";
/**
 * workspace-snapshot.ts
 *
 * Captures workspace state snapshots and manages temporary checkpoints for rollback & state restoration.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceSnapshot = void 0;
class WorkspaceSnapshot {
    fileOps;
    snapshots = new Map();
    constructor(fileOps) {
        this.fileOps = fileOps;
    }
    async createSnapshot(id, filePaths, signal) {
        if (signal?.aborted)
            throw new Error('Snapshot creation cancelled by AbortSignal.');
        const files = new Map();
        for (const p of filePaths) {
            if (signal?.aborted)
                throw new Error('Snapshot creation cancelled by AbortSignal.');
            if (await this.fileOps.exists(p, signal)) {
                const content = await this.fileOps.readFile(p, signal);
                files.set(p, content);
            }
        }
        const state = {
            id,
            timestamp: Date.now(),
            files,
        };
        this.snapshots.set(id, state);
        return state;
    }
    async restoreSnapshot(id, signal) {
        if (signal?.aborted)
            throw new Error('Snapshot restoration cancelled by AbortSignal.');
        const snapshot = this.snapshots.get(id);
        if (!snapshot) {
            throw new Error(`Snapshot "${id}" not found.`);
        }
        for (const [filePath, content] of snapshot.files.entries()) {
            if (signal?.aborted)
                throw new Error('Snapshot restoration cancelled by AbortSignal.');
            await this.fileOps.writeFile(filePath, content, signal);
        }
    }
    getSnapshot(id) {
        return this.snapshots.get(id) || null;
    }
    deleteSnapshot(id) {
        this.snapshots.delete(id);
    }
    clear() {
        this.snapshots.clear();
    }
}
exports.WorkspaceSnapshot = WorkspaceSnapshot;
//# sourceMappingURL=workspace-snapshot.js.map