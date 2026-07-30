"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationMetrics = void 0;
class VerificationMetrics {
    compileTotal = 0;
    lintTotal = 0;
    testTotal = 0;
    scanTotal = 0;
    addMetrics(m) {
        this.compileTotal += m.compileTimeMs;
        this.lintTotal += m.lintTimeMs;
        this.testTotal += m.testTimeMs;
        this.scanTotal += m.scanTimeMs;
    }
    getSummary() {
        return {
            compileTotalMs: this.compileTotal,
            lintTotalMs: this.lintTotal,
            testTotalMs: this.testTotal,
            scanTotalMs: this.scanTotal,
            grandTotalMs: this.compileTotal + this.lintTotal + this.testTotal + this.scanTotal,
        };
    }
    clear() {
        this.compileTotal = 0;
        this.lintTotal = 0;
        this.testTotal = 0;
        this.scanTotal = 0;
    }
}
exports.VerificationMetrics = VerificationMetrics;
//# sourceMappingURL=verification-metrics.js.map