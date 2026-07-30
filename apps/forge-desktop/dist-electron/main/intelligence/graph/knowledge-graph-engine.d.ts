/**
 * knowledge-graph-engine.ts — Knowledge Graph Query & Traversal Engine
 *
 * Traverses code entities (Functions, Classes, Interfaces, APIs, Imports) and relationships
 * (calls, implements, extends, imports, references) stored in SQLite.
 */
import { IntelligenceDatabase } from '../storage/intelligence-database';
import { KnowledgeNode, KnowledgeEdge, CrossReferenceResult } from '../contracts/intelligence-types';
export declare class KnowledgeGraphEngine {
    private readonly db;
    constructor(db: IntelligenceDatabase);
    insertNode(node: KnowledgeNode): Promise<void>;
    insertEdges(edges: KnowledgeEdge[]): Promise<void>;
    getCallers(symbolId: string): Promise<KnowledgeNode[]>;
    getCallees(symbolId: string): Promise<KnowledgeNode[]>;
    findReferences(symbolName: string): Promise<KnowledgeNode[]>;
    getCrossReferences(symbolName: string): Promise<CrossReferenceResult>;
}
