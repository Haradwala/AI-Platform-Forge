"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryMetrics = void 0;
class RecoveryMetrics {
    totalAttempts = 0;
    successfulAttempts = 0;
    totalDurationMs = 0;
    addAttempt(success, durationMs) {
        this.totalAttempts++;
        if (success) {
            this.successfulAttempts++;
        }
        this.totalDurationMs += durationMs;
    }
    getStats() {
        return {
            totalAttempts: this.totalAttempts,
            successRate: this.totalAttempts > 0 ? (this.successfulAttempts / this.totalAttempts) * 100 : 100,
            averageDurationMs: this.totalAttempts > 0 ? this.totalDurationMs / this.totalAttempts : 0,
            totalDurationMs: this.totalDurationMs,
        };
    }
    clear() {
        this.totalAttempts = 0;
        this.successfulAttempts = 0;
        this.totalDurationMs = 0;
    }
}
exports.RecoveryMetrics = RecoveryMetrics;
//# sourceMappingURL=recovery-metrics.js.map