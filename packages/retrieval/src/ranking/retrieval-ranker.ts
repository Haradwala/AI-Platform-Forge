import { IRetrievalCandidate, IRetrievalTraceItem } from '@forge/shared';

export class RetrievalRanker {
  rank(candidates: IRetrievalCandidate[]): IRetrievalCandidate[] {
    const timestamp = new Date();
    const sorted = [...candidates].sort((a, b) => b.normalizedScore - a.normalizedScore);

    return sorted.map((c, index) => {
      const rankTraceItem: IRetrievalTraceItem = {
        deduplicationHistory: [],
        rankingDecision: `Ranked #${index + 1} with score ${c.normalizedScore.toFixed(4)}`,
        normalizationDetails: {}
      };

      return {
        ...c,
        trace: {
          items: [...c.trace.items, rankTraceItem],
          timestamp
        }
      };
    });
  }
}
