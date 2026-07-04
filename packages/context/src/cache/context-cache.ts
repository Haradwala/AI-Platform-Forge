import { IContextPackage } from '@forge/shared';
import { IEventBus } from '@forge/core';

export class ContextCache {
  private cache = new Map<string, IContextPackage>();

  constructor(private readonly eventBus: IEventBus) {
    this.setupInvalidationListeners();
  }

  get(key: string): IContextPackage | undefined {
    return this.cache.get(key);
  }

  set(key: string, pkg: IContextPackage): void {
    this.cache.set(key, pkg);
    this.eventBus.publish('context.cached', { packageId: pkg.id, timestamp: new Date() });
  }

  invalidate(reason: string): void {
    this.cache.clear();
    this.eventBus.publish('context.invalidated', { reason, timestamp: new Date() });
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
