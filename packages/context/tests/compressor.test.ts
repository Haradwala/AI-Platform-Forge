import { describe, it, expect } from 'vitest';
import { CompressionPipeline } from '../src/compression/pipeline';
import { AggressiveBudgetPolicy } from '../src/budget/policies/aggressive';
import { ICandidateContext } from '@forge/shared';

describe('CompressionPipeline Stages', () => {
  const pipeline = new CompressionPipeline();
  const policy = new AggressiveBudgetPolicy();
  const timestamp = new Date();

  it('should strip JSDoc and elide function bodies', async () => {
    const rawContent = `
/**
 * Resolves configuration parameters
 * @param config options
 */
function configure(config: any) {
  const val = config.val;
  return val;
}
`;

    const candidate: ICandidateContext = {
      id: 'c1', type: 'file', path: 'file.ts', content: rawContent, estimatedTokens: 100,
      metadata: { workspaceId: 'w', retrievalSource: 'workspace', confidenceScore: 0.8, createdAt: timestamp },
      relevanceScore: 0.5, importanceScore: 0.5, graphDistance: 1, freshnessScore: 0.5
    };

    const compressed = await pipeline.execute(candidate, policy);

    expect(compressed.content).not.toContain('@param config');
    expect(compressed.content).toContain('function configure(config: any) { /* elided */ }');
  });
});
