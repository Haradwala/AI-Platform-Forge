# ADR-003: Strongly Typed Event Bus for Subsystem Communication

## Status
Approved

## Context
Subsystems in ForgeOS (e.g. Runtime, VFS, Memory, Parser) must interact without being tightly coupled.
Traditional event buses use string-based wildcards (e.g. `process.*`, `file.create`) which are prone to runtime bugs, spelling errors, and payload mismatches.

## Decision
We enforce a **Strongly Typed Event Bus** mapping architecture:
1.  All possible system events are defined in a central TypeScript map `SystemEventMap` inside `@forge/shared`.
2.  The Event Bus interface `IEventBus` uses generics to map event topic keys directly to their respective event structures at compile-time.
3.  Any attempt to subscribe or publish with mismatched payloads throws TypeScript compiler errors.

## Consequences
- **Pros**:
  - Eliminates class-coupling between subsystems while preserving complete compiler contract safety.
  - Easier schema maintenance: additions and deprecations are refactored instantly via TypeScript LSP.
  - Easy to map to JSON schemas for inter-process communication.
- **Cons**:
  - Adding a new event requires registering it inside the shared schema first.
