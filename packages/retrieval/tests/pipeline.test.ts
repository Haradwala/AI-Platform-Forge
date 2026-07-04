import { describe, it, expect } from 'vitest';
import { RetrievalPipeline } from '../src/pipeline';
import { RetrievalCoordinator } from '../src/coordinator';
import { ProviderHealthMonitor } from '../src/health/health-monitor';
import { WorkspaceRetriever } from '../src/providers/workspace/workspace-retriever';
import { KeywordRetriever } from '../src/providers/keyword/keyword-retriever';
import { IRetrievalPlan } from '../src/interfaces/provider';
import { BalancedRetrievalPolicy } from '../src/policies/balanced';

class MockEventBus {
  publish() {}
  subscribe() { return ''; }
}

describe('RetrievalPipeline Integration', () => {
  it('should run full retrieval stages sequentially', async () => {
    const eventBus = new MockEventBus() as any;
    const monitor = new ProviderHealthMonitor(eventBus);
    const coordinator = new RetrievalCoordinator(monitor);
    const pipeline = new RetrievalPipeline(coordinator, eventBus);

    const workspaceR = new WorkspaceRetriever();
    const keywordR = new KeywordRetriever();
    keywordR.addDocument('package.json', 'This is package json keyword document.');

    const policy = new BalancedRetrievalPolicy();
    const plan: IRetrievalPlan = {
      workspaceId: 'w-1',
      query: 'package',
      limit: 10,
      activeFilePath: 'package.json',
      policy
    };

    const result = await pipeline.execute(plan, [workspaceR, keywordR]);

    expect(result.candidates.length).toBe(1);
    expect(result.diagnostics.duplicatesRemoved).toBe(1);
    expect(result.candidates[0].sources.length).toBe(2);
    expect(result.candidates[0].normalizedScore).toBeGreaterThan(0.0);
  });
});
