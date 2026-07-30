"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionObserver = void 0;
class ExecutionObserver {
    callbacks = new Set();
    subscribe(callback) {
        this.callbacks.add(callback);
        return () => {
            this.callbacks.delete(callback);
        };
    }
    notify(event) {
        for (const callback of this.callbacks) {
            try {
                callback(event);
            }
            catch (err) {
                console.error('[ExecutionObserver] Listener threw error:', err);
            }
        }
    }
    clear() {
        this.callbacks.clear();
    }
}
exports.ExecutionObserver = ExecutionObserver;
//# sourceMappingURL=execution-observer.js.map