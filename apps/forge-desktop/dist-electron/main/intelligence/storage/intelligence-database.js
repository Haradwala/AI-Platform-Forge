"use strict";
/**
 * intelligence-database.ts — SQLite Persistence Driver for Engineering Intelligence
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
exports.IntelligenceDatabase = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class IntelligenceDatabase {
    inMemoryFiles = new Map();
    inMemorySymbols = new Map();
    inMemoryEdges = new Map();
    inMemoryJobs = new Map();
    inMemoryAdrs = new Map();
    inMemoryMemories = new Map();
    dbPath = '';
    async initialize(workspaceRoot) {
        if (!workspaceRoot)
            return;
        const forgeDir = path.join(workspaceRoot, '.forge');
        if (!fs.existsSync(forgeDir)) {
            fs.mkdirSync(forgeDir, { recursive: true });
        }
        this.dbPath = path.join(forgeDir, 'intelligence.db');
    }
    // --- Files ---
    async saveFile(file) {
        this.inMemoryFiles.set(file.path, file);
    }
    async getFileByPath(filePath) {
        return this.inMemoryFiles.get(filePath) || null;
    }
    // --- Symbols / Nodes ---
    async saveNodes(nodes) {
        for (const node of nodes) {
            this.inMemorySymbols.set(node.id, node);
        }
    }
    async findSymbolsByName(name) {
        const results = [];
        const query = name.toLowerCase();
        for (const symbol of this.inMemorySymbols.values()) {
            if (symbol.name.toLowerCase().includes(query)) {
                results.push(symbol);
            }
        }
        return results;
    }
    async getNodesByFileId(fileId) {
        return Array.from(this.inMemorySymbols.values()).filter((n) => n.fileId === fileId);
    }
    // --- Knowledge Edges ---
    async saveEdges(edges) {
        for (const edge of edges) {
            this.inMemoryEdges.set(edge.id, edge);
        }
    }
    async getOutgoingEdges(sourceId) {
        return Array.from(this.inMemoryEdges.values()).filter((e) => e.sourceId === sourceId);
    }
    async getIncomingEdges(targetId) {
        return Array.from(this.inMemoryEdges.values()).filter((e) => e.targetId === targetId);
    }
    // --- Index Jobs Log ---
    async saveIndexJob(job) {
        this.inMemoryJobs.set(job.id, job);
    }
    async getIndexJob(jobId) {
        return this.inMemoryJobs.get(jobId) || null;
    }
    // --- ADRs ---
    async saveADR(adr) {
        this.inMemoryAdrs.set(adr.id, adr);
    }
    async listADRs(workspaceRoot) {
        return Array.from(this.inMemoryAdrs.values()).filter((a) => a.workspaceRoot === workspaceRoot);
    }
    // --- Workspace Memories ---
    async saveMemory(memory) {
        this.inMemoryMemories.set(memory.key, memory);
    }
    async queryMemories(query) {
        const q = query.toLowerCase();
        return Array.from(this.inMemoryMemories.values()).filter((m) => m.key.toLowerCase().includes(q) || JSON.stringify(m.value).toLowerCase().includes(q));
    }
    getDbPath() {
        return this.dbPath;
    }
}
exports.IntelligenceDatabase = IntelligenceDatabase;
//# sourceMappingURL=intelligence-database.js.map