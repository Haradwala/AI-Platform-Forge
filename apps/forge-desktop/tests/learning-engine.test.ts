import { describe, it, expect, vi } from 'vitest';
import {
  LearningEngine,
  ExperienceStore,
  PatternEngine,
  StrategyOptimizer,
  PlanningOptimizer,
  RecoveryOptimizer,
  PromptOptimizer,
  ToolOptimizer,
  LearningPolicyEngine,
  ConfidenceCalibrator,
  MemoryConsolidator,
  LearningReportBuilder,
  LearningMetrics,
} from '../electron/main/ai/learning/learning-engine';
import type { IMemoryRegistry, IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';
import type { IExecutionOutcome } from '../electron/main/ai/outcome/outcome-types';

describe('LearningEngine', () => {
  it('optimizes parameters from past experiences and runs consolidators', async () => {
    const store = new ExperienceStore();
    const pattern = new PatternEngine();
    const strat = new StrategyOptimizer();
    const planOpt = new PlanningOptimizer();
    const recOpt = new RecoveryOptimizer();
    const promptOpt = new PromptOptimizer();
    const toolOpt = new ToolOptimizer();
    const policy = new LearningPolicyEngine();
    const calib = new ConfidenceCalibrator();

    const mockMemory = {
      addRecord: vi.fn(),
    } as any;

    const consolidator = new MemoryConsolidator(mockMemory);
    const repBuilder = new LearningReportBuilder();
    const metrics = new LearningMetrics();

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const engine = new LearningEngine(
      store,
      pattern,
      strat,
      planOpt,
      recOpt,
      promptOpt,
      toolOpt,
      policy,
      calib,
      consolidator,
      repBuilder,
      metrics,
      mockEventBus,
      mockLogger
    );

    const outcome: IExecutionOutcome = {
      success: true,
      planId: 'p1',
      goal: 'optimize goal',
      verification: {
        success: true,
        state: 'completed',
        policy: 'standard',
        durationMs: 120,
        compilation: { success: true, errors: [] },
        lint: { success: true, errors: [] },
        test: { success: true, passCount: 1, failCount: 0, errors: [] },
        format: { success: true, filesUnformatted: [] },
        security: { success: true, issues: [] },
        architecture: { success: true, issues: [] },
        performance: { success: true, issues: [] },
        suggestions: [],
      },
      recovery: null,
      reflection: {
        success: true,
        findings: [],
        scores: { maintainability: 90, readability: 95, safety: 90, performance: 92, correctness: 98, complexity: 85 },
        confidence: { execution: 95, verification: 98, recovery: 100, architecture: 90, reasoning: 85, overall: 93 },
        recommendations: ['clean order code'],
      },
      timestamp: new Date().toISOString(),
    };

    const report = await engine.learn(outcome);

    expect(report.patternsDiscovered.length).toBe(0);
    expect(report.promptOptimizations.length).toBe(2);
    expect(mockMemory.addRecord).toHaveBeenCalled();
  });
});
