"use strict";
/**
 * execution-domain.ts
 *
 * Execution Domain Store — pure event store for ExecutionEvents.
 * Implements an immutable timeline of tool, file, and system execution events.
 * Contains no AI entity extraction logic (delegated to ExecutionEntityExtractor).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionDomain = void 0;
class ExecutionDomain {
    events = [];
    emitEvent(event) {
        this.events.push(event);
    }
    getEvents(filter) {
        if (!filter) {
            return [...this.events];
        }
        return this.events.filter((e) => {
            if (filter.turnId && e.turnId !== filter.turnId)
                return false;
            if (filter.type && e.type !== filter.type)
                return false;
            return true;
        });
    }
    getLatestEvent(type) {
        if (!type) {
            return this.events[this.events.length - 1];
        }
        for (let i = this.events.length - 1; i >= 0; i--) {
            if (this.events[i].type === type) {
                return this.events[i];
            }
        }
        return undefined;
    }
    clear() {
        this.events.length = 0;
    }
}
exports.ExecutionDomain = ExecutionDomain;
//# sourceMappingURL=execution-domain.js.map