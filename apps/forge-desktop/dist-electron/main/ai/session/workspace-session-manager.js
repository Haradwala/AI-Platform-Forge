"use strict";
/**
 * workspace-session-manager.ts — Phase 25-28 Workspace Session Manager
 *
 * Persists and restores per-workspace session state in .forge/session/session.json
 * (conversations, execution history, approvals, active terminals, open tabs, recent commands).
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
exports.WorkspaceSessionManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class WorkspaceSessionManager {
    getSessionPath(workspaceRoot) {
        const dir = path.join(workspaceRoot, '.forge', 'session');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return path.join(dir, 'session.json');
    }
    /**
     * Saves workspace session state.
     */
    async saveSession(session) {
        try {
            const filePath = this.getSessionPath(session.workspaceRoot);
            session.lastSavedAt = Date.now();
            fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[WorkspaceSessionManager] Failed to save session:', err.message);
        }
    }
    /**
     * Restores workspace session state.
     */
    async restoreSession(workspaceRoot) {
        try {
            const filePath = this.getSessionPath(workspaceRoot);
            if (!fs.existsSync(filePath))
                return null;
            const raw = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch (err) {
            console.error('[WorkspaceSessionManager] Failed to restore session:', err.message);
            return null;
        }
    }
    /**
     * Clears workspace session data.
     */
    async clearSession(workspaceRoot) {
        try {
            const filePath = this.getSessionPath(workspaceRoot);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (err) {
            console.error('[WorkspaceSessionManager] Failed to clear session:', err.message);
        }
    }
}
exports.WorkspaceSessionManager = WorkspaceSessionManager;
//# sourceMappingURL=workspace-session-manager.js.map