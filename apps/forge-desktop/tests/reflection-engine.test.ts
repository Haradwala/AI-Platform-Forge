import { describe, it, expect, vi } from 'vitest';
import {
  ReflectionEngine,
  ReflectionContextBuilder,
  ArchitectureReviewer,
  SolutionReviewer,
  SelfCritiqueEngine,
  ConfidenceEngine,
  ScoreAggregator,
  RecommendationEngine,
  ReflectionReportBuilder,
} from '../electron/main/ai/reflection/reflection-engine';
import type { IDesktopLogger, IDesktopEventBus, IPlan } from '../electron/main/container/service-interfaces';
import type { IVerificationReport } from '../electron/main/ai/verification/verification-types';

describe('ReflectionEngine', () => {
  it('coordinates reviewers to compile structured report metrics', async () => {
    const builder = new ReflectionContextBuilder();
    const arch = new ArchitectureReviewer();
    const sol = new SolutionReviewer();
    const critique = new SelfCritiqueEngine();
    const conf = new ConfidenceEngine();
    const score = new ScoreAggregator();
    const rec = new RecommendationEngine();
    const repBuilder = new ReflectionReportBuilder();

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const engine = new ReflectionEngine(
      builder,
      arch,
      sol,
      critique,
      conf,
      score,
      rec,
      repBuilder,
      mockEventBus,
      mockLogger
    );

    const plan: IPlan = { id: 'p1', goal: 'reflect engine goal', tasks: [] };
    const verificationReport: IVerificationReport = {
      success: true,
      state: 'completed',
      policy: 'standard',
      durationMs: 250,
      compilation: { success: true, errors: [] },
      lint: { success: true, errors: [] },
      test: { success: true, passCount: 1, failCount: 0, errors: [] },
      format: { success: true, filesUnformatted: [] },
      security: { success: true, issues: [] },
      architecture: { success: true, issues: [] },
      performance: { success: true, issues: [] },
      suggestions: [],
    };

    const report = await engine.reflect(plan, verificationReport, null, null);

    expect(report.success).toBe(true);
    expect(report.confidence.overall).toBe(93);
    expect(report.scores.maintainability).toBe(90);
    expect(report.recommendations.length).toBe(1);
  });
});
