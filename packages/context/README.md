# @forge/context

This package contains the **Context Engine** for ForgeOS, responsible for intent categorization, parallel candidate retrieval, scoring rankers, budget policy execution, and multi-stage code elision compression.

## Public APIs

*   `IntentAnalyzer`: Rule-based parser classifying prompts.
*   `ContextPlanner`: Strategy-based planner configuring retrieval plans.
*   `RetrievalOrchestrator`: Multi-retriever parallel merging coordinator.
*   `ContextRanker`: Relevance scoring calculator.
*   `BudgetManager`: Token budget optimization driver.
*   `CompressionPipeline`: Chain execution of spacing, code-body, and JSDoc comment compressors.
*   `ContextAssembler`: Trace and diagnostic package builder.
*   `ContextCache`: Reactive package caching.

## Events

### Consumed
*   `workspace.file.modified`: Triggers cache invalidation.
*   `workspace.file.deleted`: Triggers cache invalidation.
*   `graph.incremental.completed`: Triggers cache invalidation.

### Published
*   `context.requested`
*   `context.planned`
*   `context.retrieved`
*   `context.ranked`
*   `context.compressed`
*   `context.assembled`
*   `context.cached`
*   `context.invalidated`
*   `context.failed`
