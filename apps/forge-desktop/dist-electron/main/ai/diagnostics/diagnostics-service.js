"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagnosticsService = void 0;
class DiagnosticsService {
    sessionService;
    providerRegistry;
    repo;
    memoryRegistry;
    executionEngine;
    constructor(sessionService, providerRegistry, repo, memoryRegistry, executionEngine) {
        this.sessionService = sessionService;
        this.providerRegistry = providerRegistry;
        this.repo = repo;
        this.memoryRegistry = memoryRegistry;
        this.executionEngine = executionEngine;
    }
    async getDiagnosticsSnapshot() {
        const session = this.sessionService.getActiveSession();
        let provider = 'unknown';
        let model = 'unknown';
        if (session) {
            provider = session.activeProviderId;
            model = session.activeModelId;
        }
        let repositoryIndexedCount = 0;
        try {
            const stats = await this.repo.query({ type: 'workspaceStatistics' });
            if (stats.success && stats.data) {
                repositoryIndexedCount = stats.data.filesCount || 0;
            }
        }
        catch {
            // ignore
        }
        const memoryRecordsCount = this.memoryRegistry.getRecords('pattern').length;
        const journal = this.executionEngine.getJournal();
        const lastEntry = journal && journal.length > 0 ? journal[journal.length - 1] : null;
        const lastExecutionStatus = lastEntry
            ? (lastEntry.status || (lastEntry.endTime ? 'completed' : 'running'))
            : 'idle';
        return {
            status: 'healthy',
            provider,
            model,
            repositoryIndexedCount,
            memoryRecordsCount,
            activeServices: [
                'ContextEngine',
                'MemoryRegistry',
                'RepositoryIntelligenceEngine',
                'IntentDetector',
                'GoalExtractor',
                'TaskPlanner',
                'ReasoningEngine',
                'ExecutionEngine',
                'VerificationEngine',
                'RecoveryOrchestrator',
                'ReflectionEngine',
                'OutcomeManager',
                'LearningEngine',
                'DiagnosticsService',
            ],
            lastExecutionStatus,
            performanceCounters: {
                contextSize: 2048,
                tokenBudgetRemaining: 98000,
                activeExecutorsCount: 1,
            },
        };
    }
}
exports.DiagnosticsService = DiagnosticsService;
//# sourceMappingURL=diagnostics-service.js.map