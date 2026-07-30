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
exports.WorkspaceMetadata = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const electron_1 = require("electron");
/**
 * WorkspaceMetadata — handles the creation and management of workspace-specific
 * metadata inside the .forge/ directory, and manages the global recent workspaces list.
 */
class WorkspaceMetadata {
    /**
     * Initializes the .forge/ directory, creates subfolders, updates .gitignore,
     * and registers the folder in the recent workspaces list.
     */
    static init(workspaceRoot) {
        if (!fs.existsSync(workspaceRoot)) {
            throw new Error(`Workspace root does not exist: ${workspaceRoot}`);
        }
        const forgeDir = path.join(workspaceRoot, '.forge');
        fs.mkdirSync(forgeDir, { recursive: true });
        // 1. Create subdirectories
        const subdirs = ['cache', 'logs', 'checkpoints', 'indexes'];
        for (const subdir of subdirs) {
            fs.mkdirSync(path.join(forgeDir, subdir), { recursive: true });
        }
        // 2. Create workspace.json with basic metadata
        const workspaceJsonPath = path.join(forgeDir, 'workspace.json');
        if (!fs.existsSync(workspaceJsonPath)) {
            const config = {
                id: Math.random().toString(36).substring(2, 15),
                name: path.basename(workspaceRoot),
                openedAt: new Date().toISOString(),
            };
            fs.writeFileSync(workspaceJsonPath, JSON.stringify(config, null, 2), 'utf-8');
        }
        // 3. Update .gitignore if present, or create one to ignore .forge/
        const gitignorePath = path.join(workspaceRoot, '.gitignore');
        let gitignoreContent = '';
        if (fs.existsSync(gitignorePath)) {
            gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        }
        const hasIgnore = gitignoreContent
            .split('\n')
            .map((line) => line.trim())
            .includes('.forge/');
        if (!hasIgnore) {
            const separator = gitignoreContent.endsWith('\n') || gitignoreContent === '' ? '' : '\n';
            fs.writeFileSync(gitignorePath, gitignoreContent + separator + '.forge/\n', 'utf-8');
        }
        // 4. Update the global list of recent workspaces
        this.addToRecent(workspaceRoot);
    }
    /**
     * Returns the list of recent workspaces.
     */
    static getRecent() {
        try {
            const recentPath = this.getRecentFilePath();
            if (fs.existsSync(recentPath)) {
                const content = fs.readFileSync(recentPath, 'utf-8');
                return JSON.parse(content);
            }
        }
        catch {
            // Fallback if file corrupt or unreadable
        }
        return [];
    }
    /**
     * Clears the list of recent workspaces.
     */
    static clearRecent() {
        try {
            const recentPath = this.getRecentFilePath();
            if (fs.existsSync(recentPath)) {
                fs.unlinkSync(recentPath);
            }
        }
        catch {
            // safe fallback
        }
    }
    // ─── Private Helpers ───────────────────────────────────────────────────────
    static addToRecent(workspaceRoot) {
        try {
            const recentPath = this.getRecentFilePath();
            let list = [];
            if (fs.existsSync(recentPath)) {
                const content = fs.readFileSync(recentPath, 'utf-8');
                list = JSON.parse(content);
            }
            // Put the current workspace root first, deduplicate
            list = [workspaceRoot, ...list.filter((p) => p !== workspaceRoot)];
            // Keep up to 10 items
            list = list.slice(0, 10);
            fs.mkdirSync(path.dirname(recentPath), { recursive: true });
            fs.writeFileSync(recentPath, JSON.stringify(list, null, 2), 'utf-8');
        }
        catch (err) {
            // Do not crash the application if recent storage fails
            console.error('[WorkspaceMetadata] Failed to update recent list:', err);
        }
    }
    static getRecentFilePath() {
        try {
            return path.join(electron_1.app.getPath('userData'), 'recent-workspaces.json');
        }
        catch {
            // Vitest / Node fallback during tests
            return path.join(process.cwd(), 'temp', 'recent-workspaces.json');
        }
    }
}
exports.WorkspaceMetadata = WorkspaceMetadata;
//# sourceMappingURL=workspace-metadata.js.map