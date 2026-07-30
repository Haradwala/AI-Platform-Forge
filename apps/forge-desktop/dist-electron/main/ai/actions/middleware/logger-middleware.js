"use strict";
/**
 * logger-middleware.ts — Phase 29 Action Telemetry & Logger Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
class LoggerMiddleware {
    name = 'LoggerMiddleware';
    async execute(req, next) {
        const start = Date.now();
        try {
            const result = await next();
            const duration = Date.now() - start;
            if (!result.metrics)
                result.metrics = {};
            result.metrics.executionTimeMs = duration;
            return result;
        }
        catch (err) {
            const duration = Date.now() - start;
            return {
                actionId: req.actionId,
                status: 'FAILED',
                durationMs: duration,
                error: err.message,
            };
        }
    }
}
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger-middleware.js.map