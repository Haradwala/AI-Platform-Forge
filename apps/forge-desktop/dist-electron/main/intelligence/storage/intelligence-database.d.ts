/**
 * intelligence-database.ts — SQLite Persistence Driver for Engineering Intelligence
 */
import { FileMetadata, KnowledgeNode, KnowledgeEdge, IndexJobStatus, ArchitecturalDecision, WorkspaceMemoryItem } from '../contracts/intelligence-types';
export declare class IntelligenceDatabase {
    private inMemoryFiles;
    private inMemorySymbols;
    private inMemoryEdges;
    private inMemoryJobs;
    private inMemoryAdrs;
    private inMemoryMemories;
    private dbPath;
    initialize(workspaceRoot: string): Promise<void>;
    saveFile(file: FileMetadata): Promise<void>;
    getFileByPath(filePath: string): Promise<FileMetadata | null>;
    saveNodes(nodes: KnowledgeNode[]): Promise<void>;
    findSymbolsByName(name: string): Promise<KnowledgeNode[]>;
    getNodesByFileId(fileId: string): Promise<KnowledgeNode[]>;
    saveEdges(edges: KnowledgeEdge[]): Promise<void>;
    getOutgoingEdges(sourceId: string): Promise<KnowledgeEdge[]>;
    getIncomingEdges(targetId: string): Promise<KnowledgeEdge[]>;
    saveIndexJob(job: IndexJobStatus): Promise<void>;
    getIndexJob(jobId: string): Promise<IndexJobStatus | null>;
    saveADR(adr: ArchitecturalDecision): Promise<void>;
    listADRs(workspaceRoot: string): Promise<ArchitecturalDecision[]>;
    saveMemory(memory: WorkspaceMemoryItem): Promise<void>;
    queryMemories(query: string): Promise<WorkspaceMemoryItem[]>;
    getDbPath(): string;
}
