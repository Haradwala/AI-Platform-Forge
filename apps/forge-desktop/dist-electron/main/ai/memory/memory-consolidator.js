"use strict";
/**
 * memory-consolidator.ts
 *
 * Consolidates memory store:
 *  - Purges expired temporary items
 *  - Detects duplicate memory items and merges them
 *  - Re-indexes updated entries
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryConsolidator = void 0;
class MemoryConsolidator {
    store;
    indexer;
    constructor(store, indexer) {
        this.store = store;
        this.indexer = indexer;
    }
    consolidate() {
        // 1. Purge expired temporary items
        const purgedCount = this.store.purgeExpired();
        // 2. Duplicate detection and merging
        const items = this.store.getAllItems();
        const contentMap = new Map();
        for (const item of items) {
            const normalizedContent = item.content.trim().toLowerCase();
            if (!contentMap.has(normalizedContent)) {
                contentMap.set(normalizedContent, []);
            }
            contentMap.get(normalizedContent).push(item);
        }
        let mergedCount = 0;
        for (const group of contentMap.values()) {
            if (group.length > 1) {
                // Sort group by importance desc, then timestamp desc
                group.sort((a, b) => (b.importance ?? 5) - (a.importance ?? 5) || b.timestamp - a.timestamp);
                const primary = group[0];
                const combinedKeywords = new Set(primary.keywords || []);
                // Merge keywords and delete duplicates
                for (let i = 1; i < group.length; i++) {
                    const dup = group[i];
                    if (dup.keywords) {
                        for (const kw of dup.keywords)
                            combinedKeywords.add(kw);
                    }
                    this.store.deleteItem(dup.id);
                    this.indexer.removeItem(dup.id);
                    mergedCount++;
                }
                primary.keywords = Array.from(combinedKeywords);
                this.store.addItem(primary);
                this.indexer.indexItem(primary);
            }
        }
        return { mergedCount, purgedCount };
    }
}
exports.MemoryConsolidator = MemoryConsolidator;
//# sourceMappingURL=memory-consolidator.js.map