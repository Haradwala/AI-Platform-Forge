import { describe, it, expect } from 'vitest';
import { ScoreNormalizer } from '../src/normalization/normalizer';
import { IRetrievalCandidate } from '@forge/shared';

describe('ScoreNormalizer scaling', () => {
  it('should normalize graph distance reciprocal and BM25 raw scores', () => {
    const normalizer = new ScoreNormalizer();
    const timestamp = new Date();

    const candidate: IRetrievalCandidate = {
      id: 'c1',
      workspaceId: 'w-1',
      sources: [],
      content: 'test content',
      path: 'test.ts',
      metadata: { workspaceId: 'w-1', timestamp },
      normalizedScore: 0,
      graphDistance: 1,
      keywordScore: 1.2,
      vectorScore: 0,
      freshnessScore: 0,
      trace: { items: [], timestamp }
    };

    const normalized = normalizer.normalize([candidate]);
    
    expect(normalized[0].normalizedScore).toBe(0.5);
  });
});
