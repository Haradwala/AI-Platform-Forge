import { IRetrievalProvider, IRetrievalPlan } from '../../interfaces/provider';
import { ProviderHealthStatus } from '../../health/status';
import { IRetrievalCandidate, IRetrievalMetadata } from '@forge/shared';
import { QueryEngine } from '@forge/knowledge-graph';

export class GraphRetriever implements IRetrievalProvider {
  readonly id = 'GraphRetriever';

  constructor(private readonly queryEngine?: QueryEngine) {}

  async checkHealth(): Promise<ProviderHealthStatus> {
    return this.queryEngine ? ProviderHealthStatus.Healthy : ProviderHealthStatus.Unavailable;
  }

  async retrieve(plan: IRetrievalPlan): Promise<IRetrievalCandidate[]> {
    if (!this.queryEngine) return [];

    const candidates: IRetrievalCandidate[] = [];
    const timestamp = new Date();
    const visited = new Set<string>();

    const queries = plan.query.split(/\s+/).filter(Boolean);
    for (const q of queries) {
      try {
        const nodes = await this.queryEngine.findSymbol(q);
        for (const node of nodes) {
          if (visited.has(node.id)) continue;
          visited.add(node.id);

          const metadata: IRetrievalMetadata = {
            workspaceId: plan.workspaceId,
            timestamp
          };

          candidates.push({
            id: `graph:${node.id}`,
            workspaceId: plan.workspaceId,
            sources: [{ providerId: this.id, confidence: 0.9, rawScore: 0.9 }],
            content: node.displayName,
            path: node.filePath,
            metadata,
            normalizedScore: 0,
            graphDistance: 1,
            keywordScore: 0,
            vectorScore: 0,
            freshnessScore: 0.8,
            trace: {
              items: [{ deduplicationHistory: [], providerDecision: `Discovered graph node: ${node.displayName}` }],
              timestamp
            }
          });
        }
      } catch {
        // Ignore
      }
    }

    return candidates;
  }
}
