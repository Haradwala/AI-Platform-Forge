"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observability = void 0;
class Observability {
    id = 'Observability';
    version = '1.0.0';
    dependencies = [];
    health = 'healthy';
    status = 'stopped';
    activeSpanId = null;
    logsCount = 0;
    startTime = Date.now();
    uptime() {
        return Date.now() - this.startTime;
    }
    metrics() {
        return {
            activeSpanId: this.activeSpanId,
            logsCount: this.logsCount,
        };
    }
    onStart() { }
    onRunning() { }
    onSuspend() { }
    onShutdown() { }
    createTrace() {
        const traceId = `tr_${Math.random().toString(36).substring(2, 10)}`;
        this.activeSpanId = traceId;
        return traceId;
    }
    logInfo(message, traceId) {
        this.logsCount++;
        const active = traceId || this.activeSpanId || 'global';
        console.log(`[Observability] [INFO] [Trace: ${active}] ${message}`);
    }
    logError(message, err, traceId) {
        this.logsCount++;
        const active = traceId || this.activeSpanId || 'global';
        console.error(`[Observability] [ERROR] [Trace: ${active}] ${message}`, err);
    }
    startProfiler(label) {
        const start = Date.now();
        return () => {
            const dur = Date.now() - start;
            this.logInfo(`Profiler [${label}] completed in ${dur}ms`);
        };
    }
}
exports.Observability = Observability;
//# sourceMappingURL=observability.js.map