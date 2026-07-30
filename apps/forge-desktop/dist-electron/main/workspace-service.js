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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const workspace_metadata_1 = require("./workspace-metadata");
/**
 * WorkspaceService — handles folder open/close, CRUD operations on files,
 * and watches for changes via chokidar to stream them to the renderer.
 */
class WorkspaceService {
    registry;
    logger;
    eventBus;
    rootPath = null;
    watcher = null;
    constructor(registry, logger, eventBus) {
        this.registry = registry;
        this.logger = logger;
        this.eventBus = eventBus;
    }
    getRootPath() {
        return this.rootPath;
    }
    async open(workspaceRoot) {
        const resolvedRoot = path.resolve(workspaceRoot);
        if (!fs.existsSync(resolvedRoot)) {
            throw new Error(`Workspace path does not exist: ${workspaceRoot}`);
        }
        const stats = fs.statSync(resolvedRoot);
        if (!stats.isDirectory()) {
            throw new Error(`Workspace path is not a directory: ${workspaceRoot}`);
        }
        // Close any currently active workspace
        await this.close();
        this.rootPath = resolvedRoot;
        this.logger.info(`[WorkspaceService] Opening workspace: ${this.rootPath}`);
        // 1. Initialize .forge metadata directory, update gitignore (Epic 9)
        workspace_metadata_1.WorkspaceMetadata.init(this.rootPath);
        // 2. Start watching folder via chokidar
        this.startWatcher();
        // 3. Build and return initial tree
        const tree = this.buildTree(this.rootPath);
        // 4. Emit workspace loaded event
        this.eventBus?.emit('workspace.loaded', { rootPath: this.rootPath });
        this.sendToAllWindows('window:state-changed', { workspaceOpen: true, rootPath: this.rootPath });
        return tree;
    }
    async close() {
        if (this.rootPath) {
            this.logger.info(`[WorkspaceService] Closing workspace: ${this.rootPath}`);
            this.stopWatcher();
            const oldRoot = this.rootPath;
            this.rootPath = null;
            this.eventBus?.emit('workspace.closed', { rootPath: oldRoot });
            this.sendToAllWindows('window:state-changed', { workspaceOpen: false, rootPath: null });
        }
    }
    async getRecentWorkspaces() {
        return workspace_metadata_1.WorkspaceMetadata.getRecent();
    }
    async getTree() {
        if (!this.rootPath)
            return null;
        return this.buildTree(this.rootPath);
    }
    async readFile(filePath) {
        const resolved = this.validatePath(filePath);
        const stats = fs.statSync(resolved);
        if (stats.isDirectory()) {
            throw new Error(`Path is a directory: ${filePath}`);
        }
        return fs.readFileSync(resolved, 'utf-8');
    }
    async writeFile(filePath, content) {
        const resolved = this.validatePath(filePath);
        fs.writeFileSync(resolved, content, 'utf-8');
        this.logger.info(`[WorkspaceService] Wrote file: ${resolved}`);
    }
    async createFile(filePath) {
        const resolved = this.validatePath(filePath);
        if (fs.existsSync(resolved)) {
            throw new Error(`File already exists: ${filePath}`);
        }
        fs.mkdirSync(path.dirname(resolved), { recursive: true });
        fs.writeFileSync(resolved, '', 'utf-8');
        this.logger.info(`[WorkspaceService] Created empty file: ${resolved}`);
    }
    async createFolder(folderPath) {
        const resolved = this.validatePath(folderPath);
        if (fs.existsSync(resolved)) {
            throw new Error(`Folder already exists: ${folderPath}`);
        }
        fs.mkdirSync(resolved, { recursive: true });
        this.logger.info(`[WorkspaceService] Created folder: ${resolved}`);
    }
    async deleteEntry(entryPath) {
        const resolved = this.validatePath(entryPath);
        if (!fs.existsSync(resolved)) {
            throw new Error(`Path does not exist: ${entryPath}`);
        }
        const stats = fs.statSync(resolved);
        if (stats.isDirectory()) {
            fs.rmSync(resolved, { recursive: true, force: true });
        }
        else {
            fs.unlinkSync(resolved);
        }
        this.logger.info(`[WorkspaceService] Deleted entry: ${resolved}`);
    }
    async renameEntry(oldPath, newPath) {
        const resolvedOld = this.validatePath(oldPath);
        const resolvedNew = this.validatePath(newPath);
        if (!fs.existsSync(resolvedOld)) {
            throw new Error(`Source path does not exist: ${oldPath}`);
        }
        if (fs.existsSync(resolvedNew)) {
            throw new Error(`Destination path already exists: ${newPath}`);
        }
        fs.renameSync(resolvedOld, resolvedNew);
        this.logger.info(`[WorkspaceService] Renamed ${resolvedOld} to ${resolvedNew}`);
    }
    // ─── Private Helpers ───────────────────────────────────────────────────────
    validatePath(targetPath) {
        if (!this.rootPath) {
            throw new Error('Workspace is not open.');
        }
        // Handle both absolute paths and workspace-relative paths
        const resolved = path.isAbsolute(targetPath)
            ? path.resolve(targetPath)
            : path.resolve(this.rootPath, targetPath);
        const relative = path.relative(this.rootPath, resolved);
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
            throw new Error(`Access Denied: Path "${targetPath}" is outside workspace root: ${this.rootPath}`);
        }
        return resolved;
    }
    buildTree(dirPath) {
        const name = path.basename(dirPath);
        const stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) {
            return { name, path: dirPath, isDirectory: false, size: stats.size };
        }
        const children = [];
        const entries = fs.readdirSync(dirPath);
        for (const entry of entries) {
            // Skip VCS and metadata directories to avoid clutter
            if (entry === '.git' || entry === '.forge' || entry === 'node_modules' || entry === '.DS_Store') {
                continue;
            }
            const fullPath = path.join(dirPath, entry);
            try {
                children.push(this.buildTree(fullPath));
            }
            catch {
                // Skip entry if permission denied or broken symlink
            }
        }
        // Sort: directories first, then alphabetically
        children.sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) {
                return a.isDirectory ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        return { name, path: dirPath, isDirectory: true, children };
    }
    startWatcher() {
        if (!this.rootPath)
            return;
        this.watcher = chokidar_1.default.watch(this.rootPath, {
            ignored: [
                '**/node_modules/**',
                '**/.git/**',
                '**/.forge/**',
                '**/.DS_Store',
                '**/dist/**',
                '**/dist-electron/**',
                '**/coverage/**',
                '**/temp/**',
                '**/tests/temp*/**',
                '**/temp_*/**',
            ],
            persistent: true,
            ignoreInitial: true,
            depth: 99,
        });
        this.watcher.on('add', (filePath) => {
            this.logger.debug(`[WorkspaceService] Watcher: File added ${filePath}`);
            this.sendToAllWindows('workspace:file-created', { path: filePath, isDirectory: false });
        });
        this.watcher.on('addDir', (dirPath) => {
            this.logger.debug(`[WorkspaceService] Watcher: Directory added ${dirPath}`);
            this.sendToAllWindows('workspace:file-created', { path: dirPath, isDirectory: true });
        });
        this.watcher.on('change', (filePath) => {
            this.logger.debug(`[WorkspaceService] Watcher: File changed ${filePath}`);
            this.sendToAllWindows('workspace:file-changed', { path: filePath });
        });
        this.watcher.on('unlink', (filePath) => {
            this.logger.debug(`[WorkspaceService] Watcher: File deleted ${filePath}`);
            this.sendToAllWindows('workspace:file-deleted', { path: filePath });
        });
        this.watcher.on('unlinkDir', (dirPath) => {
            this.logger.debug(`[WorkspaceService] Watcher: Directory deleted ${dirPath}`);
            this.sendToAllWindows('workspace:file-deleted', { path: dirPath });
        });
    }
    stopWatcher() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
    }
    sendToAllWindows(channel, data) {
        try {
            const windows = this.registry.getAll();
            for (const entry of windows) {
                if (!entry.window.isDestroyed()) {
                    entry.window.webContents.send(channel, data);
                }
            }
        }
        catch (err) {
            this.logger.error('[WorkspaceService] Failed to send push notification to windows:', err);
        }
    }
}
exports.WorkspaceService = WorkspaceService;
//# sourceMappingURL=workspace-service.js.map