"use strict";
/**
 * runtime-cache.ts — Phase 23 Runtime Discovery Cache
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeCache = void 0;
class RuntimeCache {
    cache = new Map();
    defaultTtlMs;
    constructor(defaultTtlMs = 300000) {
        this.defaultTtlMs = defaultTtlMs;
    }
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    get(key, ttlMs) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        const maxAge = ttlMs ?? this.defaultTtlMs;
        if (Date.now() - entry.timestamp > maxAge) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    hasValid(key, ttlMs) {
        return this.get(key, ttlMs) !== null;
    }
    invalidate(key) {
        if (key) {
            this.cache.delete(key);
        }
        else {
            this.cache.clear();
        }
    }
    clear() {
        this.cache.clear();
    }
}
exports.RuntimeCache = RuntimeCache;
//# sourceMappingURL=runtime-cache.js.map