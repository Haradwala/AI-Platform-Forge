import { IRetrievalPolicy } from '../interfaces/provider';

export class FastRetrievalPolicy implements IRetrievalPolicy {
  readonly id = 'FastRetrievalPolicy';
  readonly providerPriority = ['WorkspaceRetriever', 'KeywordRetriever'];
  readonly candidateLimits = {
    WorkspaceRetriever: 10,
    KeywordRetriever: 15
  };
  readonly rankingWeights = {
    workspace: 1.0,
    keyword: 0.5
  };
  readonly timeoutMs = 1000;
  readonly maxBudgetUsageTokens = 4096;
}
