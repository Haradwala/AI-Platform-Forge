"use strict";
/**
 * incremental-indexer.ts — Phase 25-28 Incremental Workspace Indexer
 *
 * Listens to file changes to update intelligence caches incrementally.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementalIndexer = void 0;
class IncrementalIndexer {
    dirtyFiles = new Set();
    isIndexing = false;
    notifyFileChanged(filePath) {
        this.dirtyFiles.add(filePath);
    }
    notifyFileDeleted(filePath) {
        this.dirtyFiles.add(filePath);
    }
    async processDirtyQueue(onUpdate) {
        if (this.isIndexing || this.dirtyFiles.size === 0)
            return;
        this.isIndexing = true;
        const batch = Array.from(this.dirtyFiles);
        this.dirtyFiles.clear();
        try {
            await onUpdate(batch);
        }
        catch (err) {
            console.error('[IncrementalIndexer] Error processing incremental batch:', err);
        }
        finally {
            this.isIndexing = false;
        }
    }
}
exports.IncrementalIndexer = IncrementalIndexer;
//# sourceMappingURL=incremental-indexer.js.map