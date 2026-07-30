# Forge Desktop — Architecture Reference

## Overview

Forge Desktop is a thin Electron client over the Forge Runtime (packages/). It provides the native IDE shell: file explorer, Monaco editor, integrated terminal, plugin system, command palette, and theme engine. No AI orchestration logic lives in the desktop layer — all intelligence is delegated to `@forge/agent`, `@forge/ai`, and other runtime packages via the IPC bridge.

---

## Process Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                      Forge Desktop (Electron)                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Renderer Process (React + Vite)                 │  │
│  │  PluginManager → PanelRegistry → WorkspaceLayout            │  │
│  │  CommandService  │  ThemeManager  │  DesktopEventBus        │  │
│  │  Zustand Stores: layout, editor, terminal, theme, window    │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│          contextBridge (window.forge — preload script)              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Main Process (Node.js)                          │  │
│  │  StartupManager (10 stages)                                 │  │
│  │  IpcRouter → [Logger MW] → [Metrics MW] → route dispatch   │  │
│  │  WorkspaceService  │  TerminalService  │  WindowService     │  │
│  │  ThemeService  │  SessionManager  │  PerformanceMonitor     │  │
│  │  WindowRegistry (multi-window ready)                        │  │
│  └──────────────────────┬───────────────────────────────────────┘  │
│          @forge/* package imports                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Forge Runtime (Sprints 1–12)                    │  │
│  │  shared │ core │ core-runtime │ workspace │ parser          │  │
│  │  knowledge-graph │ retrieval │ context │ planner │ agent    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
apps/forge-desktop/
├── electron/
│   ├── main/          ← Node.js main process
│   ├── preload/       ← contextBridge (secure boundary)
│   └── ipc/           ← IpcRouter + all handlers
├── src/
│   ├── app/           ← React root
│   ├── plugins/       ← Plugin framework
│   ├── commands/      ← Command system + palette
│   ├── panels/        ← Explorer, Editor, Terminal, AI placeholders
│   ├── layouts/       ← WorkspaceLayout, ActivityBar, StatusBar
│   ├── stores/        ← Zustand state stores
│   ├── services/      ← Renderer-side IPC wrappers
│   ├── eventbus/      ← DesktopEventBus
│   ├── themes/        ← ThemeEngine
│   ├── logging/       ← DesktopLogger
│   ├── hooks/         ← React hooks
│   ├── components/    ← Shared UI primitives
│   ├── styles/        ← globals.css + design tokens
│   └── types/         ← Type declarations (window.forge API)
└── tests/             ← Vitest unit tests
```

---

## IPC Security Rules

1. `contextIsolation: true` — always
2. `nodeIntegration: false` — always
3. Only whitelisted channels are exposed via preload
4. Path validation in main process — no path traversal
5. File writes validated against open workspace root

---

## Sprint 13 Epic Map

See [implementation_plan.md](../../.gemini/antigravity-ide/brain/d4732de9-42c5-402e-9bfe-a5fc56f33c98/implementation_plan.md) for the full 22-epic roadmap.

| Epic | Subsystem |
|------|-----------|
| 1 | Package Bootstrap ✅ |
| 2 | Electron Main Process |
| 3 | Preload Bridge |
| 4 | IPC Router |
| 5 | Desktop DI Container |
| 6 | Startup Manager |
| 7 | Window Manager |
| 8 | Workspace Service |
| 9 | Workspace Metadata (.forge/) |
| 10 | Desktop Event Bus |
| 11 | Plugin Framework |
| 12 | Panel Registry |
| 13 | Layout System |
| 14 | Command Framework |
| 15 | Theme Engine |
| 16 | Monaco Editor |
| 17 | Terminal Integration |
| 18 | Session Manager |
| 19 | Logging Infrastructure |
| 20 | Performance Monitor |
| 21 | AI Placeholder Panels |
| 22 | End-to-End Integration |
