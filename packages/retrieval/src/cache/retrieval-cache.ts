import { IEventBus } from '@forge/core';
import { IUnifiedRetrievalResult } from '../models/diagnostics';

export class RetrievalCache {
  private cache = new Map<string, IUnifiedRetrievalResult>();

  constructor(private readonly eventBus: IEventBus) {
    this.setupInvalidationListeners();
  }

  get(key: string): IUnifiedRetrievalResult | undefined {
    return this.cache.get(key);
  }

  set(key: string, result: IUnifiedRetrievalResult): void {
    this.cache.set(key, result);
    this.eventBus.publish('retrieval.cached', { queryKey: key, timestamp: new Date() });
  }

  invalidate(reason: string): void {
    this.cache.clear();
    this.eventBus.publish('retrieval.invalidated', { reason, timestamp: new Date() });
  }

  private setupInvalidationListeners(): void {
    this.eventBus.subscribe('workspace.file.modified', (event) => {
      this.invalidate(`File modified: ${event.payload.file.relativePath}`);
    });
    this.eventBus.subscribe('workspace.file.deleted', (event) => {
      this.invalidate(`File deleted: ${event.payload.relativePath}`);
    });
    this.eventBus.subscribe('graph.incremental.completed', () => {
      this.invalidate('Graph incrementally completed');
    });
  }
}
