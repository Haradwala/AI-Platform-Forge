"use strict";
/**
 * action-snapshot-manager.ts
 *
 * Sprint 86 Phase 5 — Action Snapshot Manager
 *
 * Captures in-memory snapshots of file contents before applying edits,
 * enabling atomic rollback if an edit application fails.
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
exports.ActionSnapshotManager = void 0;
const fs = __importStar(require("fs"));
class ActionSnapshotManager {
    /**
     * Capture file content snapshots for a set of file paths.
     */
    async captureSnapshots(filePaths) {
        const snapshots = new Map();
        for (const filePath of filePaths) {
            try {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    snapshots.set(filePath, content);
                }
            }
            catch {
                // If unreadable or non-existent, snapshot won't store a content string
            }
        }
        return snapshots;
    }
    /**
     * Restore file contents from a set of snapshots.
     */
    async restoreSnapshots(snapshots) {
        for (const [filePath, content] of snapshots.entries()) {
            try {
                fs.writeFileSync(filePath, content, 'utf8');
            }
            catch (err) {
                throw new Error(`Failed to restore snapshot for "${filePath}": ${err.message}`);
            }
        }
    }
}
exports.ActionSnapshotManager = ActionSnapshotManager;
//# sourceMappingURL=action-snapshot-manager.js.map