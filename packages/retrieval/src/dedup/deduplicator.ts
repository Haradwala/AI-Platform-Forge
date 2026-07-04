import { IRetrievalCandidate, IRetrievalSource, IRetrievalTraceItem } from '@forge/shared';

export class Deduplicator {
  deduplicate(candidates: IRetrievalCandidate[]): IRetrievalCandidate[] {
    const groups = new Map<string, IRetrievalCandidate[]>();
    for (const c of candidates) {
      const key = `${c.workspaceId}:${c.path}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(c);
    }

    const result: IRetrievalCandidate[] = [];
    const timestamp = new Date();

    for (const group of groups.values()) {
      if (group.length === 1) {
        result.push(group[0]);
        continue;
      }

      const base = group[0];
      const mergedSources: IRetrievalSource[] = [];
      const history: string[] = [];

      let combinedUnconfidence = 1;
      let finalGraphDistance = base.graphDistance;
      let finalKeywordScore = base.keywordScore;
      let finalVectorScore = base.vectorScore;
      let finalFreshnessScore = base.freshnessScore;

      for (const item of group) {
        for (const s of item.sources) {
          mergedSources.push(s);
          combinedUnconfidence *= (1 - s.confidence);
        }
        history.push(`Merged candidate from provider: ${item.sources.map((s) => s.providerId).join(', ')}`);

        if (item.graphDistance >= 0 && (finalGraphDistance < 0 || item.graphDistance < finalGraphDistance)) {
          finalGraphDistance = item.graphDistance;
        }
        if (item.keywordScore > finalKeywordScore) {
          finalKeywordScore = item.keywordScore;
        }
        if (item.vectorScore > finalVectorScore) {
          finalVectorScore = item.vectorScore;
        }
        if (item.freshnessScore > finalFreshnessScore) {
          finalFreshnessScore = item.freshnessScore;
        }
      }

      const combinedConfidence = 1 - combinedUnconfidence;

      const mergedTraceItem: IRetrievalTraceItem = {
        deduplicationHistory: history,
        normalizationDetails: { combinedConfidence }
      };

      result.push({
        ...base,
        sources: mergedSources,
        graphDistance: finalGraphDistance,
        keywordScore: finalKeywordScore,
        vectorScore: finalVectorScore,
        freshnessScore: finalFreshnessScore,
        trace: {
          items: [...base.trace.items, mergedTraceItem],
          timestamp
        }
      });
    }

    return result;
  }
}
