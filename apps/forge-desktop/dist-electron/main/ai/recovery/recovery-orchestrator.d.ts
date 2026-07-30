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
export declare class RecoveryOrchestrator {
    private readonly failureAnalyzer;
    private readonly policyEngine;
    private readonly strategyRegistry;
    private readonly executor;
    private readonly rollbackManager;
    private readonly journal;
    private readonly metrics;
    private readonly eventBus;
    private readonly logger;
    private currentState;
    constructor(failureAnalyzer: FailureAnalyzer, policyEngine: RecoveryPolicyEngine, strategyRegistry: RecoveryStrategyRegistry, executor: RecoveryExecutor, rollbackManager: RollbackManager, journal: RecoveryJournal, metrics: RecoveryMetrics, eventBus: IDesktopEventBus, logger: IDesktopLogger);
    getState(): RecoveryState;
    recover(report: IVerificationReport, workspaceRoot: string | null): Promise<IRecoveryReport>;
    private emitStateChange;
}
