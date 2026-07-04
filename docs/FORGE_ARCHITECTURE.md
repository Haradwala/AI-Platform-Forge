# ForgeOS Master Architecture Reference

This document serves as the master engineering reference for ForgeOS. It outlines the core system design philosophy, layered packages architecture, dependency guidelines, event dispatching taxonomy, end-to-end AI pipelines data flow, and future roadmap.

---

## 1. Vision & Design Philosophy

ForgeOS is built to scale as a production-grade, language-agnostic AI software engineering agent platform. It is designed to index, search, plan, write, and execute code in codebases containing millions of lines of code.

### Core Principles
1.  **Interface-First Engineering**: Define components via TypeScript interfaces before writing concrete implementations. Ensure dependencies bind only to interfaces.
2.  **Modular Microkernel Architecture**: Keep the engine decoupled. Modules register in a central Dependency Injection (DI) container and hook into lifecycle events, rather than statically importing other packages.
3.  **Strict Language Decoupling**: Language-specific details (AST formats, compiler APIs, tree-sitter bindings) must never leak into indexing, planning, or LLM routing layers. Everything maps to uniform Forge Domain Models.
4.  **Asynchronous & Non-Blocking**: Heavy filesystem IO, watcher events, syntax parsing, and AST querying must execute asynchronously, protecting the main UI thread.
5.  **Event-Driven Communication**: Modules publish and consume typed messages over a central Event Bus using dot-notation schemas.

---

## 2. Layered Monorepo Architecture

ForgeOS is structured as a pnpm workspace monorepo. Packages are layered strictly by responsibility, from system-level foundations up to application plugins:

```mermaid
graph TD
    App[Applications / CLI / IDE] -->|Mounts Modules| Runtime[@forge/core-runtime]
    Runtime -->|Initializes| Workspace[@forge/workspace]
    Runtime -->|Initializes| Parser[@forge/parser]
    
    Workspace -->|Queries Models| Shared[@forge/shared]
    Parser -->|Queries Models| Shared
    
    Workspace -.->|Publishes events| Core[@forge/core]
    Parser -.->|Publishes events| Core
    
    Runtime -->|Uses Service Container| Core
```

### Package Responsibilities

1.  **`@forge/shared`** (Domain Models & Event Schema):
    *   Holds the source truth data structures: `IWorkspaceFile`, `ISymbol`, `IRelationship`, `ISourceRange`, `ISourceLocation`.
    *   Maintains the typed Event Bus topics definition schema (`SystemEventMap`).
    *   *Constraint*: Must have zero dependencies on other packages within the monorepo.
2.  **`@forge/core`** (Microkernel Engine):
    *   Provides foundational utilities: `ServiceContainer` (Dependency Injection), `EventBus` (Pub/Sub), structured `Logger` (Pino wrapper), and system `Guardrails`.
3.  **`@forge/core-runtime`** (Lifecycle Bootstrapper):
    *   Manages the startup, order resolution, and graceful shutdown of active modules (`IForgeModule`) via the `BootstrapEngine`.
4.  **`@forge/workspace`** (Filesystem & Workspace State):
    *   Streams workspace directory structures using an `AsyncGenerator`.
    *   Tracks file modifications reactively using a debounced Chokidar `FileWatcher`.
    *   Applies ignore rules (`IgnoreRuleManager`) by compiling `.gitignore` globs via `picomatch`.
5.  **`@forge/parser`** (Semantic Syntax Pipeline):
    *   Resolves file content languages via extension, config name, and shebang lines.
    *   Coordinates parse requests via a priority-sorted, cancellation-token-supported task `ParseScheduler`.
    *   Translates complex language ASTs into generic syntax nodes (`IASTNode`), passing them through pluggable extractors (`IExtractorPlugin`) to populate standard symbols and relationships.

---

## 3. Monorepo Dependency Rules

To prevent code pollution and compilation issues, package dependency mappings must satisfy these strict directions:

*   **Directional Flow**: Dependencies must flow downward. High-level orchestrators (e.g. `@forge/workspace` or `@forge/parser`) can import lower-level tools (e.g. `@forge/core` and `@forge/shared`), but lower-level tools must **never** import from the packages above them.
*   **Zero Circular Imports**: Monorepo packages must never form dependency cycles. If two packages require types defined in one another, those types must be extracted down to `@forge/shared`.
*   **Interface Binding**: Code must avoid directly importing implementation classes from other packages. Resolve them from the DI container using their interface identifier keys (e.g., `LanguageDetector`, `ParserPipeline`).

---

## 4. End-to-End Data Pipeline

When code is written, changed, or searched, data flows through the system in an isolated, streaming pipeline:

```
[ Filesystem ] 
      │ 
      ▼ (workspace.file.modified)
[ Workspace Engine ] (Tracks cache index & debounces changes)
      │ 
      ▼ (Queue parse job)
[ Parse Scheduler ] (Manages priorities & handles cancellations)
      │ 
      ▼ (Detect language & resolve parser driver)
[ Parser Engine ] (Builds AST and runs Extractor Plugins)
      │ 
      ▼ (parser.symbol.discovered / parser.relationship.created)
[ Knowledge Graph ] (Maintains dependency graphs & call trees)
      │ 
      ▼ (Sub-graph extraction matching context needs)
[ Context Engine ] (Builds prompt contexts & scopes references)
      │ 
      ▼ (Synthesizes strategy & file modifications)
[ Planner Engine ] (Drafts implementation changes)
      │ 
      ▼ (Code Generation)
[ LLM Agent Router ]
```

---

## 5. Standardized Event Taxonomy

All events dispatched over the central Event Bus use dot-notation casing:

*   **System Lifecycle**:
    *   `forge.booting`: The engine runtime is setting up context boundaries.
    *   `forge.initialized`: DI containers and modules have finished loading.
    *   `forge.ready`: The platform is booted and ready to service workspaces.
    *   `health.changed`: Dispatched when a module changes state (e.g. degraded/failed).
*   **Workspace Events**:
    *   `workspace.opening` / `workspace.opened` / `workspace.closed`: Workspace session state bounds.
    *   `workspace.file.created`: A new file has been created on disk.
    *   `workspace.file.modified`: An existing file has been modified (debounced).
    *   `workspace.file.deleted`: A file has been removed.
*   **Parser Events**:
    *   `parser.file.started`: The parser pipeline has begun processing a file.
    *   `parser.file.completed`: Successfully generated symbols and call graphs.
    *   `parser.file.failed`: The file parsing aborted due to compilation or cancellation issues.
    *   `parser.symbol.discovered`: A new symbol node has been cataloged.
    *   `parser.relationship.created`: A call, inheritance, or import link has been indexed.

---

## 6. Coding Standards & Best Practices

1.  **Error Recovery**: Parsers and watchers must not crash the kernel runtime on failures. Catch exceptions locally, log them to the Pino logger, publish diagnostic alerts to the Event Bus, and degrade gracefully.
2.  **Path Normalization**: On Windows platforms, filesystem watchers can emit diverse casing drive letters (`E:` vs `e:`) and path delimiters (`\` vs `/`). Always convert paths using unified helper tools:
    *   Convert drive letters to lowercase.
    *   Replace `\` delimiters with `/`.
    *   Resolve paths relative to the workspace root using `path.posix`.
3.  **Cancellation Tokens**: Any asynchronous loop (filesystem scans, token processing, AST traversals) must regularly poll `cancellationToken.throwIfCancelled()` to release processing threads immediately on cancellation signals.

---

## 7. Future Subsystems Roadmap

*   **Sprint 5: Knowledge Graph Engine (`packages/graph`)**:
    *   Maintains the semantic model cache in memory using an indexed call graph (representing symbols as nodes and relationships as edges).
    *   Supports traversing graphs to find all callers of a method, inheritance chains, and unreferenced code boundaries.
*   **Sprint 6: Context Engine (`packages/context`)**:
    *   Evaluates active file scopes to extract relevant context snippets.
    *   Ranks code files based on semantic query similarity and graph proximity to resolve LLM prompt contexts.
*   **Sprint 7: Planner Engine (`packages/planner`)**:
    *   Synthesizes execution plans (e.g. `implementation_plan.md`) matching high-level user tasks.
    *   Evaluates task constraints before initiating refactoring iterations.
