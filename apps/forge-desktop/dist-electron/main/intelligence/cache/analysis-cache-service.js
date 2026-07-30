"use strict";
/**
 * analysis-cache-service.ts — Invalidation Cache for Heavy Repository Intelligence Operations
 *
 * Caches expensive graph analysis operations (impact analysis, dead code detection)
 * and invalidates entries when target files change.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisCacheService = void 0;
class AnalysisCacheService {
    cache = new Map();
    get(cacheKey) {
        const entry = this.cache.get(cacheKey);
        return entry ? entry.value : null;
    }
    set(cacheKey, value, affectedFiles = []) {
        this.cache.set(cacheKey, {
            value,
            affectedFiles: new Set(affectedFiles),
        });
    }
    invalidateFiles(changedFiles) {
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
    clear() {
        this.cache.clear();
    }
}
exports.AnalysisCacheService = AnalysisCacheService;
//# sourceMappingURL=analysis-cache-service.js.map