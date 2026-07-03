# ADR-001: Monorepo Orchestration via pnpm and Turborepo

## Status
Approved

## Context
ForgeOS is a hybrid multi-language project (TypeScript + Python) containing several decoupled packages (`core`, `shared`, `runtime`, `parser`, `indexer`, `memory`, `planner`, `agent`) and apps (`desktop`, `backend`).
We need an orchestration engine that provides fast dependency linking, dependency isolation (no phantom dependencies), concurrent package compilation, and robust build caching.

## Decision
We utilize **pnpm workspaces** combined with **Turborepo** task runners:
1.  `pnpm-workspace.yaml` maps the package locations.
2.  `turbo.json` configures tasks (`build`, `test`, `lint`) with topological execution dependencies.
3.  Pre-commit validation is automated using **Husky** and **lint-staged**.

## Consequences
- **Pros**:
  - Extremely fast compilation due to Turborepo's file-based task caching.
  - Strict dependency boundaries: pnpm prevents packages from importing un-declared dependencies.
  - Workspace packages can link to each other directly via the `workspace:` syntax.
- **Cons**:
  - Requires developers to have `pnpm` installed locally (mitigated via `npx pnpm` fallback execution).
