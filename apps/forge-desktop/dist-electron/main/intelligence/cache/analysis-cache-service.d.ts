/**
 * analysis-cache-service.ts — Invalidation Cache for Heavy Repository Intelligence Operations
 *
 * Caches expensive graph analysis operations (impact analysis, dead code detection)
 * and invalidates entries when target files change.
 */
export declare class AnalysisCacheService {
    private cache;
    get<T>(cacheKey: string): T | null;
    set<T>(cacheKey: string, value: T, affectedFiles?: string[]): void;
    invalidateFiles(changedFiles: string[]): void;
    clear(): void;
}
