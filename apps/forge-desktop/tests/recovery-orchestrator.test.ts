import { describe, it, expect, vi } from 'vitest';
import { RecoveryOrchestrator } from '../electron/main/ai/recovery/recovery-orchestrator';
import { FailureAnalyzer } from '../electron/main/ai/recovery/failure-analyzer';
import { RecoveryPolicyEngine } from '../electron/main/ai/recovery/recovery-policy-engine';
import { RecoveryStrategyRegistry } from '../electron/main/ai/recovery/recovery-strategy-registry';
import { RecoveryExecutor } from '../electron/main/ai/recovery/recovery-executor';
import { RollbackManager } from '../electron/main/ai/recovery/rollback-manager';
import { RecoveryJournal } from '../electron/main/ai/recovery/recovery-journal';
import { RecoveryMetrics } from '../electron/main/ai/recovery/recovery-metrics';
import type { IDesktopLogger, IDesktopEventBus } from '../electron/main/container/service-interfaces';
import type { IVerificationReport } from '../electron/main/ai/verification/verification-types';

describe('RecoveryOrchestrator', () => {
  it('correctly loops through strategies and handles failure analyze steps', async () => {
    const analyzer = new FailureAnalyzer();
    const policy = new RecoveryPolicyEngine();
    const registry = new RecoveryStrategyRegistry();

    registry.register({
      id: 'mock_strategy',
      canRecover: () => true,
      execute: vi.fn().mockResolvedValue({ success: true, message: 'Recovered!' }),
    });

    const executor = new RecoveryExecutor(registry);
    const rollback = new RollbackManager();
    const journal = new RecoveryJournal();
    const metrics = new RecoveryMetrics();

    const mockEventBus = {
      emit: vi.fn(),
    } as unknown as IDesktopEventBus;

    const mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as IDesktopLogger;

    const orchestrator = new RecoveryOrchestrator(
      analyzer,
      policy,
      registry,
      executor,
      rollback,
      journal,
      metrics,
      mockEventBus,
      mockLogger
    );

    const failReport: IVerificationReport = {
      success: false,
      state: 'failed',
      policy: 'standard',
      durationMs: 120,
      compilation: {
        success: false,
        errors: [{ file: 'error.ts', line: 1, column: 1, message: 'compile err', severity: 'error', source: 'tsc' }],
      },
      lint: { success: true, errors: [] },
      test: { success: true, passCount: 0, failCount: 0, errors: [] },
      format: { success: true, filesUnformatted: [] },
      security: { success: true, issues: [] },
      architecture: { success: true, issues: [] },
      performance: { success: true, issues: [] },
      suggestions: [],
    };

    const result = await orchestrator.recover(failReport, null);

    expect(result.success).toBe(true);
    expect(result.attempts.length).toBe(1);
    expect(result.attempts[0].strategyId).toBe('mock_strategy');
  });
});
