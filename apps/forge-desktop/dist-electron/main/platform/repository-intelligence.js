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
exports.RepositoryIntelligenceEngine = void 0;
const workspace_discovery_1 = require("./workspace-discovery");
const regex_parser_1 = require("./regex-parser");
const symbol_index_1 = require("./symbol-index");
const dependency_graph_1 = require("./dependency-graph");
const incremental_indexer_1 = require("./incremental-indexer");
const repository_search_1 = require("./repository-search");
const repository_diagnostics_1 = require("./repository-diagnostics");
const repository_events_1 = require("./repository-events");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class RepositoryIntelligenceEngine {
    workspaceService;
    id = 'RepositoryIntelligenceEngine';
    version = '2.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    discovery = new workspace_discovery_1.WorkspaceDiscoveryService();
    parser = new regex_parser_1.RegexParser();
    symbols = new symbol_index_1.SymbolIndexService();
    graph = new dependency_graph_1.DependencyGraphService();
    diagnosticsService = new repository_diagnostics_1.RepositoryDiagnosticsService();
    events;
    indexer;
    search;
    manifest = null;
    allWorkspaceFiles = [];
    listeners = new Set();
    startTime = Date.now();
    constructor(workspaceService, eventBus) {
        this.workspaceService = workspaceService;
        this.events = new repository_events_1.RepositoryEventService(eventBus);
        this.indexer = new incremental_indexer_1.IncrementalIndexerService(this.parser, this.symbols, this.graph, this.events);
        this.search = new repository_search_1.RepositorySearchService(this.symbols, this.graph);
        if (eventBus) {
            eventBus.on('workspace.loaded', () => {
                this.scanWorkspace().catch(() => { });
            });
            eventBus.on('workspace:file-created', (data) => {
                if (data?.path && !data.isDirectory) {
                    this.onFileAdded(data.path).catch(() => { });
                }
            });
            eventBus.on('workspace:file-deleted', (data) => {
                if (data?.path) {
                    this.onFileDeleted(data.path).catch(() => { });
                }
            });
            eventBus.on('workspace:file-changed', (data) => {
                if (data?.path) {
                    this.onFileChanged(data.path).catch(() => { });
                }
            });
        }
    }
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            filesIndexed: this.manifest?.filesCount || this.allWorkspaceFiles.length || 0,
            symbolsCount: this.symbols.getAll().length,
        };
    }
    onStart() { }
    onRunning() {
        this.scanWorkspace().catch(() => {
            this.health = 'degraded';
        });
    }
    onSuspend() { }
    onShutdown() {
        this.symbols.clear();
        this.graph.clear();
        this.listeners.clear();
        this.allWorkspaceFiles = [];
    }
    async scanWorkspace() {
        const root = this.workspaceService?.getRootPath() || process.cwd();
        if (!root)
            return;
        this.events.emitIndexingStarted();
        this.manifest = await this.discovery.discover(root);
        const relativeFiles = [];
        /**
         * Directories excluded from source-intelligence indexing.
         *
         * IMPORTANT: This controls what gets indexed for code analysis, NOT
         * filesystem visibility. A query like "Where is .vscode/settings.json?"
         * still works via the deterministic file-query path (raw fs operations).
         * These dirs are excluded to prevent build artifacts and IDE metadata
         * from polluting workspace search and symbol index results.
         */
        const SOURCE_EXCLUDED_DIRS = new Set([
            'node_modules', '.git', 'dist', 'dist-electron', 'build', 'out',
            '.forge', '.next', '.turbo', 'coverage', 'target', 'tmp', 'temp',
        ]);
        const parseDir = async (dir) => {
            const files = await fs.promises.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                const fullPath = path.join(dir, file.name);
                // Skip directories excluded from source-intelligence scope
                if (file.isDirectory()) {
                    if (SOURCE_EXCLUDED_DIRS.has(file.name))
                        continue;
                    await parseDir(fullPath);
                }
                else if (file.isFile()) {
                    const relPath = path.relative(root, fullPath);
                    // Exclude generated .d.ts files inside build output dirs.
                    // Source .d.ts files (e.g. src/types/env.d.ts) are preserved.
                    if (relPath.endsWith('.d.ts')) {
                        const normalizedRel = relPath.replace(/\\/g, '/');
                        const buildDirPattern = /^(dist|dist-electron|build|out|\.next)\//;
                        if (buildDirPattern.test(normalizedRel)) {
                            continue;
                        }
                    }
                    relativeFiles.push(relPath);
                    if (this.parser.supports(fullPath)) {
                        await this.indexer.indexFile(fullPath);
                    }
                }
            }
        };
        try {
            await parseDir(root);
            this.allWorkspaceFiles = relativeFiles;
            if (this.manifest) {
                this.manifest.filesCount = Math.max(this.manifest.filesCount || 0, relativeFiles.length);
            }
            this.status = 'running';
            this.health = 'healthy';
            this.diagnosticsService.writeDiagnostics(root, this.manifest, this.symbols, this.graph);
        }
        catch (err) {
            this.health = 'warning';
        }
        finally {
            this.events.emitIndexingCompleted();
        }
    }
    async query(request) {
        try {
            const root = this.workspaceService?.getRootPath() || process.cwd();
            if (root && !this.manifest) {
                await this.scanWorkspace();
            }
            switch (request.type) {
                case 'findSymbol': {
                    const syms = this.search.findSymbol(request.query);
                    return { success: true, data: syms };
                }
                case 'findReferences': {
                    const refs = this.search.findReferences(request.symbolName);
                    return { success: true, data: refs };
                }
                case 'findImplementations': {
                    const impls = this.search.findImplementations(request.interfaceName);
                    return { success: true, data: impls };
                }
                case 'findCallers': {
                    const callers = this.search.findCallers(request.functionName);
                    return { success: true, data: callers };
                }
                case 'findDependencyPath': {
                    const path = this.graph.findDependencyPath(request.from, request.to);
                    return { success: true, data: path };
                }
                case 'findCircularDependencies': {
                    const cycles = this.graph.findCircularDependencies();
                    return { success: true, data: cycles };
                }
                case 'findFile': {
                    const files = this.search.findFile(request.query, this.allWorkspaceFiles);
                    return { success: true, data: files };
                }
                case 'workspaceStatistics': {
                    return {
                        success: true,
                        data: {
                            filesCount: this.manifest?.filesCount || this.allWorkspaceFiles.length || 0,
                            symbolsCount: this.symbols.getAll().length,
                            circularDependenciesCount: this.graph.findCircularDependencies().length,
                            languages: this.manifest?.languages || [],
                            projects: this.manifest?.projects || [],
                        },
                    };
                }
                case 'findFilesByLanguage': {
                    const lang = request.language.toLowerCase();
                    const matches = this.allWorkspaceFiles.filter((f) => {
                        const ext = path.extname(f).toLowerCase();
                        if (lang === 'typescript')
                            return ext === '.ts' || ext === '.tsx';
                        if (lang === 'javascript')
                            return ext === '.js' || ext === '.jsx';
                        if (lang === 'python')
                            return ext === '.py';
                        return ext.includes(lang);
                    });
                    return { success: true, data: matches };
                }
                default:
                    return { success: false, data: null, error: `Unsupported query type: ${request.type}` };
            }
        }
        catch (err) {
            return { success: false, data: null, error: err.message };
        }
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return {
            dispose: () => {
                this.listeners.delete(listener);
            },
        };
    }
    async onFileAdded(filePath) {
        const root = this.workspaceService.getRootPath();
        if (root) {
            const relPath = path.relative(root, filePath);
            if (!this.allWorkspaceFiles.includes(relPath)) {
                this.allWorkspaceFiles.push(relPath);
            }
            if (this.manifest) {
                this.manifest.filesCount = this.allWorkspaceFiles.length;
            }
        }
        if (this.parser.supports(filePath)) {
            await this.indexer.indexFile(filePath);
        }
    }
    async onFileDeleted(filePath) {
        const root = this.workspaceService.getRootPath();
        if (root) {
            const relPath = path.relative(root, filePath);
            this.allWorkspaceFiles = this.allWorkspaceFiles.filter((f) => f !== relPath && f !== filePath);
            if (this.manifest) {
                this.manifest.filesCount = this.allWorkspaceFiles.length;
            }
        }
    }
    async onFileChanged(filePath) {
        if (this.parser.supports(filePath)) {
            await this.indexer.indexFile(filePath);
            const root = this.workspaceService.getRootPath();
            if (root && this.manifest) {
                this.diagnosticsService.writeDiagnostics(root, this.manifest, this.symbols, this.graph);
            }
            for (const listener of this.listeners) {
                listener({ type: 'file-updated', payload: { filePath } });
            }
        }
    }
}
exports.RepositoryIntelligenceEngine = RepositoryIntelligenceEngine;
//# sourceMappingURL=repository-intelligence.js.map