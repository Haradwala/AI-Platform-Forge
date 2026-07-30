import { describe, it, expect, vi } from 'vitest';
import { VerificationEngine } from '../electron/main/ai/verification/verification-engine';
import type { VerificationPipeline } from '../electron/main/ai/verification/verification-pipeline';
import { VerificationMetrics } from '../electron/main/ai/verification/verification-metrics';
import type { IDesktopLogger } from '../electron/main/container/service-interfaces';

describe('VerificationEngine', () => {
  it('triggers pipelines run and saves metrics telemetry', async () => {
    const mockPipeline = {
      run: vi.fn().mockResolvedValue({
        success: true,
        durationMs: 400,
        compilation: { success: true, errors: [] },
        lint: { success: true, errors: [] },
        test: { success: true, passCount: 0, failCount: 0, errors: [] },
        format: { success: true, filesUnformatted: [] },
        security: { success: true, issues: [] },
        architecture: { success: true, issues: [] },
        performance: { success: true, issues: [] },
        suggestions: [],
      }),
    } as unknown as VerificationPipeline;

    const metrics = new VerificationMetrics();

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const engine = new VerificationEngine(mockPipeline, metrics, mockLogger);
    const report = await engine.verify('standard', '/mock/workspace');

    expect(report.success).toBe(true);
    expect(mockPipeline.run).toHaveBeenCalledWith('standard', '/mock/workspace');
    expect(metrics.getSummary().grandTotalMs).toBe(400);
  });
});
