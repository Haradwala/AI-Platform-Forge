# @forge/retrieval

This package contains the **Hybrid Retrieval Engine** for ForgeOS, responsible for coordinating query lookups across Workspace, Graph, and local BM25 Keyword Search providers.

## Public APIs

*   `RetrievalProviderRegistry`: Provider registration and discovery registry.
*   `ProviderHealthMonitor`: Tracks active provider health status enum values.
*   `RetrievalPlanCompiler`: Translates plans according to policy.
*   `RetrievalCoordinator`: Executes parallel provider queries with timeout policies.
*   `RetrievalCostEstimator`: Projects retrieval performance costs.
*   `CandidateMerger`: Merges results.
*   `Deduplicator`: De-duplicates candidates and aggregates confidence.
*   `ScoreNormalizer`: Standardizes provider scores to a uniform range.
*   `RetrievalRanker`: Sorts candidates.
*   `RetrievalPipeline`: Executes the coordinator, merger, deduplicator, normalizer, and ranker.
*   `RetrievalCache`: In-memory query caching.

## Events

### Consumed
*   `workspace.file.modified`: Invalidates cache.
*   `workspace.file.deleted`: Invalidates cache.
*   `graph.incremental.completed`: Invalidates cache.

### Published
*   `retrieval.requested`
*   `retrieval.merged`
*   `retrieval.deduplicated`
*   `retrieval.ranked`
*   `retrieval.cached`
*   `retrieval.invalidated`
*   `retrieval.completed`
