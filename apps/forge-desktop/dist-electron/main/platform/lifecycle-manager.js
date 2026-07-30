"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleManager = void 0;
class LifecycleManager {
    id = 'LifecycleManager';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    currentState = 'Boot';
    listeners = new Map();
    startTime = Date.now();
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            currentState: this.currentState,
            uptimeMs: this.uptime(),
        };
    }
    onStart() {
        this.transition('PreInitialize');
    }
    onRunning() {
        this.transition('Initialize');
    }
    onSuspend() {
        this.transition('Suspended');
    }
    onShutdown() {
        this.transition('Stopped');
    }
    getCurrentState() {
        return this.currentState;
    }
    onState(state, callback) {
        if (!this.listeners.has(state)) {
            this.listeners.set(state, new Set());
        }
        this.listeners.get(state).add(callback);
        return () => {
            this.listeners.get(state)?.delete(callback);
        };
    }
    async transition(nextState) {
        this.currentState = nextState;
        const callbacks = this.listeners.get(nextState);
        if (callbacks) {
            for (const cb of callbacks) {
                try {
                    await cb();
                }
                catch (err) {
                    this.health = 'degraded';
                }
            }
        }
    }
}
exports.LifecycleManager = LifecycleManager;
//# sourceMappingURL=lifecycle-manager.js.map