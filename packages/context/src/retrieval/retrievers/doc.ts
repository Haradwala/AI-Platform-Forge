import { IContextRetriever } from '../../interfaces/retrieval';
import { ICandidateContext, IContextMetadata, IContextPlan } from '@forge/shared';

export class DocumentationRetriever implements IContextRetriever {
  readonly id = 'DocumentationRetriever';

  async retrieve(plan: IContextPlan, activeFilePath?: string): Promise<ICandidateContext[]> {
    const candidates: ICandidateContext[] = [];
    const timestamp = new Date();

    for (const q of plan.searchQueries) {
      if (q.toLowerCase().includes('doc') || q.toLowerCase().includes('readme')) {
        const metadata: IContextMetadata = {
          workspaceId: 'w-1',
          retrievalSource: 'documentation',
          confidenceScore: 0.95,
          createdAt: timestamp
        };

        candidates.push({
          id: 'doc:readme',
          type: 'documentation',
          path: 'README.md',
          content: 'This is the main project markdown documentation.',
          estimatedTokens: 10,
          metadata,
          relevanceScore: 0.95,
          importanceScore: 0.9,
          graphDistance: 1,
          freshnessScore: 0.9
        });
      }
    }

    return candidates;
  }
}
