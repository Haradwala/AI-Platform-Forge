/**
 * engineering-memory-store.ts — Workspace Memory & ADR Store
 *
 * Persists project Architectural Decision Records (ADRs), workspace memories,
 * and execution history links.
 */
import { IntelligenceDatabase } from '../storage/intelligence-database';
import { ArchitecturalDecision, WorkspaceMemoryItem } from '../contracts/intelligence-types';
export declare class EngineeringMemoryStore {
    private readonly db;
    constructor(db: IntelligenceDatabase);
    addArchitecturalDecision(adr: ArchitecturalDecision): Promise<void>;
    getArchitecturalDecisions(workspaceRoot: string): Promise<ArchitecturalDecision[]>;
    recordWorkspaceMemory(key: string, value: any, tags?: string[]): Promise<void>;
    queryMemories(query: string): Promise<WorkspaceMemoryItem[]>;
}
