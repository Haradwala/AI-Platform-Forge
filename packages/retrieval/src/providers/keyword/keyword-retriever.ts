import { IRetrievalProvider, IRetrievalPlan } from '../../interfaces/provider';
import { ProviderHealthStatus } from '../../health/status';
import { IRetrievalCandidate, IRetrievalMetadata } from '@forge/shared';

interface IDocument {
  readonly path: string;
  readonly content: string;
  readonly tokens: string[];
}

export class KeywordRetriever implements IRetrievalProvider {
  readonly id = 'KeywordRetriever';
  private documents: IDocument[] = [];

  async checkHealth(): Promise<ProviderHealthStatus> {
    return ProviderHealthStatus.Healthy;
  }

  addDocument(path: string, content: string): void {
    const tokens = this.tokenize(content);
    this.documents.push({ path, content, tokens });
  }

  async retrieve(plan: IRetrievalPlan): Promise<IRetrievalCandidate[]> {
    const candidates: IRetrievalCandidate[] = [];
    const timestamp = new Date();
    const queryTokens = this.tokenize(plan.query);

    if (queryTokens.length === 0 || this.documents.length === 0) {
      return [];
    }

    const N = this.documents.length;
    const avgdl = this.documents.reduce((sum, doc) => sum + doc.tokens.length, 0) / N;
    const k1 = 1.2;
    const b = 0.75;

    for (const doc of this.documents) {
      let score = 0;
      for (const t of queryTokens) {
        const tf = doc.tokens.filter((tok) => tok === t).length;
        if (tf > 0) {
          const docFreq = this.documents.filter((d) => d.tokens.includes(t)).length;
          const idf = Math.max(0.0001, Math.log(1 + (N - docFreq + 0.5) / (docFreq + 0.5)));
          const docLen = doc.tokens.length;
          const denom = tf + k1 * (1 - b + (b * docLen) / avgdl);
          score += idf * ((tf * (k1 + 1)) / denom);
        }
      }

      if (score > 0) {
        const metadata: IRetrievalMetadata = {
          workspaceId: plan.workspaceId,
          timestamp
        };

        candidates.push({
          id: `keyword:${doc.path}`,
          workspaceId: plan.workspaceId,
          sources: [{ providerId: this.id, confidence: 0.85, rawScore: score }],
          content: doc.content,
          path: doc.path,
          metadata,
          normalizedScore: 0,
          graphDistance: -1,
          keywordScore: score,
          vectorScore: 0,
          freshnessScore: 0.6,
          trace: {
            items: [{ deduplicationHistory: [], providerDecision: `BM25 keyword match score: ${score.toFixed(4)}` }],
            timestamp
          }
        });
      }
    }

    return candidates.sort((a, b) => b.keywordScore - a.keywordScore);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[^a-zA-Z0-9]+/)
      .filter((t) => t.length > 1);
  }
}
