# Hybrid Retrieval Engine Package Architecture Reference

This document explains the architecture, design choices, and execution flow of the **Hybrid Retrieval Engine** (`@forge/retrieval`).

---

## 1. Design Overview

The Hybrid Retrieval Engine queries multiple retrieval providers in parallel, merges and de-duplicates candidate sets, normalizes scores into a uniform range, ranks items, and exposes unified retrieval candidates.

### Component Layout
```
                           [IContextPlan]
                                 │
                         ┌───────▼──────────────┐
                         │RetrievalPlanCompiler │ selects policy & maps plan
                         └───────┬──────────────┘
                                 │
                         ┌───────▼──────────────┐
                         │   RetrievalPipeline  │
                         └───────┬──────────────┘
                                 │
                         ┌───────▼──────────────┐
                         │ RetrievalCoordinator │ queries Registry active health list
                         └───────┬──────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
           ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
           │WorkspaceR │   │  GraphR   │   │ KeywordR  │ ... (Future Vector, Git)
           └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
                 │               │               │
                 └───────────────┼───────────────┘
                                 │ Candidate lists
                         ┌───────▼──────────────┐
                         │   CandidateMerger    │ merges sets preserving provenance
                         └───────┬──────────────┘
                                 │
                         ┌───────▼──────────────┐
                         │     Deduplicator     │ groups by path, combines confidence
                         └───────┬──────────────┘
                                 │
                         ┌───────▼──────────────┐
                         │    ScoreNormalizer   │ scales raw scores to [0.0 - 1.0]
                         └───────┬──────────────┘
                                 │
                         ┌───────▼──────────────┐
                         │   RetrievalRanker    │ sorts by final normalized score
                         └───────┬──────────────┘
                                 │
                    [IUnifiedRetrievalResult]
```

---

## 2. Key Refinements

*   **RetrievalProviderRegistry**: Decouples coordinator from concrete retrievers, discovering active instances at runtime.
*   **RetrievalPlanCompiler & Policies**: Maps query priorities, budgets, limits, and timeouts to customized policies (`Balanced`, `Fast`).
*   **ScoreNormalizer**: Translates raw BM25 score metrics and reciprocal decay graph distances into a uniform scale.
*   **Provider Health Monitor**: Listens to health states using a type-safe `ProviderHealthStatus` enum, dynamically skipping unavailable targets.
*   **Diagnostics & Traceability**: Computes execution durations, duplicate counts, and maps structured traces to explain selection decisions.
