import { IDesktopEventBus } from '../container/service-interfaces';

export class RepositoryEventService {
  constructor(private readonly eventBus?: IDesktopEventBus) {}

  emitIndexingStarted(): void {
    this.eventBus?.emit('startup:stage-changed', { stage: 'repository:indexing-started' });
  }

  emitIndexingCompleted(): void {
    this.eventBus?.emit('startup:stage-changed', { stage: 'repository:indexing-completed' });
  }

  emitFileUpdated(filePath: string, action: 'updated' | 'deleted'): void {
    this.eventBus?.emit('startup:stage-changed', {
      stage: `repository:file-${action}`,
      filePath,
    } as any);
  }
}
