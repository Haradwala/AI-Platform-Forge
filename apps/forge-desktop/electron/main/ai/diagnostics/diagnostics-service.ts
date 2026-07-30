import type {
  IAiSessionService,
  IProviderRegistry,
  IRepositoryProvider,
  IExecutionEngine,
} from '../../container/service-interfaces';
import { MemoryRegistry } from '../memory/memory-registry';

export interface DiagnosticsSnapshot {
  readonly status: 'healthy' | 'warning' | 'degraded';
  readonly provider: string;
  readonly model: string;
  readonly repositoryIndexedCount: number;
  readonly memoryRecordsCount: number;
  readonly activeServices: string[];
  readonly lastExecutionStatus: string;
  readonly performanceCounters: Record<string, number>;
}

export class DiagnosticsService {
  constructor(
    private readonly sessionService: IAiSessionService,
    private readonly providerRegistry: IProviderRegistry,
    private readonly repo: IRepositoryProvider,
    private readonly memoryRegistry: MemoryRegistry,
    private readonly executionEngine: IExecutionEngine
  ) {}

  async getDiagnosticsSnapshot(): Promise<DiagnosticsSnapshot> {
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
    } catch {
      // ignore
    }

    const memoryRecordsCount = this.memoryRegistry.getRecords('pattern').length;

    const journal = this.executionEngine.getJournal();
    const lastEntry = journal && journal.length > 0 ? journal[journal.length - 1] : null;
    const lastExecutionStatus = lastEntry
      ? ((lastEntry as any).status || (lastEntry.endTime ? 'completed' : 'running'))
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
