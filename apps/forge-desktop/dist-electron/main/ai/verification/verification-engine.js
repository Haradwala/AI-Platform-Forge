"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEngine = void 0;
class VerificationEngine {
    pipeline;
    metricsTracker;
    logger;
    constructor(pipeline, metricsTracker, logger) {
        this.pipeline = pipeline;
        this.metricsTracker = metricsTracker;
        this.logger = logger;
    }
    async verify(policy, workspaceRoot) {
        this.logger.info(`[VerificationEngine] Initiating verification flow under policy: "${policy}"`);
        const report = await this.pipeline.run(policy, workspaceRoot);
        this.metricsTracker.addMetrics({
            compileTimeMs: Math.floor(report.durationMs * 0.25),
            lintTimeMs: Math.floor(report.durationMs * 0.25),
            testTimeMs: Math.floor(report.durationMs * 0.25),
            scanTimeMs: Math.floor(report.durationMs * 0.25),
        });
        return report;
    }
}
exports.VerificationEngine = VerificationEngine;
//# sourceMappingURL=verification-engine.js.map