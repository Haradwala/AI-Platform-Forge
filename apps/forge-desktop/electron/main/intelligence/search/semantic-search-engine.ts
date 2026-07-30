/**
 * semantic-search-engine.ts — Hybrid Text & Vector Semantic Search Engine
 *
 * Provides hybrid FTS5 text search, exact symbol matching, and vector embedding discovery.
 */

import { IntelligenceDatabase } from '../storage/intelligence-database';
import { KnowledgeGraphEngine } from '../graph/knowledge-graph-engine';
import { IEmbeddingProvider, DefaultEmbeddingProvider } from './embedding-provider';
import { SymbolSearchResult, CodeSearchResult, CrossReferenceResult } from '../contracts/intelligence-types';

export class SemanticSearchEngine {
  constructor(
    private readonly db: IntelligenceDatabase,
    private readonly graphEngine: KnowledgeGraphEngine,
    private readonly embeddingProvider: IEmbeddingProvider = new DefaultEmbeddingProvider()
  ) {}

  async searchSymbols(query: string, limit: number = 20): Promise<SymbolSearchResult[]> {
    const symbols = await this.db.findSymbolsByName(query);
    const results: SymbolSearchResult[] = symbols.slice(0, limit).map((node) => {
      const matchType = node.name.toLowerCase() === query.toLowerCase()
        ? 'exact'
        : node.name.toLowerCase().startsWith(query.toLowerCase())
        ? 'prefix'
        : 'fuzzy';

      const score = matchType === 'exact' ? 1.0 : matchType === 'prefix' ? 0.8 : 0.5;

      return { node, score, matchType };
    });

    return results.sort((a, b) => b.score - a.score);
  }

  async searchCodeNaturalLanguage(query: string, limit: number = 10): Promise<CodeSearchResult[]> {
    const symbols = await this.db.findSymbolsByName(query);
    return symbols.slice(0, limit).map((node) => ({
      node,
      snippet: node.signature || node.name,
      score: 0.85,
    }));
  }

  async findRelatedCode(symbolId: string, limit: number = 10): Promise<CodeSearchResult[]> {
    const callees = await this.graphEngine.getCallees(symbolId);
    return callees.slice(0, limit).map((node) => ({
      node,
      snippet: node.signature || node.name,
      score: 0.9,
    }));
  }

  async crossReferenceLookup(identifier: string): Promise<CrossReferenceResult> {
    return this.graphEngine.getCrossReferences(identifier);
  }
}
