"use strict";
/**
 * repository-index-coordinator.ts — Central Indexing Coordinator & Live Event Watcher
 *
 * Coordinates full workspace scans, file hashing, batch parsing, and live incremental
 * re-indexing upon `workspace.file_changed` DesktopEventBus events.
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
exports.RepositoryIndexCoordinator = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const language_parser_registry_1 = require("../parser/language-parser-registry");
class RepositoryIndexCoordinator {
    db;
    parserRegistry;
    timelinePublisher;
    eventBus;
    activeJobs = new Map();
    isPaused = false;
    constructor(db, parserRegistry = new language_parser_registry_1.LanguageParserRegistry(), timelinePublisher, eventBus) {
        this.db = db;
        this.parserRegistry = parserRegistry;
        this.timelinePublisher = timelinePublisher;
        this.eventBus = eventBus;
        this.setupLiveWatcher();
    }
    /**
     * Starts a full or incremental repository indexing job across 1M+ LOC codebases.
     */
    async startIndexing(workspaceRoot) {
        await this.db.initialize(workspaceRoot);
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const startTime = Date.now();
        const job = {
            id: jobId,
            workspaceRoot,
            status: 'running',
            startedAt: startTime,
            filesScanned: 0,
            filesIndexed: 0,
            errorsCount: 0,
        };
        this.activeJobs.set(jobId, job);
        await this.db.saveIndexJob(job);
        if (this.timelinePublisher)
            this.timelinePublisher.publishIndexingStarted(job);
        try {
            const filesToProcess = this.collectFiles(workspaceRoot);
            job.filesScanned = filesToProcess.length;
            for (const filePath of filesToProcess) {
                if (this.isPaused)
                    break;
                await this.indexSingleFile(workspaceRoot, filePath);
                job.filesIndexed++;
            }
            job.status = 'completed';
            job.finishedAt = Date.now();
            job.durationMs = job.finishedAt - startTime;
        }
        catch (err) {
            job.status = 'failed';
            job.errorsCount++;
            job.details = { error: err.message || String(err) };
        }
        finally {
            await this.db.saveIndexJob(job);
            if (this.timelinePublisher)
                this.timelinePublisher.publishIndexingCompleted(job);
        }
        return job;
    }
    /**
     * Indexes a single file incrementally. Computes hash to skip unchanged files.
     */
    async indexSingleFile(workspaceRoot, filePath) {
        if (!fs.existsSync(filePath))
            return;
        const content = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        const stat = fs.statSync(filePath);
        const existingFile = await this.db.getFileByPath(filePath);
        if (existingFile && existingFile.hash === hash) {
            // Skip indexing if hash is unchanged
            return;
        }
        const fileId = `file_${crypto.createHash('md5').update(filePath).digest('hex')}`;
        const fileMeta = {
            id: fileId,
            path: filePath,
            hash,
            language: path.extname(filePath).replace('.', '') || 'unknown',
            sizeBytes: stat.size,
            lastIndexedAt: Date.now(),
        };
        await this.db.saveFile(fileMeta);
        // Parse symbols and relationship edges
        const parseResult = await this.parserRegistry.parseFile(filePath, content, fileId);
        if (parseResult.nodes.length > 0) {
            await this.db.saveNodes(parseResult.nodes);
        }
        if (parseResult.edges.length > 0) {
            await this.db.saveEdges(parseResult.edges);
        }
    }
    pauseIndexing() {
        this.isPaused = true;
    }
    resumeIndexing() {
        this.isPaused = false;
    }
    async getIndexJob(jobId) {
        return this.db.getIndexJob(jobId);
    }
    setupLiveWatcher() {
        if (!this.eventBus)
            return;
        this.eventBus.on('workspace.file_changed', (payload) => {
            if (payload && payload.filePath && payload.workspaceRoot) {
                this.indexSingleFile(payload.workspaceRoot, payload.filePath).catch(() => { });
            }
        });
    }
    collectFiles(dir) {
        const results = [];
        if (!fs.existsSync(dir))
            return results;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (!['node_modules', '.git', 'dist', '.forge', 'release', 'build'].includes(entry.name)) {
                    results.push(...this.collectFiles(fullPath));
                }
            }
            else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.py', '.go', '.rs'].includes(ext)) {
                    results.push(fullPath);
                }
            }
        }
        return results;
    }
}
exports.RepositoryIndexCoordinator = RepositoryIndexCoordinator;
//# sourceMappingURL=repository-index-coordinator.js.map