/**
 * memory-store.ts
 *
 * In-memory storage layer for MemoryItems with TTL expiration handling for temporary items.
 */
import type { MemoryItem, MemoryType } from './memory-types';
export declare class MemoryStore {
    private readonly items;
    addItem(item: MemoryItem): void;
    getItem(id: string): MemoryItem | null;
    deleteItem(id: string): boolean;
    clear(): void;
    getAllItems(): MemoryItem[];
    getByType(type: MemoryType): MemoryItem[];
    /** Purges expired temporary memory items and returns total purged count. */
    purgeExpired(): number;
    private isExpired;
}
