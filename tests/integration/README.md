# Integration Tests

This directory contains cross-package integration tests that exercise multiple Forge subsystems together.

## Structure

```
integration/
├── workspace-ipc.test.ts     ← IPC round-trip: renderer → main → WorkspaceService
└── ...                       ← added per epic
```

## Running

```bash
pnpm --filter @forge/desktop test
```

## End-to-End Tests (Sprint 14+)

Full E2E tests using Playwright + `@playwright/test` with Electron driver are planned for Sprint 14.
See `e2e/README.md` for setup instructions.
