/**
 * engineering-memory-store.ts — Workspace Memory & ADR Store
 *
 * Persists project Architectural Decision Records (ADRs), workspace memories,
 * and execution history links.
 */

import { IntelligenceDatabase } from '../storage/intelligence-database';
import { ArchitecturalDecision, WorkspaceMemoryItem } from '../contracts/intelligence-types';

export class EngineeringMemoryStore {
  constructor(private readonly db: IntelligenceDatabase) {}

  async addArchitecturalDecision(adr: ArchitecturalDecision): Promise<void> {
    await this.db.saveADR(adr);
  }

  async getArchitecturalDecisions(workspaceRoot: string): Promise<ArchitecturalDecision[]> {
    return this.db.listADRs(workspaceRoot);
  }

  async recordWorkspaceMemory(key: string, value: any, tags: string[] = []): Promise<void> {
    const memory: WorkspaceMemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      key,
      value,
      tags,
      updatedAt: Date.now(),
    };
    await this.db.saveMemory(memory);
  }

  async queryMemories(query: string): Promise<WorkspaceMemoryItem[]> {
    return this.db.queryMemories(query);
  }
}
