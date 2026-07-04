import { describe, it, expect } from 'vitest';
import { Deduplicator } from '../src/dedup/deduplicator';
import { IRetrievalCandidate } from '@forge/shared';

describe('Deduplicator grouping & confidence probability', () => {
  it('should combine duplicates and aggregate provider confidence', () => {
    const deduplicator = new Deduplicator();
    const timestamp = new Date();

    const c1: IRetrievalCandidate = {
      id: 'workspace:test.ts',
      workspaceId: 'w-1',
      sources: [{ providerId: 'WorkspaceRetriever', confidence: 0.9, rawScore: 1.0 }],
      content: 'content',
      path: 'test.ts',
      metadata: { workspaceId: 'w-1', timestamp },
      normalizedScore: 0,
      graphDistance: -1,
      keywordScore: 0,
      vectorScore: 0,
      freshnessScore: 0.8,
      trace: { items: [], timestamp }
    };

    const c2: IRetrievalCandidate = {
      id: 'keyword:test.ts',
      workspaceId: 'w-1',
      sources: [{ providerId: 'KeywordRetriever', confidence: 0.8, rawScore: 5.0 }],
      content: 'content',
      path: 'test.ts',
      metadata: { workspaceId: 'w-1', timestamp },
      normalizedScore: 0,
      graphDistance: -1,
      keywordScore: 5.0,
      vectorScore: 0,
      freshnessScore: 0.5,
      trace: { items: [], timestamp }
    };

    const deduplicated = deduplicator.deduplicate([c1, c2]);

    expect(deduplicated.length).toBe(1);
    expect(deduplicated[0].sources.length).toBe(2);
    expect(deduplicated[0].keywordScore).toBe(5.0);
    expect(deduplicated[0].freshnessScore).toBe(0.8);

    const detail = deduplicated[0].trace.items[0].normalizationDetails?.combinedConfidence;
    expect(detail).toBeCloseTo(0.98);
  });
});
