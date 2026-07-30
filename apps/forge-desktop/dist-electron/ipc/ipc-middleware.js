"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMiddleware = exports.LoggerMiddleware = void 0;
/**
 * Logger middleware — logs every IPC call with channel, duration, and result.
 * Registered first in the middleware stack so it wraps all other middleware.
 */
class LoggerMiddleware {
    name = 'logger';
    async handle(ctx, next) {
        const label = `[IPC] ${ctx.channel}`;
        try {
            await next();
            const ms = Date.now() - ctx.startedAt;
            console.info(`${label} → ok (${ms}ms)`);
        }
        catch (err) {
            const ms = Date.now() - ctx.startedAt;
            console.error(`${label} → error (${ms}ms)`, err);
            throw err;
        }
    }
}
exports.LoggerMiddleware = LoggerMiddleware;
/**
 * Metrics middleware placeholder — records latency per channel.
 * Epic 20 (Performance Monitor) will replace this stub with real collection.
 */
class MetricsMiddleware {
    name = 'metrics';
    latencies = new Map();
    async handle(ctx, next) {
        await next();
        const ms = Date.now() - ctx.startedAt;
        const bucket = this.latencies.get(ctx.channel) ?? [];
        bucket.push(ms);
        this.latencies.set(ctx.channel, bucket);
    }
    getP95(channel) {
        const samples = this.latencies.get(channel);
        if (!samples || samples.length === 0)
            return null;
        const sorted = [...samples].sort((a, b) => a - b);
        const idx = Math.floor(sorted.length * 0.95);
        return sorted[idx] ?? sorted[sorted.length - 1];
    }
    snapshot() {
        const result = {};
        for (const channel of this.latencies.keys()) {
            const p95 = this.getP95(channel);
            if (p95 !== null)
                result[channel] = p95;
        }
        return result;
    }
    reset() {
        this.latencies.clear();
    }
}
exports.MetricsMiddleware = MetricsMiddleware;
//# sourceMappingURL=ipc-middleware.js.map