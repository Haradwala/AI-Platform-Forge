export interface ITraversalExecutionPlan {
  readonly searchKey: string;
  readonly scanType: 'node_id' | 'qualified_name' | 'file_path';
  readonly maxDepth: number;
}

export class QueryOptimizer {
  private planCache = new Map<string, ITraversalExecutionPlan>();

  optimize(
    queryType: 'symbol' | 'references' | 'callers' | 'callees' | 'path',
    params: { searchKey: string; maxDepth?: number }
  ): ITraversalExecutionPlan {
    const cacheKey = `${queryType}:${params.searchKey}:${params.maxDepth || 1}`;
    if (this.planCache.has(cacheKey)) {
      return this.planCache.get(cacheKey)!;
    }

    let scanType: 'node_id' | 'qualified_name' | 'file_path' = 'node_id';
    if (queryType === 'symbol') {
      scanType = 'qualified_name';
    } else if (queryType === 'references') {
      scanType = 'node_id';
    }

    const plan: ITraversalExecutionPlan = {
      searchKey: params.searchKey,
      scanType,
      maxDepth: params.maxDepth || 10
    };

    this.planCache.set(cacheKey, plan);
    return plan;
  }

  clearPlanCache(): void {
    this.planCache.clear();
  }
}
