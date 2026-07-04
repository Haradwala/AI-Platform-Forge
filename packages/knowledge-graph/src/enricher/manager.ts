import { IGraphStorage } from '../storage/storage';
import { IGraphNode } from '@forge/shared';

export interface IGraphEnricher {
  readonly id: string;
  enrich(storage: IGraphStorage, node: IGraphNode): Promise<void>;
}

export class GraphEnricherManager {
  private enrichers: IGraphEnricher[] = [];

  registerEnricher(enricher: IGraphEnricher): void {
    this.enrichers.push(enricher);
  }

  async runEnrichment(storage: IGraphStorage, node: IGraphNode): Promise<void> {
    for (const enricher of this.enrichers) {
      try {
        await enricher.enrich(storage, node);
      } catch (err) {
        console.error(`GraphEnricherManager: ${enricher.id} failed:`, err);
      }
    }
  }
}
