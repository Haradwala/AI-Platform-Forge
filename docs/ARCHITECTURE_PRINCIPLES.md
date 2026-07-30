# Forge IDE — Immutable Architecture Principles

This document defines the architectural constitution of the Forge platform. All future development, including extensions, features, and core updates, must strictly adhere to these rules.

---

## The Ten Core Principles

### 1. Capability-First APIs
Expose features to extensions using domain capabilities rather than exposing raw service implementations directly.

### 2. Dependency Injection
All services must register via the DI container. Circular dependencies are strictly forbidden and validated during startup pre-init checks.

### 3. State Mutation Boundaries
No UI components may directly mutate internal stores. All state transitions must run through registered commands or designated application services.

### 4. Shared Contracts Registry
All public types, events, manifests, and interfaces must live within `packages/shared/`. Everything outside this package is private internal implementation details.

### 5. Extension Context Isolation
Extensions must consume exclusively the capability-based `ExtensionContext` API. They are forbidden from resolving or referencing internal classes/services.

### 6. Strongly Typed Contracts
All event bus notifications, IPC transactions, and action triggers must be strongly typed. Raw strings are deprecated in favor of Enum declarations.

### 7. Version Compatibility Checking
Every extension manifest (`forge-extension.json`) must define strict target SDK limits (`minimumSdkVersion` and `maximumSdkVersion`) to prevent execution failures.

### 8. Security & Permissions by Default
Extensions must explicitly list all requested permissions in their manifest. Execution in non-trusted zones will refuse access to high-priority capabilities.

### 9. Platform Diagnostics & Introspection
The system must generate automatic architecture documentation graphs (`.forge/architecture/*.json`) directly from runtime registrations to avoid drift.

### 10. Separation of Platform and Runtime
The platform contract defines *what Forge is* (freezing APIs, SDK, and manifests), while the runtime defines *how Forge runs* (registry, resources, scheduler, observability).
