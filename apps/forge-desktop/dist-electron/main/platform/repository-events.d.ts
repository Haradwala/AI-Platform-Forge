import { IDesktopEventBus } from '../container/service-interfaces';
export declare class RepositoryEventService {
    private readonly eventBus?;
    constructor(eventBus?: IDesktopEventBus | undefined);
    emitIndexingStarted(): void;
    emitIndexingCompleted(): void;
    emitFileUpdated(filePath: string, action: 'updated' | 'deleted'): void;
}
