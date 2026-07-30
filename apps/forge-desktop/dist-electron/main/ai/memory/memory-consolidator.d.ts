/**
 * memory-consolidator.ts
 *
 * Consolidates memory store:
 *  - Purges expired temporary items
 *  - Detects duplicate memory items and merges them
 *  - Re-indexes updated entries
 */
import type { MemoryStore } from './memory-store';
import type { MemoryIndexer } from './memory-indexer';
export declare class MemoryConsolidator {
    private readonly store;
    private readonly indexer;
    constructor(store: MemoryStore, indexer: MemoryIndexer);
    consolidate(): {
        mergedCount: number;
        purgedCount: number;
    };
}
