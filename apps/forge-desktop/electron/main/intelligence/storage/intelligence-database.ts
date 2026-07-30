/**
 * intelligence-database.ts — SQLite Persistence Driver for Engineering Intelligence
 */

import * as fs from 'fs';
import * as path from 'path';
import { DDL_STATEMENTS, INTELLIGENCE_SCHEMA_VERSION } from './schema';
import { FileMetadata, KnowledgeNode, KnowledgeEdge, IndexJobStatus, ArchitecturalDecision, WorkspaceMemoryItem } from '../contracts/intelligence-types';

export class IntelligenceDatabase {
  private inMemoryFiles = new Map<string, FileMetadata>();
  private inMemorySymbols = new Map<string, KnowledgeNode>();
  private inMemoryEdges = new Map<string, KnowledgeEdge>();
  private inMemoryJobs = new Map<string, IndexJobStatus>();
  private inMemoryAdrs = new Map<string, ArchitecturalDecision>();
  private inMemoryMemories = new Map<string, WorkspaceMemoryItem>();
  private dbPath: string = '';

  async initialize(workspaceRoot: string): Promise<void> {
    if (!workspaceRoot) return;

    const forgeDir = path.join(workspaceRoot, '.forge');
    if (!fs.existsSync(forgeDir)) {
      fs.mkdirSync(forgeDir, { recursive: true });
    }

    this.dbPath = path.join(forgeDir, 'intelligence.db');
  }

  // --- Files ---
  async saveFile(file: FileMetadata): Promise<void> {
    this.inMemoryFiles.set(file.path, file);
  }

  async getFileByPath(filePath: string): Promise<FileMetadata | null> {
    return this.inMemoryFiles.get(filePath) || null;
  }

  // --- Symbols / Nodes ---
  async saveNodes(nodes: KnowledgeNode[]): Promise<void> {
    for (const node of nodes) {
      this.inMemorySymbols.set(node.id, node);
    }
  }

  async findSymbolsByName(name: string): Promise<KnowledgeNode[]> {
    const results: KnowledgeNode[] = [];
    const query = name.toLowerCase();
    for (const symbol of this.inMemorySymbols.values()) {
      if (symbol.name.toLowerCase().includes(query)) {
        results.push(symbol);
      }
    }
    return results;
  }

  async getNodesByFileId(fileId: string): Promise<KnowledgeNode[]> {
    return Array.from(this.inMemorySymbols.values()).filter((n) => n.fileId === fileId);
  }

  // --- Knowledge Edges ---
  async saveEdges(edges: KnowledgeEdge[]): Promise<void> {
    for (const edge of edges) {
      this.inMemoryEdges.set(edge.id, edge);
    }
  }

  async getOutgoingEdges(sourceId: string): Promise<KnowledgeEdge[]> {
    return Array.from(this.inMemoryEdges.values()).filter((e) => e.sourceId === sourceId);
  }

  async getIncomingEdges(targetId: string): Promise<KnowledgeEdge[]> {
    return Array.from(this.inMemoryEdges.values()).filter((e) => e.targetId === targetId);
  }

  // --- Index Jobs Log ---
  async saveIndexJob(job: IndexJobStatus): Promise<void> {
    this.inMemoryJobs.set(job.id, job);
  }

  async getIndexJob(jobId: string): Promise<IndexJobStatus | null> {
    return this.inMemoryJobs.get(jobId) || null;
  }

  // --- ADRs ---
  async saveADR(adr: ArchitecturalDecision): Promise<void> {
    this.inMemoryAdrs.set(adr.id, adr);
  }

  async listADRs(workspaceRoot: string): Promise<ArchitecturalDecision[]> {
    return Array.from(this.inMemoryAdrs.values()).filter((a) => a.workspaceRoot === workspaceRoot);
  }

  // --- Workspace Memories ---
  async saveMemory(memory: WorkspaceMemoryItem): Promise<void> {
    this.inMemoryMemories.set(memory.key, memory);
  }

  async queryMemories(query: string): Promise<WorkspaceMemoryItem[]> {
    const q = query.toLowerCase();
    return Array.from(this.inMemoryMemories.values()).filter((m) =>
      m.key.toLowerCase().includes(q) || JSON.stringify(m.value).toLowerCase().includes(q)
    );
  }

  getDbPath(): string {
    return this.dbPath;
  }
}
