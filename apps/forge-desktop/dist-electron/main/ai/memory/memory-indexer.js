"use strict";
/**
 * memory-indexer.ts
 *
 * In-memory keyword and n-gram indexer for fast memory retrieval.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryIndexer = void 0;
class MemoryIndexer {
    index = new Map();
    clear() {
        this.index.clear();
    }
    indexItem(item) {
        this.removeItem(item.id);
        const tokens = this.extractTokens(item.content);
        if (item.keywords) {
            for (const kw of item.keywords) {
                tokens.add(kw.toLowerCase());
            }
        }
        for (const token of tokens) {
            if (!this.index.has(token)) {
                this.index.set(token, new Set());
            }
            this.index.get(token).add(item.id);
        }
    }
    removeItem(itemId) {
        for (const set of this.index.values()) {
            set.delete(itemId);
        }
    }
    lookup(query) {
        const hits = new Map();
        const queryTokens = this.extractTokens(query);
        for (const qToken of queryTokens) {
            for (const [token, itemIds] of this.index.entries()) {
                if (token.includes(qToken) || qToken.includes(token)) {
                    for (const id of itemIds) {
                        hits.set(id, (hits.get(id) || 0) + 1);
                    }
                }
            }
        }
        return hits;
    }
    extractTokens(text) {
        const tokens = new Set();
        if (!text)
            return tokens;
        const words = text
            .toLowerCase()
            .replace(/[^a-z0-9_\-\.\/]/g, ' ')
            .split(/\s+/)
            .filter((w) => w.length > 2);
        for (const w of words)
            tokens.add(w);
        return tokens;
    }
}
exports.MemoryIndexer = MemoryIndexer;
//# sourceMappingURL=memory-indexer.js.map