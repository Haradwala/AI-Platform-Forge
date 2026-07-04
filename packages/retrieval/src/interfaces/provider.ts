import { IRetrievalCandidate, IContextPlan } from '@forge/shared';
import { ProviderHealthStatus } from '../health/status';

export interface IRetrievalPolicy {
  readonly id: string;
  readonly providerPriority: string[];
  readonly candidateLimits: Record<string, number>;
  readonly rankingWeights: Record<string, number>;
  readonly timeoutMs: number;
  readonly maxBudgetUsageTokens: number;
}

export interface IRetrievalPlan {
  readonly workspaceId: string;
  readonly query: string;
  readonly limit: number;
  readonly activeFilePath?: string;
  readonly cancellationToken?: { readonly isCancelled: boolean };
  readonly policy: IRetrievalPolicy;
}

export interface IRetrievalProvider {
  readonly id: string;
  checkHealth(): Promise<ProviderHealthStatus>;
  retrieve(plan: IRetrievalPlan): Promise<IRetrievalCandidate[]>;
}

export interface IRetrievalProviderRegistry {
  register(provider: IRetrievalProvider): void;
  unregister(providerId: string): void;
  getProvider(providerId: string): IRetrievalProvider | undefined;
  listProviders(): IRetrievalProvider[];
}

export interface IRetrievalPlanCompiler {
  compile(contextPlan: IContextPlan, policy: IRetrievalPolicy): IRetrievalPlan;
}
