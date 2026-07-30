"use strict";
/**
 * memory-store.ts
 *
 * In-memory storage layer for MemoryItems with TTL expiration handling for temporary items.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
class MemoryStore {
    items = new Map();
    addItem(item) {
        this.items.set(item.id, item);
    }
    getItem(id) {
        const item = this.items.get(id);
        if (!item)
            return null;
        if (this.isExpired(item)) {
            this.items.delete(id);
            return null;
        }
        return item;
    }
    deleteItem(id) {
        return this.items.delete(id);
    }
    clear() {
        this.items.clear();
    }
    getAllItems() {
        this.purgeExpired();
        return Array.from(this.items.values());
    }
    getByType(type) {
        return this.getAllItems().filter((item) => item.type === type);
    }
    /** Purges expired temporary memory items and returns total purged count. */
    purgeExpired() {
        let purged = 0;
        const now = Date.now();
        for (const [id, item] of this.items.entries()) {
            if (this.isExpired(item, now)) {
                this.items.delete(id);
                purged++;
            }
        }
        return purged;
    }
    isExpired(item, now = Date.now()) {
        if (item.type === 'temporary' && item.ttlMs && item.ttlMs > 0) {
            return now - item.timestamp >= item.ttlMs;
        }
        return false;
    }
}
exports.MemoryStore = MemoryStore;
//# sourceMappingURL=memory-store.js.map