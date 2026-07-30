"use strict";
/**
 * action-history.ts — Phase 29 Multi-File Action History Audit Persistence
 *
 * Persists action execution history and timeline to .forge/history/
 * (actions.json, timeline.json, artifacts.json, errors.json).
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
exports.ActionHistory = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ActionHistory {
    getHistoryDir(workspaceRoot) {
        const dir = path.join(workspaceRoot, '.forge', 'history');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    }
    /**
     * Logs an action execution into multi-file audit logs.
     */
    async recordAction(req, res) {
        try {
            const dir = this.getHistoryDir(req.workspaceRoot);
            const entry = {
                id: req.id,
                actionId: req.actionId,
                runtimeId: req.runtimeId,
                workspaceRoot: req.workspaceRoot,
                status: res.status,
                timestamp: req.timestamp,
                durationMs: res.durationMs,
                params: req.params,
                result: res.data,
                error: res.error,
            };
            // 1. Append to actions.json
            const actionsFile = path.join(dir, 'actions.json');
            let actions = [];
            if (fs.existsSync(actionsFile)) {
                const raw = fs.readFileSync(actionsFile, 'utf-8');
                actions = JSON.parse(raw || '[]');
            }
            actions.push(entry);
            fs.writeFileSync(actionsFile, JSON.stringify(actions, null, 2), 'utf-8');
            // 2. Append to timeline.json
            const timelineFile = path.join(dir, 'timeline.json');
            let timeline = [];
            if (fs.existsSync(timelineFile)) {
                const raw = fs.readFileSync(timelineFile, 'utf-8');
                timeline = JSON.parse(raw || '[]');
            }
            timeline.push({
                id: req.id,
                actionId: req.actionId,
                status: res.status,
                timestamp: req.timestamp,
                durationMs: res.durationMs,
            });
            fs.writeFileSync(timelineFile, JSON.stringify(timeline, null, 2), 'utf-8');
            // 3. Append to errors.json if failed
            if (res.status === 'FAILED' && res.error) {
                const errorsFile = path.join(dir, 'errors.json');
                let errors = [];
                if (fs.existsSync(errorsFile)) {
                    const raw = fs.readFileSync(errorsFile, 'utf-8');
                    errors = JSON.parse(raw || '[]');
                }
                errors.push({ id: req.id, actionId: req.actionId, error: res.error, timestamp: Date.now() });
                fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2), 'utf-8');
            }
            // 4. Append artifacts to artifacts.json if present
            if (res.artifacts && res.artifacts.length > 0) {
                const artifactsFile = path.join(dir, 'artifacts.json');
                let artifacts = [];
                if (fs.existsSync(artifactsFile)) {
                    const raw = fs.readFileSync(artifactsFile, 'utf-8');
                    artifacts = JSON.parse(raw || '[]');
                }
                artifacts.push({ id: req.id, actionId: req.actionId, artifacts: res.artifacts, timestamp: Date.now() });
                fs.writeFileSync(artifactsFile, JSON.stringify(artifacts, null, 2), 'utf-8');
            }
        }
        catch (err) {
            console.error('[ActionHistory] Failed to record action audit log:', err.message);
        }
    }
    /**
     * Retrieves action history entries for a workspace.
     */
    async getHistory(workspaceRoot) {
        try {
            const dir = this.getHistoryDir(workspaceRoot);
            const actionsFile = path.join(dir, 'actions.json');
            if (!fs.existsSync(actionsFile))
                return [];
            const raw = fs.readFileSync(actionsFile, 'utf-8');
            return JSON.parse(raw || '[]');
        }
        catch (err) {
            return [];
        }
    }
}
exports.ActionHistory = ActionHistory;
//# sourceMappingURL=action-history.js.map