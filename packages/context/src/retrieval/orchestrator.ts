import { IContextRetriever } from '../interfaces/retrieval';
import { ICandidateContext, IContextPlan } from '@forge/shared';

export class RetrievalOrchestrator {
  private retrievers: IContextRetriever[] = [];

  registerRetriever(retriever: IContextRetriever): void {
    this.retrievers.push(retriever);
  }

  async retrieveAll(plan: IContextPlan, activeFilePath?: string): Promise<ICandidateContext[]> {
    const promises = this.retrievers.map((r) =>
      r.retrieve(plan, activeFilePath).catch((err) => {
        console.error(`RetrievalOrchestrator: Retriever ${r.id} failed:`, err);
        return [] as ICandidateContext[];
      })
    );

    const results = await Promise.all(promises);
    const merged = new Map<string, ICandidateContext>();

    for (const list of results) {
      for (const cand of list) {
        if (merged.has(cand.id)) {
          const existing = merged.get(cand.id)!;
          if (cand.metadata.confidenceScore > existing.metadata.confidenceScore) {
            merged.set(cand.id, cand);
          }
        } else {
          merged.set(cand.id, cand);
        }
      }
    }

    return Array.from(merged.values());
  }
}
