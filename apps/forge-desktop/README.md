# Forge Desktop

The Forge Desktop application — a native IDE shell built on Electron + React, powered by the Forge Runtime (Sprints 1–12).

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development (Vite dev server + Electron)
pnpm --filter @forge/desktop dev

# Run tests
pnpm --filter @forge/desktop test

# Build production renderer + Electron main
pnpm --filter @forge/desktop build

# Package distributable
pnpm --filter @forge/desktop package
```

## If node-pty fails to compile (Windows)

```powershell
# From monorepo root:
./scripts/rebuild-native.ps1
```

## Sprint 13 Epics

| # | Epic | Status |
|---|------|--------|
| 1 | Package Bootstrap | ✅ |
| 2–22 | See `Architecture.md` | 🔄 |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | Electron 31 |
| UI framework | React 18 |
| Build tool | Vite 5 |
| Styling | TailwindCSS v3 |
| State | Zustand 4 |
| Editor | Monaco Editor |
| Terminal | xterm.js + node-pty |
| File watching | Chokidar 3 |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |
