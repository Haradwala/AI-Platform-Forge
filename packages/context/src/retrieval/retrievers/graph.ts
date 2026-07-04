import { IContextRetriever } from '../../interfaces/retrieval';
import { ICandidateContext, IContextMetadata, IContextPlan } from '@forge/shared';
import { QueryEngine } from '@forge/knowledge-graph';

export class KnowledgeGraphRetriever implements IContextRetriever {
  readonly id = 'KnowledgeGraphRetriever';

  constructor(private readonly queryEngine: QueryEngine) {}

  async retrieve(plan: IContextPlan, activeFilePath?: string): Promise<ICandidateContext[]> {
    const candidates: ICandidateContext[] = [];
    const timestamp = new Date();
    const visited = new Set<string>();

    for (const q of plan.searchQueries) {
      const matchedNodes = await this.queryEngine.findSymbol(q);
      for (const node of matchedNodes) {
        if (visited.has(node.id)) continue;
        visited.add(node.id);

        const metadata: IContextMetadata = {
          workspaceId: 'w-1',
          retrievalSource: 'knowledge-graph',
          confidenceScore: 0.9,
          createdAt: timestamp
        };

        candidates.push({
          id: `node:${node.id}`,
          type: 'symbol',
          path: node.filePath,
          content: node.displayName,
          estimatedTokens: Math.ceil(node.displayName.length / 4),
          metadata,
          relevanceScore: 0.9,
          importanceScore: 0.8,
          graphDistance: 1,
          freshnessScore: 0.8,
          nodeAssociation: node
        });

        const neighbors = await this.queryEngine.findCallers(node.id);
        for (const neighbor of neighbors) {
          if (visited.has(neighbor.id)) continue;
          visited.add(neighbor.id);

          candidates.push({
            id: `node:${neighbor.id}`,
            type: 'symbol',
            path: neighbor.filePath,
            content: neighbor.displayName,
            estimatedTokens: Math.ceil(neighbor.displayName.length / 4),
            metadata: {
              ...metadata,
              confidenceScore: 0.8
            },
            relevanceScore: 0.8,
            importanceScore: 0.7,
            graphDistance: 2,
            freshnessScore: 0.7,
            nodeAssociation: neighbor
          });
        }
      }
    }

    return candidates;
  }
}
