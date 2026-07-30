"use strict";
/**
 * session-store.ts — Persistent Storage for Multi-Runtime Sessions (.forge/runtime_sessions.json)
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
exports.SessionStore = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SessionStore {
    sessions = new Map();
    storePath = '';
    async initialize(workspaceRoot) {
        if (!workspaceRoot)
            return;
        const forgeDir = path.join(workspaceRoot, '.forge');
        if (!fs.existsSync(forgeDir)) {
            fs.mkdirSync(forgeDir, { recursive: true });
        }
        this.storePath = path.join(forgeDir, 'runtime_sessions.json');
        this.loadFromDisk();
    }
    async saveSession(session) {
        this.sessions.set(session.id, session);
        this.persistToDisk();
    }
    async getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }
    async listSessions(workspaceRoot) {
        return Array.from(this.sessions.values()).filter((s) => s.workspaceRoot === workspaceRoot);
    }
    loadFromDisk() {
        if (this.storePath && fs.existsSync(this.storePath)) {
            try {
                const raw = fs.readFileSync(this.storePath, 'utf-8');
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    parsed.forEach((s) => this.sessions.set(s.id, s));
                }
            }
            catch {
                // Ignore corrupt storage files
            }
        }
    }
    persistToDisk() {
        if (this.storePath) {
            try {
                const data = JSON.stringify(Array.from(this.sessions.values()), null, 2);
                fs.writeFileSync(this.storePath, data, 'utf-8');
            }
            catch {
                // Ignore disk write errors in ephemeral environments
            }
        }
    }
}
exports.SessionStore = SessionStore;
//# sourceMappingURL=session-store.js.map