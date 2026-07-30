/**
 * memory-engine.ts
 *
 * Phase 7 — Memory Engine.
 *
 * Canonical memory management engine providing storage, hybrid retrieval,
 * relevance ranking, duplicate merging, TTL expiration, and snapshot capabilities.
 */

import type {
  IMemoryEngine,
  MemoryItem,
  MemoryQueryOptions,
  ScoredMemoryItem,
  MemorySnapshot,
  MemoryType,
} from './memory-types';
import { MemoryStore } from './memory-store';
import { MemoryIndexer } from './memory-indexer';
import { MemoryRetriever } from './memory-retriever';
import { MemoryConsolidator } from './memory-consolidator';

export class MemoryEngine implements IMemoryEngine {
  private readonly storeLayer: MemoryStore;
  private readonly indexer: MemoryIndexer;
  private readonly retriever: MemoryRetriever;
  private readonly consolidator: MemoryConsolidator;

  constructor(
    storeLayer?: MemoryStore,
    indexer?: MemoryIndexer,
    retriever?: MemoryRetriever,
    consolidator?: MemoryConsolidator
  ) {
    this.storeLayer = storeLayer || new MemoryStore();
    this.indexer = indexer || new MemoryIndexer();
    this.retriever = retriever || new MemoryRetriever(this.storeLayer, this.indexer);
    this.consolidator = consolidator || new MemoryConsolidator(this.storeLayer, this.indexer);
  }

  store(itemInput: Partial<MemoryItem> & { type: MemoryType; content: string }): MemoryItem {
    const id = itemInput.id || `mem_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const timestamp = itemInput.timestamp || Date.now();

    const fullItem: MemoryItem = {
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

  async retrieve(options: MemoryQueryOptions = {}): Promise<ScoredMemoryItem[]> {
    if (options.signal?.aborted) {
      throw new Error('Memory retrieval cancelled by AbortSignal.');
    }
    return this.retriever.retrieve(options);
  }

  async consolidate(): Promise<{ mergedCount: number; purgedCount: number }> {
    return this.consolidator.consolidate();
  }

  getSnapshot(): MemorySnapshot {
    const items = this.storeLayer.getAllItems();
    const itemsByType: Record<MemoryType, number> = {
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

  deleteItem(id: string): void {
    this.storeLayer.deleteItem(id);
    this.indexer.removeItem(id);
  }

  clear(): void {
    this.storeLayer.clear();
    this.indexer.clear();
  }
}
