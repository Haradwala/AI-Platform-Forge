"use strict";
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
exports.SessionManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SessionManager {
    logger;
    workspaceService;
    fallbackSessionPath = '';
    constructor(logger, workspaceService) {
        this.logger = logger;
        this.workspaceService = workspaceService;
    }
    setFallbackSessionPath(p) {
        this.fallbackSessionPath = p;
    }
    getSessionFilePath() {
        const root = this.workspaceService.getRootPath();
        if (root) {
            return path.join(root, '.forge', 'session.json');
        }
        return this.fallbackSessionPath || null;
    }
    sessionState = null;
    async save(state) {
        const sessionFile = this.getSessionFilePath();
        if (!sessionFile) {
            this.logger.warn('[SessionManager] No active workspace or fallback path to save session.');
            return;
        }
        try {
            if (state !== undefined) {
                this.sessionState = state;
            }
            const data = {
                lastSaved: new Date().toISOString(),
                version: '1.0.0',
                workspaceRoot: this.workspaceService.getRootPath(),
                state: this.sessionState || {},
            };
            const dir = path.dirname(sessionFile);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(sessionFile, JSON.stringify(data, null, 2), 'utf-8');
            this.logger.info(`[SessionManager] Session saved successfully to ${sessionFile}`);
        }
        catch (err) {
            this.logger.error(`[SessionManager] Failed to save session: ${err.message}`);
            throw err;
        }
    }
    async restore() {
        const sessionFile = this.getSessionFilePath();
        if (!sessionFile || !fs.existsSync(sessionFile)) {
            this.logger.info('[SessionManager] No previous session file discovered.');
            return null;
        }
        try {
            const raw = fs.readFileSync(sessionFile, 'utf-8');
            const data = JSON.parse(raw);
            this.sessionState = data.state;
            this.logger.info(`[SessionManager] Session restored from ${sessionFile}. Last saved: ${data.lastSaved}`);
            return data;
        }
        catch (err) {
            this.logger.error(`[SessionManager] Failed to restore session: ${err.message}`);
            throw err;
        }
    }
    async clear() {
        const sessionFile = this.getSessionFilePath();
        if (sessionFile && fs.existsSync(sessionFile)) {
            try {
                fs.unlinkSync(sessionFile);
                this.logger.info('[SessionManager] Session cleared.');
            }
            catch (err) {
                this.logger.error(`[SessionManager] Failed to clear session: ${err.message}`);
                throw err;
            }
        }
    }
}
exports.SessionManager = SessionManager;
exports.default = SessionManager;
//# sourceMappingURL=session-manager.js.map