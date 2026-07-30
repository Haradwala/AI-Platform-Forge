/**
 * memory-engine.ts
 *
 * Phase 7 — Memory Engine.
 *
 * Canonical memory management engine providing storage, hybrid retrieval,
 * relevance ranking, duplicate merging, TTL expiration, and snapshot capabilities.
 */
import type { IMemoryEngine, MemoryItem, MemoryQueryOptions, ScoredMemoryItem, MemorySnapshot, MemoryType } from './memory-types';
import { MemoryStore } from './memory-store';
import { MemoryIndexer } from './memory-indexer';
import { MemoryRetriever } from './memory-retriever';
import { MemoryConsolidator } from './memory-consolidator';
export declare class MemoryEngine implements IMemoryEngine {
    private readonly storeLayer;
    private readonly indexer;
    private readonly retriever;
    private readonly consolidator;
    constructor(storeLayer?: MemoryStore, indexer?: MemoryIndexer, retriever?: MemoryRetriever, consolidator?: MemoryConsolidator);
    store(itemInput: Partial<MemoryItem> & {
        type: MemoryType;
        content: string;
    }): MemoryItem;
    retrieve(options?: MemoryQueryOptions): Promise<ScoredMemoryItem[]>;
    consolidate(): Promise<{
        mergedCount: number;
        purgedCount: number;
    }>;
    getSnapshot(): MemorySnapshot;
    deleteItem(id: string): void;
    clear(): void;
}
