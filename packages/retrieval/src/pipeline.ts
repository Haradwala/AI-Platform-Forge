import { IRetrievalPlan, IRetrievalProvider } from './interfaces/provider';
import { RetrievalCoordinator } from './coordinator';
import { CandidateMerger } from './merge/merger';
import { Deduplicator } from './dedup/deduplicator';
import { ScoreNormalizer } from './normalization/normalizer';
import { RetrievalRanker } from './ranking/retrieval-ranker';
import { RetrievalCostEstimator } from './estimator';
import { IUnifiedRetrievalResult } from './models/diagnostics';
import { IEventBus } from '@forge/core';

export class RetrievalPipeline {
  private coordinator: RetrievalCoordinator;
  private merger = new CandidateMerger();
  private deduplicator = new Deduplicator();
  private normalizer = new ScoreNormalizer();
  private ranker = new RetrievalRanker();
  private costEstimator = new RetrievalCostEstimator();

  constructor(
    coordinator: RetrievalCoordinator,
    private readonly eventBus: IEventBus
  ) {
    this.coordinator = coordinator;
  }

  async execute(
    plan: IRetrievalPlan,
    providers: IRetrievalProvider[]
  ): Promise<IUnifiedRetrievalResult> {
    const startTime = Date.now();
    this.eventBus.publish('retrieval.requested', { query: plan.query, workspaceId: plan.workspaceId, timestamp: new Date() });

    const costProjection = this.costEstimator.estimate(plan, providers.length);

    const { results, timingsMs } = await this.coordinator.coordinate(plan, providers);

    const merged = this.merger.merge(results);
    this.eventBus.publish('retrieval.merged', { candidatesCount: merged.length, timestamp: new Date() });

    const deduplicated = this.deduplicator.deduplicate(merged);
    const duplicatesRemoved = merged.length - deduplicated.length;
    this.eventBus.publish('retrieval.deduplicated', { initialCount: merged.length, finalCount: deduplicated.length, timestamp: new Date() });

    const normStart = Date.now();
    const normalized = this.normalizer.normalize(deduplicated);
    const normalizationTimeMs = Date.now() - normStart;

    const rankStart = Date.now();
    const ranked = this.ranker.rank(normalized);
    const rankingTimeMs = Date.now() - rankStart;

    if (ranked.length > 0) {
      this.eventBus.publish('retrieval.ranked', {
        topCandidateId: ranked[0].id,
        topScore: ranked[0].normalizedScore,
        timestamp: new Date()
      });
    }

    const durationMs = Date.now() - startTime;
    this.eventBus.publish('retrieval.completed', {
      durationMs,
      finalCandidatesCount: ranked.length,
      timestamp: new Date()
    });

    const providerCandidatesCount: Record<string, number> = {};
    activeProvidersCountMapping(results, providerCandidatesCount);

    return {
      candidates: ranked,
      diagnostics: {
        providerDurationsMs: timingsMs,
        providerCandidatesCount,
        duplicatesRemoved,
        normalizationTimeMs,
        rankingTimeMs,
        cacheHit: false,
        cancellationTriggered: plan.cancellationToken?.isCancelled || false,
        costProjection
      }
    };
  }
}

function activeProvidersCountMapping(results: any[][], map: Record<string, number>) {
  for (const list of results) {
    if (list.length > 0) {
      const pId = list[0].sources[0].providerId;
      map[pId] = list.length;
    }
  }
}
