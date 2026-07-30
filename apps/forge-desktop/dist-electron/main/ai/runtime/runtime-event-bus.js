"use strict";
/**
 * runtime-event-bus.ts — Phase 24 Runtime Execution Event Bus
 *
 * Decoupled event bus for runtime execution events.
 * Listened to by IPC adapters, WebSockets, or CLI handlers without coupling
 * execution logic directly to Electron IPC.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEventBus = void 0;
const events_1 = require("events");
class RuntimeEventBus extends events_1.EventEmitter {
    emitEvent(evt) {
        this.emit('runtime-event', evt);
        this.emit(`session:${evt.sessionId}`, evt);
    }
    onRuntimeEvent(listener) {
        this.on('runtime-event', listener);
        return () => this.off('runtime-event', listener);
    }
    onSessionEvent(sessionId, listener) {
        const channel = `session:${sessionId}`;
        this.on(channel, listener);
        return () => this.off(channel, listener);
    }
}
exports.RuntimeEventBus = RuntimeEventBus;
//# sourceMappingURL=runtime-event-bus.js.map