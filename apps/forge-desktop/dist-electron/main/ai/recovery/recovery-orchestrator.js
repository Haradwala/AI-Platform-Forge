"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryOrchestrator = void 0;
class RecoveryOrchestrator {
    failureAnalyzer;
    policyEngine;
    strategyRegistry;
    executor;
    rollbackManager;
    journal;
    metrics;
    eventBus;
    logger;
    currentState = 'idle';
    constructor(failureAnalyzer, policyEngine, strategyRegistry, executor, rollbackManager, journal, metrics, eventBus, logger) {
        this.failureAnalyzer = failureAnalyzer;
        this.policyEngine = policyEngine;
        this.strategyRegistry = strategyRegistry;
        this.executor = executor;
        this.rollbackManager = rollbackManager;
        this.journal = journal;
        this.metrics = metrics;
        this.eventBus = eventBus;
        this.logger = logger;
    }
    getState() {
        return this.currentState;
    }
    async recover(report, workspaceRoot) {
        this.logger.info('[RecoveryOrchestrator] Starting recovery orchestration flow...');
        this.currentState = 'analyzing';
        this.emitStateChange('recovery:analysis-complete');
        const analysis = this.failureAnalyzer.analyze(report);
        this.logger.info(`[RecoveryOrchestrator] Identified failure category: "${analysis.category}" Root cause: "${analysis.rootCause}"`);
        const policy = this.policyEngine.getPolicy('enterprise');
        const strategies = this.strategyRegistry.getStrategiesFor(report);
        if (strategies.length === 0) {
            this.logger.warn('[RecoveryOrchestrator] No applicable recovery strategies found.');
            this.currentState = 'failed';
            this.emitStateChange('recovery:failed');
            return { success: false, attempts: [], durationMs: 0 };
        }
        const startTime = Date.now();
        const attemptsReport = [];
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
                }
                else {
                    this.logger.warn(`[RecoveryOrchestrator] Strategy "${strategy.id}" failed. Rolling back changes...`);
                    this.currentState = 'rollingBack';
                    this.rollbackManager.restoreSnapshots();
                }
            }
            catch (err) {
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
    emitStateChange(type) {
        this.eventBus.emit('startup:stage-changed', { stage: `recovery:${this.currentState}` });
    }
}
exports.RecoveryOrchestrator = RecoveryOrchestrator;
//# sourceMappingURL=recovery-orchestrator.js.map