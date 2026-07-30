/**
 * context-selector.ts
 *
 * Ranks, scores, and deduplicates raw context items according to relevance signals:
 *  - Semantic relevance (keyword overlap with user goal)
 *  - File proximity (same directory or import graph connection)
 *  - Imports & Symbols
 *  - Recency
 *  - Diagnostics priority
 *  - User focus (active file / selection)
 */
import type { RawContextItem } from './context-sources';
import type { RepositoryIndexer } from './repository-indexer';
export interface ScoredContextItem extends RawContextItem {
    score: number;
    rankReasons: string[];
}
export interface SelectionOptions {
    userGoal: string;
    activeFilePath?: string | null;
    indexer?: RepositoryIndexer;
}
export declare class ContextSelector {
    selectAndRank(items: RawContextItem[], options: SelectionOptions): ScoredContextItem[];
    private extractKeywords;
}
