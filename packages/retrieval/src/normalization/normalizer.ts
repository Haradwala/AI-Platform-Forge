import { IRetrievalCandidate, IRetrievalTraceItem } from '@forge/shared';

export class ScoreNormalizer {
  normalize(candidates: IRetrievalCandidate[]): IRetrievalCandidate[] {
    const timestamp = new Date();
    return candidates.map((c) => {
      const graphNormalized = c.graphDistance >= 0 ? 1 / (c.graphDistance + 1) : 0;
      const keywordNormalized = c.keywordScore > 0 ? c.keywordScore / (c.keywordScore + 1.2) : 0;
      const rawCombined = (graphNormalized + keywordNormalized) / 2;
      const finalScore = Math.min(1.0, Math.max(0.0, rawCombined));

      const normTraceItem: IRetrievalTraceItem = {
        deduplicationHistory: [],
        normalizationDetails: {
          graphNormalized,
          keywordNormalized,
          rawCombined,
          finalScore
        }
      };

      return {
        ...c,
        normalizedScore: finalScore,
        trace: {
          items: [...c.trace.items, normTraceItem],
          timestamp
        }
      };
    });
  }
}
