"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionSnapshotService = void 0;
class ExecutionSnapshotService {
    checkpoints = new Map();
    saveCheckpoint(checkpointId, planId, events, workspaceRoot) {
        const checkpoint = {
            checkpointId,
            timestamp: new Date().toISOString(),
            planId,
            events: [...events],
            workspaceMetadata: {
                workspaceRoot,
                savedTime: Date.now(),
            },
        };
        this.checkpoints.set(checkpointId, checkpoint);
        return checkpoint;
    }
    restoreCheckpoint(checkpointId) {
        return this.checkpoints.get(checkpointId) || null;
    }
    replayExecution(checkpointId) {
        const cp = this.restoreCheckpoint(checkpointId);
        return cp ? cp.events : [];
    }
    clear() {
        this.checkpoints.clear();
    }
}
exports.ExecutionSnapshotService = ExecutionSnapshotService;
//# sourceMappingURL=execution-snapshot-service.js.map