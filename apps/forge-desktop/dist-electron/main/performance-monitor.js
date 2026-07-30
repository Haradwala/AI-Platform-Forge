"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = void 0;
class PerformanceMonitor {
    logger;
    latencies = new Map();
    constructor(logger) {
        this.logger = logger;
    }
    record(channel, durationMs) {
        if (durationMs < 0)
            return;
        const bucket = this.latencies.get(channel) ?? [];
        bucket.push(durationMs);
        this.latencies.set(channel, bucket);
        if (durationMs > 100) {
            this.logger.warn(`[PerformanceMonitor] High latency detected on channel "${channel}": ${durationMs}ms`);
        }
    }
    snapshot() {
        const out = {};
        for (const [ch, times] of this.latencies.entries()) {
            if (times.length === 0) {
                out[ch] = 0;
                continue;
            }
            const sorted = [...times].sort((a, b) => a - b);
            // Return 95th percentile latency
            const p95Idx = Math.floor(sorted.length * 0.95);
            out[ch] = sorted[p95Idx];
        }
        return out;
    }
    reset() {
        this.latencies.clear();
        this.logger.info('[PerformanceMonitor] Performance counters reset.');
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
exports.default = PerformanceMonitor;
//# sourceMappingURL=performance-monitor.js.map