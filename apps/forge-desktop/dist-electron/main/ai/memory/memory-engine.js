"use strict";
/**
 * memory-engine.ts
 *
 * Phase 7 — Memory Engine.
 *
 * Canonical memory management engine providing storage, hybrid retrieval,
 * relevance ranking, duplicate merging, TTL expiration, and snapshot capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryEngine = void 0;
const memory_store_1 = require("./memory-store");
const memory_indexer_1 = require("./memory-indexer");
const memory_retriever_1 = require("./memory-retriever");
const memory_consolidator_1 = require("./memory-consolidator");
class MemoryEngine {
    storeLayer;
    indexer;
    retriever;
    consolidator;
    constructor(storeLayer, indexer, retriever, consolidator) {
        this.storeLayer = storeLayer || new memory_store_1.MemoryStore();
        this.indexer = indexer || new memory_indexer_1.MemoryIndexer();
        this.retriever = retriever || new memory_retriever_1.MemoryRetriever(this.storeLayer, this.indexer);
        this.consolidator = consolidator || new memory_consolidator_1.MemoryConsolidator(this.storeLayer, this.indexer);
    }
    store(itemInput) {
        const id = itemInput.id || `mem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const timestamp = itemInput.timestamp || Date.now();
        const fullItem = {
            id,
            type: itemInput.type,
            content: itemInput.content,
            keywords: itemInput.keywords || [],
            importance: itemInput.importance ?? 5,
            timestamp,
            ttlMs: itemInput.ttlMs,
            metadata: itemInput.metadata || {},
        };
        this.storeLayer.addItem(fullItem);
        this.indexer.indexItem(fullItem);
        return fullItem;
    }
    async retrieve(options = {}) {
        if (options.signal?.aborted) {
            throw new Error('Memory retrieval cancelled by AbortSignal.');
        }
        return this.retriever.retrieve(options);
    }
    async consolidate() {
        return this.consolidator.consolidate();
    }
    getSnapshot() {
        const items = this.storeLayer.getAllItems();
        const itemsByType = {
            conversation: 0,
            workspace: 0,
            semantic: 0,
            project: 0,
            user: 0,
            temporary: 0,
        };
        for (const item of items) {
            itemsByType[item.type] = (itemsByType[item.type] || 0) + 1;
        }
        return {
            timestamp: new Date().toISOString(),
            totalItems: items.length,
            itemsByType,
            items,
        };
    }
    deleteItem(id) {
        this.storeLayer.deleteItem(id);
        this.indexer.removeItem(id);
    }
    clear() {
        this.storeLayer.clear();
        this.indexer.clear();
    }
}
exports.MemoryEngine = MemoryEngine;
//# sourceMappingURL=memory-engine.js.map