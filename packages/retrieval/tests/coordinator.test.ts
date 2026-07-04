import { describe, it, expect } from 'vitest';
import { RetrievalCoordinator } from '../src/coordinator';
import { ProviderHealthMonitor } from '../src/health/health-monitor';
import { WorkspaceRetriever } from '../src/providers/workspace/workspace-retriever';
import { ProviderHealthStatus } from '../src/health/status';
import { BalancedRetrievalPolicy } from '../src/policies/balanced';
import { IRetrievalPlan } from '../src/interfaces/provider';

class MockEventBus {
  publish() {}
  subscribe() { return ''; }
}

describe('RetrievalCoordinator Skip checks', () => {
  it('should skip providers that are flagged as Unavailable by health checks', async () => {
    const eventBus = new MockEventBus() as any;
    const monitor = new ProviderHealthMonitor(eventBus);
    const coordinator = new RetrievalCoordinator(monitor);

    const provider = new WorkspaceRetriever();

    provider.checkHealth = async () => ProviderHealthStatus.Unavailable;
    await monitor.checkProvider(provider);

    const policy = new BalancedRetrievalPolicy();
    const plan: IRetrievalPlan = {
      workspaceId: 'w-1',
      query: 'package',
      limit: 10,
      policy
    };

    const { results } = await coordinator.coordinate(plan, [provider]);

    expect(results.length).toBe(0);
  });
});
