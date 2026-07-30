"use strict";
/**
 * engineering-memory-store.ts — Workspace Memory & ADR Store
 *
 * Persists project Architectural Decision Records (ADRs), workspace memories,
 * and execution history links.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineeringMemoryStore = void 0;
class EngineeringMemoryStore {
    db;
    constructor(db) {
        this.db = db;
    }
    async addArchitecturalDecision(adr) {
        await this.db.saveADR(adr);
    }
    async getArchitecturalDecisions(workspaceRoot) {
        return this.db.listADRs(workspaceRoot);
    }
    async recordWorkspaceMemory(key, value, tags = []) {
        const memory = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            key,
            value,
            tags,
            updatedAt: Date.now(),
        };
        await this.db.saveMemory(memory);
    }
    async queryMemories(query) {
        return this.db.queryMemories(query);
    }
}
exports.EngineeringMemoryStore = EngineeringMemoryStore;
//# sourceMappingURL=engineering-memory-store.js.map