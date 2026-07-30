/**
 * runtime-cache.ts — Phase 23 Runtime Discovery Cache
 */
export interface CacheEntry<T> {
    data: T;
    timestamp: number;
}
export declare class RuntimeCache<T = unknown> {
    private cache;
    private defaultTtlMs;
    constructor(defaultTtlMs?: number);
    set(key: string, data: T): void;
    get(key: string, ttlMs?: number): T | null;
    hasValid(key: string, ttlMs?: number): boolean;
    invalidate(key?: string): void;
    clear(): void;
}
