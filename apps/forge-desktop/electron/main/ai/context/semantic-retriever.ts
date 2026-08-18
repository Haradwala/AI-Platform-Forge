/**
 * semantic-retriever.ts
 *
 * Sprint 86 Phase 4 — Semantic Context Retrieval Engine
 *
 * Performs symbol-boundary chunking, 5-factor relevance scoring, token-budget-aware
 * candidate selection, and intelligent compression fallback.
 */

import * as fs from 'fs';
import type { WorkspaceSymbolIndexer, SymbolKind } from '../workspace/symbol-indexer';
import type { DependencyGraphEngine } from '../workspace/dependency-graph-engine';
import { ContextCompressor } from './context-compressor';

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

export class SemanticContextRetriever {
  private readonly compressor = new ContextCompressor();

  constructor(
    private readonly indexer: WorkspaceSymbolIndexer,
    private readonly graphEngine?: DependencyGraphEngine
  ) {}

  /**
   * Split a source file into semantic chunks bounded by symbol definitions.
   */
  chunkFile(filePath: string, content: string): SemanticChunk[] {
    if (!content || !content.trim()) return [];

    const chunks: SemanticChunk[] = [];
    const fileCache = (this.indexer as any).fileCache as Map<string, any>;
    const cachedFile = fileCache?.get(filePath);
    const symbols = cachedFile?.symbols || [];

    const sortedSymbols = [...symbols]
      .filter((s) => s.kind !== 'import')
      .sort((a, b) => a.line - b.line);

    const lines = content.split(/\r?\n/);

    // Chunk 1: Imports & Header Block (lines 1..firstSymbolLine-1)
    if (sortedSymbols.length > 0 && sortedSymbols[0].line > 1) {
      const importEnd = sortedSymbols[0].line - 1;
      const importLines = lines.slice(0, importEnd);
      const importContent = importLines.join('\n');

      if (importContent.trim()) {
        chunks.push({
          id: `${filePath}#imports`,
          filePath,
          content: importContent,
          startLine: 1,
          endLine: importEnd,
          tokenEstimate: Math.ceil(importContent.length / 4),
        });
      }
    }

    // Symbol Chunks
    if (sortedSymbols.length > 0) {
      for (let i = 0; i < sortedSymbols.length; i++) {
        const sym = sortedSymbols[i];
        const startLine = sym.line;
        const endLine = i + 1 < sortedSymbols.length ? sortedSymbols[i + 1].line - 1 : lines.length;

        const chunkContent = lines.slice(startLine - 1, endLine).join('\n');
        if (!chunkContent.trim()) continue;

        chunks.push({
          id: `${filePath}#${sym.name}`,
          filePath,
          content: chunkContent,
          startLine,
          endLine,
          symbolName: sym.name,
          symbolKind: sym.kind,
          tokenEstimate: Math.ceil(chunkContent.length / 4),
        });
      }
    } else {
      // Fallback: file has no symbols, single chunk
      chunks.push({
        id: `${filePath}#full`,
        filePath,
        content,
        startLine: 1,
        endLine: lines.length,
        tokenEstimate: Math.ceil(content.length / 4),
      });
    }

    return chunks;
  }

  /**
   * Scores a chunk based on query relevance, editor state, dependencies, and symbol importance.
   *
   * Formula:
   *   score = 0.40 * textRelevance + 0.25 * activeEditorBoost + 0.15 * recentFileBoost
   *         + 0.10 * dependencyNeighborBoost + 0.10 * symbolImportanceBoost
   */
  scoreChunk(chunk: SemanticChunk, request: RetrievalRequest): RetrievalCandidate {
    const queryLower = (request.query || '').toLowerCase();
    const queryTerms = queryLower.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || [];

    // 1. Text Relevance (Jaccard + Symbol Name match)
    let textRelevance = 0;
    if (chunk.symbolName && queryLower.includes(chunk.symbolName.toLowerCase())) {
      textRelevance += 0.6;
    }
    const chunkLower = chunk.content.toLowerCase();
    let termMatches = 0;
    for (const term of queryTerms) {
      if (term.length > 2 && chunkLower.includes(term)) {
        termMatches++;
      }
    }
    if (queryTerms.length > 0) {
      textRelevance += Math.min(0.4, (termMatches / queryTerms.length) * 0.4);
    }
    textRelevance = Math.min(1.0, textRelevance);

    // 2. Active Editor Boost
    const activeEditorBoost =
      request.activeFilePath && chunk.filePath === request.activeFilePath ? 1.0 : 0.0;

    // 3. Recent File Boost
    let recentFileBoost = 0.0;
    if (request.recentFilePaths && request.recentFilePaths.length > 0) {
      const idx = request.recentFilePaths.indexOf(chunk.filePath);
      if (idx !== -1) {
        recentFileBoost = 1.0 / (1 + idx);
      }
    }

    // 4. Dependency Neighbor Boost
    let dependencyNeighborBoost = 0.0;
    if (this.graphEngine && request.activeFilePath) {
      const deps = this.graphEngine.getFileDependencies(request.activeFilePath);
      const revs = this.graphEngine.getFileDependents(request.activeFilePath);
      if (deps.includes(chunk.filePath) || revs.includes(chunk.filePath)) {
        dependencyNeighborBoost = 1.0;
      }
    }

    // 5. Symbol Importance Boost
    let symbolImportanceBoost = 0.2;
    if (chunk.symbolKind === 'class' || chunk.symbolKind === 'interface') {
      symbolImportanceBoost = 1.0;
    } else if (chunk.symbolKind === 'function') {
      symbolImportanceBoost = 0.8;
    } else if (chunk.symbolKind === 'type' || chunk.symbolKind === 'enum') {
      symbolImportanceBoost = 0.6;
    } else if (chunk.symbolKind === 'const') {
      symbolImportanceBoost = 0.4;
    }

    const score =
      0.4 * textRelevance +
      0.25 * activeEditorBoost +
      0.15 * recentFileBoost +
      0.1 * dependencyNeighborBoost +
      0.1 * symbolImportanceBoost;

    return {
      chunk,
      score,
      scoring: {
        textRelevance,
        activeEditorBoost,
        recentFileBoost,
        dependencyNeighborBoost,
        symbolImportanceBoost,
      },
    };
  }

  /**
   * Executes semantic retrieval across indexed workspace files within maxTokens budget.
   */
  async retrieve(request: RetrievalRequest): Promise<RetrievalResult> {
    const fileCache = (this.indexer as any).fileCache as Map<string, any>;
    const allChunks: SemanticChunk[] = [];

    if (fileCache) {
      for (const filePath of fileCache.keys()) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const fileChunks = this.chunkFile(filePath, content);
          allChunks.push(...fileChunks);
        } catch {
          // Skip unreadable files
        }
      }
    }

    // Score candidates
    const candidates = allChunks.map((c) => this.scoreChunk(c, request));

    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    // Select candidates within budget
    const accepted: RetrievalCandidate[] = [];
    let tokensUsed = 0;
    let truncated = false;
    const maxTokens = request.maxTokens || 4096;

    for (const cand of candidates) {
      let chunkContent = cand.chunk.content;
      let chunkTokens = Math.ceil(chunkContent.length / 4);

      if (tokensUsed + chunkTokens <= maxTokens) {
        accepted.push(cand);
        tokensUsed += chunkTokens;
      } else {
        // Try compressing
        const compressed = this.compressor.compressFileContent(
          chunkContent,
          request.query,
          cand.chunk.filePath
        );
        if (compressed && compressed.length < chunkContent.length) {
          chunkContent = compressed;
          chunkTokens = Math.ceil(chunkContent.length / 4);
        }

        if (tokensUsed + chunkTokens <= maxTokens) {
          accepted.push({
            ...cand,
            chunk: {
              ...cand.chunk,
              content: chunkContent,
              tokenEstimate: chunkTokens,
            },
          });
          tokensUsed += chunkTokens;
        } else {
          truncated = true;
          break;
        }
      }

      if (request.maxChunks && accepted.length >= request.maxChunks) {
        break;
      }
    }

    return {
      candidates: accepted,
      totalTokensUsed: tokensUsed,
      totalChunks: accepted.length,
      truncated,
    };
  }
}
