/**
 * memory-retriever.ts
 *
 * Hybrid keyword + semantic retriever and relevance scorer for memory items.
 */

import type { MemoryItem, MemoryQueryOptions, ScoredMemoryItem, MemoryType } from './memory-types';
import type { MemoryStore } from './memory-store';
import type { MemoryIndexer } from './memory-indexer';

const TYPE_WEIGHTS: Record<MemoryType, number> = {
  user: 1.5,
  project: 1.3,
  semantic: 1.2,
  workspace: 1.1,
  conversation: 1.0,
  temporary: 0.9,
};

export class MemoryRetriever {
  constructor(
    private readonly store: MemoryStore,
    private readonly indexer: MemoryIndexer
  ) {}

  retrieve(options: MemoryQueryOptions = {}): ScoredMemoryItem[] {
    const allItems = this.store.getAllItems();
    const queryHits = options.query ? this.indexer.lookup(options.query) : null;

    const scored: ScoredMemoryItem[] = [];

    for (const item of allItems) {
      // Filter by type
      if (options.types && options.types.length > 0 && !options.types.includes(item.type)) {
        continue;
      }

      // Filter by minImportance
      const importance = item.importance ?? 5;
      if (options.minImportance !== undefined && importance < options.minImportance) {
        continue;
      }

      let score = 0;
      const matchReasons: string[] = [];

      // Base importance score
      score += importance * 10;
      matchReasons.push(`Base importance ${importance}`);

      // Type weight multiplier
      const typeWeight = TYPE_WEIGHTS[item.type] || 1.0;
      score *= typeWeight;
      matchReasons.push(`Memory type weight [${item.type}] x${typeWeight}`);

      // Query hit bonus
      if (queryHits && queryHits.has(item.id)) {
        const hitCount = queryHits.get(item.id)!;
        const hitScore = hitCount * 25;
        score += hitScore;
        matchReasons.push(`Keyword match count ${hitCount} (+${hitScore})`);
      } else if (options.query) {
        // Semantic substring fallback
        if (item.content.toLowerCase().includes(options.query.toLowerCase())) {
          score += 20;
          matchReasons.push('Substring match (+20)');
        }
      }

      // Recency decay boost (decay over 24 hours)
      const ageHours = Math.max(0, (Date.now() - item.timestamp) / (1000 * 60 * 60));
      const recencyBoost = Math.max(0, 15 - ageHours);
      if (recencyBoost > 0) {
        score += recencyBoost;
        matchReasons.push(`Recency boost (+${recencyBoost.toFixed(1)})`);
      }

      scored.push({
        ...item,
        score: Math.round(score * 100) / 100,
        matchReasons,
      });
    }

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    if (options.limit && options.limit > 0) {
      return scored.slice(0, options.limit);
    }
    return scored;
  }
}
