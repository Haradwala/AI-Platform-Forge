/**
 * memory-retriever.ts
 *
 * Hybrid keyword + semantic retriever and relevance scorer for memory items.
 */
import type { MemoryQueryOptions, ScoredMemoryItem } from './memory-types';
import type { MemoryStore } from './memory-store';
import type { MemoryIndexer } from './memory-indexer';
export declare class MemoryRetriever {
    private readonly store;
    private readonly indexer;
    constructor(store: MemoryStore, indexer: MemoryIndexer);
    retrieve(options?: MemoryQueryOptions): ScoredMemoryItem[];
}
