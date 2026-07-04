import { ICandidateContext } from '@forge/shared';

export class ContextRanker {
  rank(candidates: ICandidateContext[], activeFilePath?: string): ICandidateContext[] {
    const scored = candidates.map((cand) => {
      let relevanceScore = 0.5;
      let importanceScore = 0.5;
      let graphDistance = cand.graphDistance;
      let freshnessScore = 0.5;

      if (activeFilePath && cand.path === activeFilePath) {
        relevanceScore = 1.0;
        importanceScore = 1.0;
        graphDistance = 0;
        freshnessScore = 1.0;
      } else if (cand.metadata.retrievalSource === 'knowledge-graph') {
        if (cand.graphDistance === 1) {
          relevanceScore = 0.9;
          importanceScore = 0.8;
          freshnessScore = 0.7;
        } else {
          relevanceScore = 0.8;
          importanceScore = 0.7;
          freshnessScore = 0.6;
        }
      } else if (cand.metadata.retrievalSource === 'documentation') {
        relevanceScore = 0.75;
        importanceScore = 0.9;
        freshnessScore = 0.5;
      }

      return {
        ...cand,
        relevanceScore,
        importanceScore,
        graphDistance,
        freshnessScore
      };
    });

    return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
