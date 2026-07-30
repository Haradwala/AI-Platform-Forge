import { describe, it, expect } from 'vitest';
import { VerificationMetrics } from '../electron/main/ai/verification/verification-metrics';

describe('VerificationMetrics', () => {
  it('accumulates and aggregates checker elapsed times correctly', () => {
    const metrics = new VerificationMetrics();
    metrics.addMetrics({
      compileTimeMs: 100,
      lintTimeMs: 200,
      testTimeMs: 300,
      scanTimeMs: 400,
    });

    const summary = metrics.getSummary();
    expect(summary.compileTotalMs).toBe(100);
    expect(summary.lintTotalMs).toBe(200);
    expect(summary.testTotalMs).toBe(300);
    expect(summary.scanTotalMs).toBe(400);
    expect(summary.grandTotalMs).toBe(1000);

    metrics.clear();
    expect(metrics.getSummary().grandTotalMs).toBe(0);
  });
});
