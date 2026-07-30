/**
 * analysis-cache-service.ts — Invalidation Cache for Heavy Repository Intelligence Operations
 *
 * Caches expensive graph analysis operations (impact analysis, dead code detection)
 * and invalidates entries when target files change.
 */

export class AnalysisCacheService {
  private cache = new Map<string, { value: any; affectedFiles: Set<string> }>();

  get<T>(cacheKey: string): T | null {
    const entry = this.cache.get(cacheKey);
    return entry ? (entry.value as T) : null;
  }

  set<T>(cacheKey: string, value: T, affectedFiles: string[] = []): void {
    this.cache.set(cacheKey, {
      value,
      affectedFiles: new Set(affectedFiles),
    });
  }

  invalidateFiles(changedFiles: string[]): void {
    const changedSet = new Set(changedFiles);
    for (const [key, entry] of this.cache.entries()) {
      for (const file of entry.affectedFiles) {
        if (changedSet.has(file)) {
          this.cache.delete(key);
          break;
        }
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
