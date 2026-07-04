# Context Engine Package Architecture Reference

This document explains the architecture, design choices, and flow of the **Context Engine** (`@forge/context`).

---

## 1. Design Overview

The Context Engine selects, ranks, compresses, and packages the smallest, highest-quality context required for LLM prompt generation. It does not communicate with LLMs; instead, it outputs a model-agnostic, immutable `IContextPackage`.

### Component Layout
```
                          [User Request]
                                │
                        ┌───────▼───────┐
                        │ IntentAnalyzer│
                        └───────┬───────┘
                                │ Intent
                        ┌───────▼───────┐
                        │ ContextPlanner│ Selects Strategy (Explain, Debug, etc.)
                        └───────┬───────┘
                                │ Plan
                  ┌─────────────▼─────────────┐
                  │   RetrievalOrchestrator   │
                  └──────┬──────────────┬─────┘
                         │              │
           ┌─────────────▼─────┐  ┌─────▼─────────────┐
           │WorkspaceRetriever │  │GraphRetriever     │ ... (Doc, Future Vector/Git)
           └─────────────┬─────┘  └─────┬─────────────┘
                         │              │
                         └──────┬───────┘
                                │ Candidate Set
                        ┌───────▼───────┐
                        │ ContextRanker │ Computes Scores (Relevance, Freshness)
                        └───────┬───────┘
                                │ Scored Set
                        ┌───────▼───────┐
                        │ BudgetManager │ Enforces token bounds via IBudgetPolicy
                        └───────┬───────┘
                                │ Selected Set
                        ┌───────▼───────┐
                        │  Compression  │ Sequentially runs Structural, Code,
                        │   Pipeline    │ and Doc Compressors
                        └───────┬───────┘
                                │ Compressed Set
                        ┌───────▼───────┐
                        │ContextAssembler│ Traces choices & outputs package envelope
                        └───────┬───────┘
                                │
                         [ContextPackage]
```

---

## 2. Key Refinements

*   **Retrieval Orchestrator**: Merges and de-duplicates candidates from independent retrievers running in parallel. This isolates Workspace logic from Graph queries.
*   **Strongly Typed Metadata**: Eliminates generic parameter leakages using a structured `IContextMetadata` contract.
*   **Rich Scoring & Traceability**: The ranker scores metrics (relevance, importance, distance, freshness) which are preserved in the `ContextTrace` to explain context decisions to the user.
*   **Multi-Stage Compression**: Sequentially applies syntactic spacing trim, body statements elision, and comment removal to minimize token waste.
*   **Budget Policies**: Configures token limits and compression thresholds dynamically using a pluggable Strategy Pattern.
