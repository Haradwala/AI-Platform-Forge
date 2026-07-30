"use strict";
/**
 * runtime-events.ts — Phase 23 Runtime Discovery Event Bus
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEvents = void 0;
const events_1 = require("events");
class RuntimeEvents extends events_1.EventEmitter {
    emitStarted() {
        this.emit('discovery:started');
    }
    emitCompleted(runtimes) {
        this.emit('discovery:completed', runtimes);
    }
    emitDetected(runtime) {
        this.emit('runtime:detected', runtime);
    }
    emitStatusChanged(runtimeId, status) {
        this.emit('runtime:status-changed', { runtimeId, status });
    }
    emitHealthChanged(runtimeId, health) {
        this.emit('runtime:health-changed', { runtimeId, health });
    }
    emitEnvironmentChanged(diagnostics) {
        this.emit('environment:changed', diagnostics);
    }
}
exports.RuntimeEvents = RuntimeEvents;
//# sourceMappingURL=runtime-events.js.map