/**
 * memory-indexer.ts
 *
 * In-memory keyword and n-gram indexer for fast memory retrieval.
 */
import type { MemoryItem } from './memory-types';
export declare class MemoryIndexer {
    private readonly index;
    clear(): void;
    indexItem(item: MemoryItem): void;
    removeItem(itemId: string): void;
    lookup(query: string): Map<string, number>;
    private extractTokens;
}
