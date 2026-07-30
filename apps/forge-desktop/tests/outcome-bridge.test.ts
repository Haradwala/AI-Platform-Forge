import { describe, it, expect, vi } from 'vitest';
import { OutcomeManager } from '../electron/main/ai/outcome/outcome-manager';
import { ExperienceBuilder } from '../electron/main/ai/outcome/experience-builder';
import { DecisionLog } from '../electron/main/ai/outcome/decision-log';
import type { IDesktopLogger, IDesktopEventBus, IPlan } from '../electron/main/container/service-interfaces';
import type { IVerificationReport } from '../electron/main/ai/verification/verification-types';
import type { IReflectionReport } from '../electron/main/ai/reflection/reflection-engine';

describe('OutcomeManager Bridge', () => {
  it('bundles outcome experience structures and writes decision reasons', async () => {
    const builder = new ExperienceBuilder();
    const log = new DecisionLog();

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const manager = new OutcomeManager(builder, log, mockEventBus, mockLogger);

    const plan: IPlan = { id: 'p1', goal: 'outcome goal', tasks: [] };
    const verificationReport: IVerificationReport = {
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
    };

    const reflectionReport: IReflectionReport = {
      success: true,
      findings: [],
      scores: { maintainability: 90, readability: 95, safety: 90, performance: 92, correctness: 98, complexity: 85 },
      confidence: { execution: 95, verification: 98, recovery: 100, architecture: 90, reasoning: 85, overall: 93 },
      recommendations: ['rec1'],
    };

    const outcome = await manager.processOutcome(plan, verificationReport, null, reflectionReport);

    expect(outcome.success).toBe(true);
    expect(outcome.planId).toBe('p1');
    expect(log.getEntries().length).toBe(0);
  });
});
