/**
 * knowledge-graph-engine.ts — Knowledge Graph Query & Traversal Engine
 *
 * Traverses code entities (Functions, Classes, Interfaces, APIs, Imports) and relationships
 * (calls, implements, extends, imports, references) stored in SQLite.
 */

import { IntelligenceDatabase } from '../storage/intelligence-database';
import { KnowledgeNode, KnowledgeEdge, CrossReferenceResult } from '../contracts/intelligence-types';

export class KnowledgeGraphEngine {
  constructor(private readonly db: IntelligenceDatabase) {}

  async insertNode(node: KnowledgeNode): Promise<void> {
    await this.db.saveNodes([node]);
  }

  async insertEdges(edges: KnowledgeEdge[]): Promise<void> {
    await this.db.saveEdges(edges);
  }

  async getCallers(symbolId: string): Promise<KnowledgeNode[]> {
    const incoming = await this.db.getIncomingEdges(symbolId);
    const callers: KnowledgeNode[] = [];
    for (const edge of incoming.filter((e) => e.relationship === 'calls')) {
      const nodes = await this.db.findSymbolsByName(edge.sourceId);
      if (nodes.length > 0) callers.push(nodes[0]);
    }
    return callers;
  }

  async getCallees(symbolId: string): Promise<KnowledgeNode[]> {
    const outgoing = await this.db.getOutgoingEdges(symbolId);
    const callees: KnowledgeNode[] = [];
    for (const edge of outgoing.filter((e) => e.relationship === 'calls')) {
      const nodes = await this.db.findSymbolsByName(edge.targetId);
      if (nodes.length > 0) callees.push(nodes[0]);
    }
    return callees;
  }

  async findReferences(symbolName: string): Promise<KnowledgeNode[]> {
    return this.db.findSymbolsByName(symbolName);
  }

  async getCrossReferences(symbolName: string): Promise<CrossReferenceResult> {
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
