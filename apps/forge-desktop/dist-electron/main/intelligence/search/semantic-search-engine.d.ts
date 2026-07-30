/**
 * semantic-search-engine.ts — Hybrid Text & Vector Semantic Search Engine
 *
 * Provides hybrid FTS5 text search, exact symbol matching, and vector embedding discovery.
 */
import { IntelligenceDatabase } from '../storage/intelligence-database';
import { KnowledgeGraphEngine } from '../graph/knowledge-graph-engine';
import { IEmbeddingProvider } from './embedding-provider';
import { SymbolSearchResult, CodeSearchResult, CrossReferenceResult } from '../contracts/intelligence-types';
export declare class SemanticSearchEngine {
    private readonly db;
    private readonly graphEngine;
    private readonly embeddingProvider;
    constructor(db: IntelligenceDatabase, graphEngine: KnowledgeGraphEngine, embeddingProvider?: IEmbeddingProvider);
    searchSymbols(query: string, limit?: number): Promise<SymbolSearchResult[]>;
    searchCodeNaturalLanguage(query: string, limit?: number): Promise<CodeSearchResult[]>;
    findRelatedCode(symbolId: string, limit?: number): Promise<CodeSearchResult[]>;
    crossReferenceLookup(identifier: string): Promise<CrossReferenceResult>;
}
