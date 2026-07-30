# Forge CLI

Command-line interface for the Forge AI IDE Platform.

> **Sprint 13**: Package scaffold only. Full implementation in Sprint 14.

## Planned Commands (Sprint 14)

```bash
forge open <path>          # Open a workspace in Forge Desktop
forge run <task>           # Run an AI coding task headlessly
forge agent "<prompt>"     # Invoke the autonomous agent
forge status               # Show current workspace status
```

## Development

```bash
pnpm --filter @forge/cli build
pnpm --filter @forge/cli dev
```
