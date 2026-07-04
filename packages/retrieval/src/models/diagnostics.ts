import { IRetrievalCandidate } from '@forge/shared';
import { IRetrievalCost } from '../estimator';

export interface IRetrievalDiagnostics {
  readonly providerDurationsMs: Record<string, number>;
  readonly providerCandidatesCount: Record<string, number>;
  readonly duplicatesRemoved: number;
  readonly normalizationTimeMs: number;
  readonly rankingTimeMs: number;
  readonly cacheHit: boolean;
  readonly cancellationTriggered: boolean;
  readonly costProjection: IRetrievalCost;
}

export interface IUnifiedRetrievalResult {
  readonly candidates: IRetrievalCandidate[];
  readonly diagnostics: IRetrievalDiagnostics;
}
