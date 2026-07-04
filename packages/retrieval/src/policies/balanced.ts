import { IRetrievalPolicy } from '../interfaces/provider';

export class BalancedRetrievalPolicy implements IRetrievalPolicy {
  readonly id = 'BalancedRetrievalPolicy';
  readonly providerPriority = ['WorkspaceRetriever', 'GraphRetriever', 'KeywordRetriever'];
  readonly candidateLimits = {
    WorkspaceRetriever: 20,
    GraphRetriever: 50,
    KeywordRetriever: 30
  };
  readonly rankingWeights = {
    workspace: 1.0,
    'knowledge-graph': 0.8,
    keyword: 0.6
  };
  readonly timeoutMs = 5000;
  readonly maxBudgetUsageTokens = 16384;
}
