import { IRetrievalPlan, IRetrievalProvider } from './interfaces/provider';
import { ProviderHealthMonitor } from './health/health-monitor';
import { ProviderHealthStatus } from './health/status';
import { IRetrievalCandidate } from '@forge/shared';

export class RetrievalCoordinator {
  constructor(private readonly healthMonitor: ProviderHealthMonitor) {}

  async coordinate(
    plan: IRetrievalPlan,
    providers: IRetrievalProvider[]
  ): Promise<{ results: IRetrievalCandidate[][]; timingsMs: Record<string, number> }> {
    const results: IRetrievalCandidate[][] = [];
    const timingsMs: Record<string, number> = {};

    const activeProviders = providers.filter((p) => {
      const isHealthy = this.healthMonitor.getHealth(p.id) !== ProviderHealthStatus.Unavailable;
      return isHealthy && plan.policy.providerPriority.includes(p.id);
    });

    const promises = activeProviders.map(async (p) => {
      const start = Date.now();
      try {
        const result = await Promise.race([
          p.retrieve(plan),
          new Promise<IRetrievalCandidate[]>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout exceeding limit')), plan.policy.timeoutMs)
          )
        ]);
        timingsMs[p.id] = Date.now() - start;
        results.push(result);
      } catch (err) {
        timingsMs[p.id] = Date.now() - start;
        console.error(`RetrievalCoordinator: Provider ${p.id} query failed:`, err);
      }
    });

    await Promise.all(promises);

    return { results, timingsMs };
  }
}
