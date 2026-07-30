"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryEventService = void 0;
class RepositoryEventService {
    eventBus;
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    emitIndexingStarted() {
        this.eventBus?.emit('startup:stage-changed', { stage: 'repository:indexing-started' });
    }
    emitIndexingCompleted() {
        this.eventBus?.emit('startup:stage-changed', { stage: 'repository:indexing-completed' });
    }
    emitFileUpdated(filePath, action) {
        this.eventBus?.emit('startup:stage-changed', {
            stage: `repository:file-${action}`,
            filePath,
        });
    }
}
exports.RepositoryEventService = RepositoryEventService;
//# sourceMappingURL=repository-events.js.map