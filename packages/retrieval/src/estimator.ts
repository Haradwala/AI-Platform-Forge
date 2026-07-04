import { IRetrievalPlan } from './interfaces/provider';

export interface IRetrievalCost {
  readonly expectedLatencyMs: number;
  readonly expectedProviderCount: number;
  readonly expectedCandidateVolume: number;
  readonly estimatedTokenUsage: number;
  readonly estimatedEmbeddingCost: number;
  readonly estimatedApiCost: number;
}

export class RetrievalCostEstimator {
  estimate(plan: IRetrievalPlan, providersCount: number): IRetrievalCost {
    return {
      expectedLatencyMs: providersCount * 120,
      expectedProviderCount: providersCount,
      expectedCandidateVolume: plan.limit,
      estimatedTokenUsage: plan.limit * 250,
      estimatedEmbeddingCost: 0.0,
      estimatedApiCost: 0.0
    };
  }
}
