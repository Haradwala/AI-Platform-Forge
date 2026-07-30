"use strict";
/**
 * runtime-session-storage.ts — Phase 24 Session Persistence Storage Abstraction
 *
 * Provides ISessionStorage interface with JsonSessionStorage implementation.
 * Abstracts session metadata persistence so migrating to SQLite later requires zero caller code changes.
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
exports.JsonSessionStorage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JsonSessionStorage {
    getStoragePath(workspaceRoot) {
        const forgeDir = path.join(workspaceRoot, '.forge');
        if (!fs.existsSync(forgeDir)) {
            fs.mkdirSync(forgeDir, { recursive: true });
        }
        return path.join(forgeDir, 'runtime-sessions.json');
    }
    async saveSession(session) {
        try {
            const storageFile = this.getStoragePath(session.workspaceRoot);
            let existing = {};
            if (fs.existsSync(storageFile)) {
                const raw = fs.readFileSync(storageFile, 'utf-8');
                existing = JSON.parse(raw || '{}');
            }
            existing[session.sessionId] = session;
            fs.writeFileSync(storageFile, JSON.stringify(existing, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[JsonSessionStorage] Failed to save session:', err.message);
        }
    }
    async getSession(sessionId, workspaceRoot = process.cwd()) {
        const all = await this.getAllSessions(workspaceRoot);
        return all.find((s) => s.sessionId === sessionId) || null;
    }
    async getAllSessions(workspaceRoot = process.cwd()) {
        try {
            const storageFile = this.getStoragePath(workspaceRoot);
            if (!fs.existsSync(storageFile))
                return [];
            const raw = fs.readFileSync(storageFile, 'utf-8');
            const data = JSON.parse(raw || '{}');
            return Object.values(data);
        }
        catch (err) {
            console.error('[JsonSessionStorage] Failed to read sessions:', err.message);
            return [];
        }
    }
    async deleteSession(sessionId, workspaceRoot = process.cwd()) {
        try {
            const storageFile = this.getStoragePath(workspaceRoot);
            if (!fs.existsSync(storageFile))
                return;
            const raw = fs.readFileSync(storageFile, 'utf-8');
            const data = JSON.parse(raw || '{}');
            delete data[sessionId];
            fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('[JsonSessionStorage] Failed to delete session:', err.message);
        }
    }
    async clear(workspaceRoot = process.cwd()) {
        try {
            const storageFile = this.getStoragePath(workspaceRoot);
            if (fs.existsSync(storageFile)) {
                fs.unlinkSync(storageFile);
            }
        }
        catch (err) {
            console.error('[JsonSessionStorage] Failed to clear storage:', err.message);
        }
    }
}
exports.JsonSessionStorage = JsonSessionStorage;
//# sourceMappingURL=runtime-session-storage.js.map