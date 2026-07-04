import { IRetrievalProvider, IRetrievalPlan } from '../../interfaces/provider';
import { ProviderHealthStatus } from '../../health/status';
import { IRetrievalCandidate, IRetrievalMetadata } from '@forge/shared';
import * as fs from 'fs/promises';

export class WorkspaceRetriever implements IRetrievalProvider {
  readonly id = 'WorkspaceRetriever';

  async checkHealth(): Promise<ProviderHealthStatus> {
    return ProviderHealthStatus.Healthy;
  }

  async retrieve(plan: IRetrievalPlan): Promise<IRetrievalCandidate[]> {
    const candidates: IRetrievalCandidate[] = [];
    const timestamp = new Date();

    const path = plan.activeFilePath || 'package.json';
    try {
      const content = await fs.readFile(path, 'utf8');
      const metadata: IRetrievalMetadata = {
        workspaceId: plan.workspaceId,
        timestamp
      };

      candidates.push({
        id: `workspace:${path}`,
        workspaceId: plan.workspaceId,
        sources: [{ providerId: this.id, confidence: 1.0, rawScore: 1.0 }],
        content,
        path,
        metadata,
        normalizedScore: 0,
        graphDistance: 0,
        keywordScore: 0,
        vectorScore: 0,
        freshnessScore: 1.0,
        trace: {
          items: [{ deduplicationHistory: [], providerDecision: 'Found via active file workspace query' }],
          timestamp
        }
      });
    } catch {
      // Ignore
    }

    return candidates;
  }
}
