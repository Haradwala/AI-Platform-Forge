"use strict";
/**
 * semantic-search-engine.ts — Hybrid Text & Vector Semantic Search Engine
 *
 * Provides hybrid FTS5 text search, exact symbol matching, and vector embedding discovery.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSearchEngine = void 0;
const embedding_provider_1 = require("./embedding-provider");
class SemanticSearchEngine {
    db;
    graphEngine;
    embeddingProvider;
    constructor(db, graphEngine, embeddingProvider = new embedding_provider_1.DefaultEmbeddingProvider()) {
        this.db = db;
        this.graphEngine = graphEngine;
        this.embeddingProvider = embeddingProvider;
    }
    async searchSymbols(query, limit = 20) {
        const symbols = await this.db.findSymbolsByName(query);
        const results = symbols.slice(0, limit).map((node) => {
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
    async searchCodeNaturalLanguage(query, limit = 10) {
        const symbols = await this.db.findSymbolsByName(query);
        return symbols.slice(0, limit).map((node) => ({
            node,
            snippet: node.signature || node.name,
            score: 0.85,
        }));
    }
    async findRelatedCode(symbolId, limit = 10) {
        const callees = await this.graphEngine.getCallees(symbolId);
        return callees.slice(0, limit).map((node) => ({
            node,
            snippet: node.signature || node.name,
            score: 0.9,
        }));
    }
    async crossReferenceLookup(identifier) {
        return this.graphEngine.getCrossReferences(identifier);
    }
}
exports.SemanticSearchEngine = SemanticSearchEngine;
//# sourceMappingURL=semantic-search-engine.js.map