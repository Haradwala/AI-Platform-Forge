import type { IVerificationReport } from '../verification/verification-types';
import type { RecoveryState, IRecoveryReport } from './recovery-types';
import type { FailureAnalyzer } from './failure-analyzer';
import type { RecoveryPolicyEngine } from './recovery-policy-engine';
import type { RecoveryStrategyRegistry } from './recovery-strategy-registry';
import type { RecoveryExecutor } from './recovery-executor';
import type { RollbackManager } from './rollback-manager';
import type { RecoveryJournal } from './recovery-journal';
import type { RecoveryMetrics } from './recovery-metrics';
import type { IDesktopLogger, IDesktopEventBus } from '../../container/service-interfaces';

export class RecoveryOrchestrator {
  private currentState: RecoveryState = 'idle';

  constructor(
    private readonly failureAnalyzer: FailureAnalyzer,
    private readonly policyEngine: RecoveryPolicyEngine,
    private readonly strategyRegistry: RecoveryStrategyRegistry,
    private readonly executor: RecoveryExecutor,
    private readonly rollbackManager: RollbackManager,
    private readonly journal: RecoveryJournal,
    private readonly metrics: RecoveryMetrics,
    private readonly eventBus: IDesktopEventBus,
    private readonly logger: IDesktopLogger
  ) {}

  getState(): RecoveryState {
    return this.currentState;
  }

  async recover(report: IVerificationReport, workspaceRoot: string | null): Promise<IRecoveryReport> {
    this.logger.info('[RecoveryOrchestrator] Starting recovery orchestration flow...');
    this.currentState = 'analyzing';
    this.emitStateChange('recovery:analysis-complete');

    const analysis = this.failureAnalyzer.analyze(report);
    this.logger.info(
      `[RecoveryOrchestrator] Identified failure category: "${analysis.category}" Root cause: "${analysis.rootCause}"`
    );

    const policy = this.policyEngine.getPolicy('enterprise');
    const strategies = this.strategyRegistry.getStrategiesFor(report);

    if (strategies.length === 0) {
      this.logger.warn('[RecoveryOrchestrator] No applicable recovery strategies found.');
      this.currentState = 'failed';
      this.emitStateChange('recovery:failed');
      return { success: false, attempts: [], durationMs: 0 };
    }

    const startTime = Date.now();
    const attemptsReport: { strategyId: string; success: boolean; durationMs: number }[] = [];

    this.currentState = 'recovering';
    let recovered = false;

    // Snapshot current state
    if (workspaceRoot) {
      this.rollbackManager.saveSnapshot(workspaceRoot);
    }

    for (let i = 0; i < Math.min(strategies.length, policy.maxRetries); i++) {
      const strategy = strategies[i];
      const attemptStart = Date.now();
      this.currentState = 'retrying';
      this.eventBus.emit('startup:stage-changed', {
        stage: `recovery:strategy-selected`,
        metadata: { strategyId: strategy.id },
      });

      this.logger.info(`[RecoveryOrchestrator] Attempting recovery strategy: "${strategy.id}"`);
      try {
        const result = await this.executor.executeStrategy(strategy.id, workspaceRoot);
        const duration = Date.now() - attemptStart;

        attemptsReport.push({ strategyId: strategy.id, success: result.success, durationMs: duration });
        this.journal.logAttempt(strategy.id, result.success, duration);
        this.metrics.addAttempt(result.success, duration);

        if (result.success) {
          this.logger.info(`[RecoveryOrchestrator] Strategy "${strategy.id}" successfully recovered state!`);
          recovered = true;
          break;
        } else {
          this.logger.warn(`[RecoveryOrchestrator] Strategy "${strategy.id}" failed. Rolling back changes...`);
          this.currentState = 'rollingBack';
          this.rollbackManager.restoreSnapshots();
        }
      } catch (err: any) {
        const duration = Date.now() - attemptStart;
        attemptsReport.push({ strategyId: strategy.id, success: false, durationMs: duration });
        this.journal.logAttempt(strategy.id, false, duration);
        this.metrics.addAttempt(false, duration);
        this.logger.error(`[RecoveryOrchestrator] Crash running strategy "${strategy.id}": ${err.message}`);
        this.rollbackManager.restoreSnapshots();
      }
    }

    this.currentState = recovered ? 'recovered' : 'failed';
    this.emitStateChange(recovered ? 'recovery:completed' : 'recovery:failed');

    this.journal.saveJournal(workspaceRoot);

    return {
      success: recovered,
      attempts: attemptsReport,
      durationMs: Date.now() - startTime,
    };
  }

  private emitStateChange(type: any): void {
    this.eventBus.emit('startup:stage-changed', { stage: `recovery:${this.currentState}` });
  }
}
