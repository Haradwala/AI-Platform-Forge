/**
 * runtime-cache.ts — Phase 23 Runtime Discovery Cache
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class RuntimeCache<T = unknown> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 300000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string, ttlMs?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const maxAge = ttlMs ?? this.defaultTtlMs;
    if (Date.now() - entry.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  hasValid(key: string, ttlMs?: number): boolean {
    return this.get(key, ttlMs) !== null;
  }

  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  clear(): void {
    this.cache.clear();
  }
}
