import { IContextRetriever } from '../../interfaces/retrieval';
import { ICandidateContext, IContextMetadata, IContextPlan } from '@forge/shared';
import * as fs from 'fs/promises';

export class WorkspaceRetriever implements IContextRetriever {
  readonly id = 'WorkspaceRetriever';

  async retrieve(plan: IContextPlan, activeFilePath?: string): Promise<ICandidateContext[]> {
    const candidates: ICandidateContext[] = [];
    const timestamp = new Date();

    if (activeFilePath) {
      try {
        const content = await fs.readFile(activeFilePath, 'utf8');
        const metadata: IContextMetadata = {
          workspaceId: 'w-1',
          retrievalSource: 'workspace',
          confidenceScore: 1.0,
          createdAt: timestamp
        };

        candidates.push({
          id: `file:${activeFilePath}`,
          type: 'file',
          path: activeFilePath,
          content,
          estimatedTokens: Math.ceil(content.length / 4),
          metadata,
          relevanceScore: 1.0,
          importanceScore: 1.0,
          graphDistance: 0,
          freshnessScore: 1.0
        });
      } catch {
        // Ignore read failures
      }
    }

    return candidates;
  }
}
