import { IRetrievalPlanCompiler, IRetrievalPlan, IRetrievalPolicy } from './interfaces/provider';
import { IContextPlan } from '@forge/shared';

export class RetrievalPlanCompiler implements IRetrievalPlanCompiler {
  compile(contextPlan: IContextPlan, policy: IRetrievalPolicy): IRetrievalPlan {
    const combinedQuery = contextPlan.searchQueries.join(' ');
    return {
      workspaceId: 'w-1',
      query: combinedQuery,
      limit: policy.candidateLimits['WorkspaceRetriever'] || 20,
      activeFilePath: undefined,
      policy
    };
  }
}
