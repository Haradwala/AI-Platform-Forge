/**
 * memory-indexer.ts
 *
 * In-memory keyword and n-gram indexer for fast memory retrieval.
 */

import type { MemoryItem } from './memory-types';

export class MemoryIndexer {
  private readonly index = new Map<string, Set<string>>();

  clear(): void {
    this.index.clear();
  }

  indexItem(item: MemoryItem): void {
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
      this.index.get(token)!.add(item.id);
    }
  }

  removeItem(itemId: string): void {
    for (const set of this.index.values()) {
      set.delete(itemId);
    }
  }

  lookup(query: string): Map<string, number> {
    const hits = new Map<string, number>();
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

  private extractTokens(text: string): Set<string> {
    const tokens = new Set<string>();
    if (!text) return tokens;

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9_\-\.\/]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2);

    for (const w of words) tokens.add(w);
    return tokens;
  }
}
