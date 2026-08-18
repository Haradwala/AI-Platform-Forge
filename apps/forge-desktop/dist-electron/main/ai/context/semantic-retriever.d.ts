/**
 * semantic-retriever.ts
 *
 * Sprint 86 Phase 4 — Semantic Context Retrieval Engine
 *
 * Performs symbol-boundary chunking, 5-factor relevance scoring, token-budget-aware
 * candidate selection, and intelligent compression fallback.
 */
import type { WorkspaceSymbolIndexer, SymbolKind } from '../workspace/symbol-indexer';
import type { DependencyGraphEngine } from '../workspace/dependency-graph-engine';
export interface SemanticChunk {
    readonly id: string;
    readonly filePath: string;
    readonly content: string;
    readonly startLine: number;
    readonly endLine: number;
    readonly symbolName?: string;
    readonly symbolKind?: SymbolKind;
    readonly tokenEstimate: number;
}
export interface RetrievalCandidate {
    readonly chunk: SemanticChunk;
    readonly score: number;
    readonly scoring: {
        readonly textRelevance: number;
        readonly activeEditorBoost: number;
        readonly recentFileBoost: number;
        readonly dependencyNeighborBoost: number;
        readonly symbolImportanceBoost: number;
    };
}
export interface RetrievalRequest {
    readonly query: string;
    readonly activeFilePath?: string;
    readonly recentFilePaths?: readonly string[];
    readonly maxTokens: number;
    readonly maxChunks?: number;
}
export interface RetrievalResult {
    readonly candidates: readonly RetrievalCandidate[];
    readonly totalTokensUsed: number;
    readonly totalChunks: number;
    readonly truncated: boolean;
}
export declare class SemanticContextRetriever {
    private readonly indexer;
    private readonly graphEngine?;
    private readonly compressor;
    constructor(indexer: WorkspaceSymbolIndexer, graphEngine?: DependencyGraphEngine | undefined);
    /**
     * Split a source file into semantic chunks bounded by symbol definitions.
     */
    chunkFile(filePath: string, content: string): SemanticChunk[];
    /**
     * Scores a chunk based on query relevance, editor state, dependencies, and symbol importance.
     *
     * Formula:
     *   score = 0.40 * textRelevance + 0.25 * activeEditorBoost + 0.15 * recentFileBoost
     *         + 0.10 * dependencyNeighborBoost + 0.10 * symbolImportanceBoost
     */
    scoreChunk(chunk: SemanticChunk, request: RetrievalRequest): RetrievalCandidate;
    /**
     * Executes semantic retrieval across indexed workspace files within maxTokens budget.
     */
    retrieve(request: RetrievalRequest): Promise<RetrievalResult>;
}
