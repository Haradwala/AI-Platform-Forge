"use strict";
/**
 * entity-store.ts — Dedicated State Entity Store
 *
 * Maintains current state entities (file_list, workspace_stats, file_content, search_results)
 * with a bounded history stack (max 10 items per kind) for multi-turn conversational resolution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityStore = void 0;
class EntityStore {
    entities = new Map();
    entityHistory = new Map();
    set(kind, entity) {
        this.entities.set(kind, entity);
        let list = this.entityHistory.get(kind);
        if (!list) {
            list = [];
            this.entityHistory.set(kind, list);
        }
        list.push(entity);
        if (list.length > 10) {
            list.shift();
        }
    }
    getLatest(kind) {
        return this.entities.get(kind);
    }
    getHistory(kind) {
        return this.entityHistory.get(kind) || [];
    }
    getAll() {
        return Array.from(this.entities.values());
    }
    clear() {
        this.entities.clear();
        this.entityHistory.clear();
    }
}
exports.EntityStore = EntityStore;
//# sourceMappingURL=entity-store.js.map