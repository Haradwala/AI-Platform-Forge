"use strict";
/**
 * knowledge-graph-engine.ts — Knowledge Graph Query & Traversal Engine
 *
 * Traverses code entities (Functions, Classes, Interfaces, APIs, Imports) and relationships
 * (calls, implements, extends, imports, references) stored in SQLite.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeGraphEngine = void 0;
class KnowledgeGraphEngine {
    db;
    constructor(db) {
        this.db = db;
    }
    async insertNode(node) {
        await this.db.saveNodes([node]);
    }
    async insertEdges(edges) {
        await this.db.saveEdges(edges);
    }
    async getCallers(symbolId) {
        const incoming = await this.db.getIncomingEdges(symbolId);
        const callers = [];
        for (const edge of incoming.filter((e) => e.relationship === 'calls')) {
            const nodes = await this.db.findSymbolsByName(edge.sourceId);
            if (nodes.length > 0)
                callers.push(nodes[0]);
        }
        return callers;
    }
    async getCallees(symbolId) {
        const outgoing = await this.db.getOutgoingEdges(symbolId);
        const callees = [];
        for (const edge of outgoing.filter((e) => e.relationship === 'calls')) {
            const nodes = await this.db.findSymbolsByName(edge.targetId);
            if (nodes.length > 0)
                callees.push(nodes[0]);
        }
        return callees;
    }
    async findReferences(symbolName) {
        return this.db.findSymbolsByName(symbolName);
    }
    async getCrossReferences(symbolName) {
        const symbols = await this.db.findSymbolsByName(symbolName);
        const target = symbols.find((s) => s.name === symbolName) || symbols[0];
        if (!target) {
            return {
                symbol: {
                    id: `stub_${symbolName}`,
                    fileId: 'unknown',
                    filePath: 'unknown',
                    name: symbolName,
                    kind: 'function',
                    startLine: 1,
                    endLine: 1,
                },
                definitions: [],
                references: [],
                callers: [],
                callees: [],
            };
        }
        const callers = await this.getCallers(target.id);
        const callees = await this.getCallees(target.id);
        return {
            symbol: target,
            definitions: [target],
            references: symbols.filter((s) => s.id !== target.id),
            callers,
            callees,
        };
    }
}
exports.KnowledgeGraphEngine = KnowledgeGraphEngine;
//# sourceMappingURL=knowledge-graph-engine.js.map