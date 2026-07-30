# Cleanup Audit

Generated: 2026-07-23T13:50:27.941Z

## Scope And Method

- Audit-only pass; no source files were edited, deleted, or merged. The only repo write is this report.
- Detailed graph excludes `.git`, `node_modules`, `.turbo`, `release`, `.vite`, and `coverage`; generated `dist-electron` files and `tsconfig.tsbuildinfo` are listed as generated-output findings, not treated as source dependencies.
- `node_modules/.bin` contains `tsc` only; `madge`, `ts-prune`, and `depcheck` are not installed. Install with `pnpm add -D madge ts-prune depcheck` for tool-confirmed graph/unused/dependency checks.
- Indexed 1219 files total: 528 source/config/doc/assets and 691 generated/build-cache files.
- Source import graph covers 483 TS/JS source files.
- The worktree is dirty; deleted legacy packages visible in `git status` are treated as already removed from the current filesystem.

## Module Summary

| Module | Files | Source Code Files | Generated Files |
|---|---:|---:|---:|
| Assets | 1 | 0 | 0 |
| Changesets | 1 | 0 | 0 |
| Desktop App Config/Docs | 112 | 4 | 96 |
| Desktop Composition Modules | 10 | 10 | 0 |
| Desktop Configuration | 6 | 6 | 0 |
| Desktop DI Container | 7 | 7 | 0 |
| Desktop Electron AI | 199 | 199 | 0 |
| Desktop Electron Main | 15 | 15 | 0 |
| Desktop IPC | 10 | 10 | 0 |
| Desktop Platform | 25 | 25 | 0 |
| Desktop Preload | 1 | 1 | 0 |
| Desktop Tests | 77 | 77 | 0 |
| Documentation | 6 | 0 | 0 |
| Forge CLI | 5 | 1 | 1 |
| Generated Electron Build Output | 525 | 0 | 525 |
| Git Hooks | 2 | 0 | 0 |
| Renderer Actions UI | 4 | 4 | 0 |
| Renderer Agent UI | 21 | 21 | 0 |
| Renderer App Shell | 15 | 14 | 0 |
| Renderer Components | 12 | 12 | 0 |
| Renderer Editor UI | 5 | 5 | 0 |
| Renderer Layout | 7 | 7 | 0 |
| Renderer Panels | 4 | 4 | 0 |
| Renderer Plugin System | 6 | 6 | 0 |
| Renderer Runtime UI | 7 | 7 | 0 |
| Renderer Services | 8 | 8 | 0 |
| Renderer State Stores | 14 | 14 | 0 |
| Renderer Themes | 6 | 4 | 0 |
| Renderer Workspace UI | 4 | 4 | 0 |
| Repo-Level Tests | 1 | 0 | 0 |
| Repository Root Config/Docs | 13 | 1 | 0 |
| Scripts | 2 | 0 | 0 |
| Shared Domain Models | 12 | 12 | 0 |
| Shared Event Contracts | 2 | 2 | 0 |
| Shared Extension SDK | 1 | 1 | 0 |
| Shared Package Config | 72 | 1 | 69 |
| Shared Permissions | 1 | 1 | 0 |

## Project Map

### Assets

| File | Purpose | Size / Complexity |
|---|---|---|
| assets/icons/README.md | Project documentation or architecture notes. | 25 LOC small |

### Changesets

| File | Purpose | Size / Complexity |
|---|---|---|
| .changeset/config.json | Tooling/build/test configuration. | 12 LOC small |

### Desktop App Config/Docs

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/.forge/config.json | Tooling/build/test configuration. | 37 LOC small |
| apps/forge-desktop/.forge/learning/experiences.json | Source or support file for this module. | 16 LOC small |
| apps/forge-desktop/.forge/learning/report.json | Source or support file for this module. | 11 LOC small |
| apps/forge-desktop/.forge/outcome/decisions.json | Source or support file for this module. | 1 LOC small |
| apps/forge-desktop/.forge/outcome/experience.json | Source or support file for this module. | 14 LOC small |
| apps/forge-desktop/Architecture.md | Project documentation or architecture notes. | 107 LOC medium |
| apps/forge-desktop/dist/assets/abap-DRC6TkPh.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/apex-BuapDI9Y.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/azcli-BypH-vXm.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/bat-BY6pwuIY.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/bicep-gRuQeaLk.js | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist/assets/cameligo-ul-Lp4lw.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/clojure-DeYg-96x.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/codicon-DCmgc-ay.ttf | Generated build/cache artifact; should be derived from source. | 79 KB asset/binary |
| apps/forge-desktop/dist/assets/coffee-CfnpWUYo.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/cpp-C9L3yaDO.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/csharp-DWGz5Zuj.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/csp-DrRCxMg5.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/css-BfLuTCmN.js | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist/assets/css.worker-OLHeWoTq.js | Generated build/cache artifact; should be derived from source. | 84 LOC medium |
| apps/forge-desktop/dist/assets/cssMode-7YdAyufD.js | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist/assets/cypher-DoFvH58O.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/dart-DIovg4uR.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/dockerfile-D2PfwrvU.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/ecl-C_scCXcs.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/editor.worker-Z-F9bRfX.js | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist/assets/elixir-BRk-K-rg.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/flow9-DLs3tTet.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/freemarker2-p-ZSBls-.js | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist/assets/fsharp-D0UiDa5C.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/go-CyVeKkvQ.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/graphql-BygKL3ZF.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/handlebars-YvMtd37W.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/hcl-D_OY6ada.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/html-wy8XKnCz.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/html.worker-D8j6VKtw.js | Generated build/cache artifact; should be derived from source. | 461 LOC very large |
| apps/forge-desktop/dist/assets/htmlMode-CPqojPt6.js | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist/assets/index--vDUsUbt.css | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| apps/forge-desktop/dist/assets/index-Bv7YlcIt.js | Generated build/cache artifact; should be derived from source. | 7463 LOC very large |
| apps/forge-desktop/dist/assets/ini-BTpWsGps.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/java-3TATJI7h.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/javascript-Ul8sUHRG.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/json.worker-aYIWSs1k.js | Generated build/cache artifact; should be derived from source. | 49 LOC medium |
| apps/forge-desktop/dist/assets/jsonMode-DkB-A5Tl.js | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist/assets/julia-DDpSJMW6.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/kotlin-DVYH6Lj_.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/less-CuFlys0T.js | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist/assets/lexon-m09vb5r-.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/liquid-BpRozXAE.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/lua-D2Z7JJdl.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/m3-B2Cf9XSq.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/markdown-BXYnMxBe.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/mdx-DJ6AemiX.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/mips-Ckkbw-AO.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/monaco-BEepC2D7.css | Generated build/cache artifact; should be derived from source. | 2 LOC small |
| apps/forge-desktop/dist/assets/monaco-BYShpLcS.js | Generated build/cache artifact; should be derived from source. | 731 LOC very large |
| apps/forge-desktop/dist/assets/msdax-B5uW3Zvf.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/mysql-B8ssZoUh.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/objective-c-CrrKwR0a.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/pascal-BWBTHuhh.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/pascaligo-BGLI1Hdo.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/perl-DDrv2Hr-.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/pgsql-DLPipH_Q.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/php-CTNlIIiR.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/pla-2oJWbEOo.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/postiats-DOk3G3cc.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/powerquery-Dgyr3wWZ.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/powershell-B_i9asfM.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/protobuf-CV9EbfTh.js | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist/assets/pug-CCBS_C5_.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/python-rFofIGc5.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/qsharp-BLuZWbUW.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/r-CzF1MCbP.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/razor-DDkYhtV9.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/redis-C75U4IDy.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/redshift-Bc5xkKR1.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/restructuredtext-DmdQbaLT.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/ruby-DB0RB20n.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/rust-UMmp-gVE.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/sb-DVG02705.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/scala-DvSxYeG4.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/scheme-yf5bffbF.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/scss-Bzb7OGdO.js | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist/assets/shell-FNqbgIOG.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/solidity-DyKutqhl.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/sophia-B4VqtPa2.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/sparql-B7alP455.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/sql-D7lU1fdU.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/st-VuadG5SK.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/swift-BYtUz8ZP.js | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist/assets/systemverilog-DOAuugfS.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/tcl-CXKOl_mN.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/ts.worker-CIbuYjqZ.js | Generated build/cache artifact; should be derived from source. | 51334 LOC very large |
| apps/forge-desktop/dist/assets/tsMode-Lkaliba_.js | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist/assets/twig-D9yiNO04.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/typescript-FFWCfpIr.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/typespec-BupSXVCO.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/vb-ZlaFEk-P.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/wgsl-B-lZjTdr.js | Generated build/cache artifact; should be derived from source. | 304 LOC large |
| apps/forge-desktop/dist/assets/xml-BrfPwJ7m.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/assets/yaml-Buw-G4bZ.js | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist/index.html | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/electron-builder.yml | Source or support file for this module. | 49 LOC medium |
| apps/forge-desktop/index.html | Source or support file for this module. | 24 LOC small |
| apps/forge-desktop/package.json | Package manifest and scripts/dependencies. | 69 LOC medium |
| apps/forge-desktop/postcss.config.cjs | Tooling/build/test configuration. | 8 LOC small |
| apps/forge-desktop/README.md | Project documentation or architecture notes. | 52 LOC medium |
| apps/forge-desktop/tailwind.config.cjs | Tooling/build/test configuration. | 38 LOC small |
| apps/forge-desktop/tsconfig.electron.json | Tooling/build/test configuration. | 20 LOC small |
| apps/forge-desktop/tsconfig.json | Tooling/build/test configuration. | 22 LOC small |
| apps/forge-desktop/vite.config.ts | Tooling/build/test configuration. | 38 LOC small |
| apps/forge-desktop/vitest.config.ts | Tooling/build/test configuration. | 26 LOC small |

### Desktop Composition Modules

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/modules/ai.module.ts | Exports AiModule. | 1220 LOC very large |
| apps/forge-desktop/electron/main/modules/core.module.ts | Exports CoreModule. | 71 LOC medium |
| apps/forge-desktop/electron/main/modules/ipc.module.ts | Exports IpcModule. | 39 LOC small |
| apps/forge-desktop/electron/main/modules/performance.module.ts | Exports PerformanceModule. | 21 LOC small |
| apps/forge-desktop/electron/main/modules/session.module.ts | Exports SessionModule. | 24 LOC small |
| apps/forge-desktop/electron/main/modules/startup.module.ts | Exports StartupModule. | 55 LOC medium |
| apps/forge-desktop/electron/main/modules/terminal.module.ts | Exports TerminalModule. | 24 LOC small |
| apps/forge-desktop/electron/main/modules/theme.module.ts | Exports ThemeModule. | 21 LOC small |
| apps/forge-desktop/electron/main/modules/window.module.ts | Exports WindowModule. | 40 LOC medium |
| apps/forge-desktop/electron/main/modules/workspace.module.ts | Exports WorkspaceModule. | 31 LOC small |

### Desktop Configuration

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/config/configuration-loader.ts | Tooling/build/test configuration. | 76 LOC medium |
| apps/forge-desktop/electron/main/config/configuration-schema.ts | Tooling/build/test configuration. | 70 LOC medium |
| apps/forge-desktop/electron/main/config/configuration-service.ts | Tooling/build/test configuration. | 87 LOC medium |
| apps/forge-desktop/electron/main/config/configuration-store.ts | Tooling/build/test configuration. | 73 LOC medium |
| apps/forge-desktop/electron/main/config/configuration-validator.ts | Tooling/build/test configuration. | 70 LOC medium |
| apps/forge-desktop/electron/main/config/index.ts | Exports createDefaultConfig, validateConfig, ConfigurationStore, .... | 13 LOC small |

### Desktop DI Container

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/container/desktop-container.ts | Exports DesktopContainer. | 881 LOC very large |
| apps/forge-desktop/electron/main/container/errors.ts | Exports ContainerError, CircularDependencyError, MissingDependencyError, .... | 127 LOC medium |
| apps/forge-desktop/electron/main/container/graph-exporter.ts | Exports exportJson, exportMermaid, exportDot. | 132 LOC medium |
| apps/forge-desktop/electron/main/container/interfaces.ts | Shared TypeScript contracts/interfaces. | 269 LOC large |
| apps/forge-desktop/electron/main/container/service-interfaces.ts | Service layer implementation. | 565 LOC very large |
| apps/forge-desktop/electron/main/container/service-scope.ts | Service layer implementation. | 104 LOC medium |
| apps/forge-desktop/electron/main/container/tokens.ts | Exports KnownToken, T. | 165 LOC large |

### Desktop Electron AI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/ai/actions/action-events.ts | Exports ActionEventEmitter. | 29 LOC small |
| apps/forge-desktop/electron/main/ai/actions/action-executor.ts | Exports ActionExecutor. | 155 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/action-history.ts | Exports ActionHistory, ActionHistoryEntry. | 122 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/action-registry.ts | Registry for pluggable subsystem entries. | 49 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/action-types.ts | Shared TypeScript contracts/interfaces. | 74 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/action-validator.ts | Exports ActionValidator, ActionValidationResult. | 41 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts | Exports ActionMiddlewarePipeline. | 32 LOC small |
| apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts | Exports ApprovalMiddleware. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts | Exports AuditMiddleware. | 20 LOC small |
| apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts | Exports LoggerMiddleware. | 29 LOC small |
| apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts | Exports PermissionMiddleware. | 27 LOC small |
| apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts | Exports CoreActionProvider. | 511 LOC very large |
| apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts | Exports GitActionProvider. | 116 LOC medium |
| apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts | Exports UIActionProvider. | 94 LOC medium |
| apps/forge-desktop/electron/main/ai/agent/agent-loop.ts | Exports AgentLoop, AgentStep, AgentResult, .... | 328 LOC large |
| apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts | Exports CLIAdapter. | 57 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts | Exports CLICapabilities, createCapabilities. | 35 LOC small |
| apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts | Exports CLIDiscovery, DiscoveredCLIResult, CLIAgentStatus. | 125 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | Exports CLIError, DiscoveryError, LaunchError, .... | 41 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-manager.ts | Coordinator/manager for related subsystem state. | 64 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-process.ts | Exports CLIProcess. | 136 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts | Exports GenericCLIRuntime. | 173 LOC large |
| apps/forge-desktop/electron/main/ai/cli/cli-session.ts | Exports CLISession, CLIGenericSession, CLIToolCallRecord. | 135 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-stream.ts | Exports CLIStream. | 53 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/cli-types.ts | Shared TypeScript contracts/interfaces. | 28 LOC small |
| apps/forge-desktop/electron/main/ai/cli/index.ts | Source or support file for this module. | 20 LOC small |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts | Exports AdapterDiagnostics, DiagnosticCheckResult, AdapterDiagnosticsReport. | 98 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-discovery.ts | Exports AdapterDiscovery, DiscoveredAdapterPath. | 89 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts | Exports AdapterLoader. | 54 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts | Exports AdapterManifest. | 27 LOC small |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts | Exports PermissionChecker, AdapterPermission, ALL_ADAPTER_PERMISSIONS. | 47 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts | Registry for pluggable subsystem entries. | 128 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts | Exports AdapterSDK, AdapterBuilderOptions. | 68 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts | Exports AdapterValidator, AdapterValidationReport. | 80 LOC medium |
| apps/forge-desktop/electron/main/ai/cli/sdk/index.ts | Source or support file for this module. | 16 LOC small |
| apps/forge-desktop/electron/main/ai/code-intelligence/ast-parser.ts | Exports ASTParser, ParsedImport, ParsedExport, .... | 364 LOC large |
| apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts | Exports CallGraph, CallEdge. | 103 LOC medium |
| apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts | Core engine implementing subsystem workflow logic. | 224 LOC large |
| apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts | Exports DependencyGraph. | 77 LOC medium |
| apps/forge-desktop/electron/main/ai/code-intelligence/repository-scanner.ts | Exports RepositoryScanner, ScannedFile, ScannedPackage. | 113 LOC medium |
| apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts | Exports SemanticSearch. | 67 LOC medium |
| apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts | Exports SymbolIndex, SymbolDeclaration, SymbolReference, .... | 112 LOC medium |
| apps/forge-desktop/electron/main/ai/context/context-budget.ts | Exports ContextBudget, BudgetResult. | 61 LOC medium |
| apps/forge-desktop/electron/main/ai/context/context-collectors.ts | Exports WorkspaceCollector, RepositoryCollector, EditorCollector, .... | 141 LOC medium |
| apps/forge-desktop/electron/main/ai/context/context-engine.ts | Core engine implementing subsystem workflow logic. | 148 LOC medium |
| apps/forge-desktop/electron/main/ai/context/context-package.ts | Exports IContextItem, IAiContextPackage, ITaskNode. | 30 LOC small |
| apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts | Service layer implementation. | 14 LOC small |
| apps/forge-desktop/electron/main/ai/context/context-selector.ts | Exports ContextSelector, ScoredContextItem, SelectionOptions. | 126 LOC medium |
| apps/forge-desktop/electron/main/ai/context/context-sources.ts | Exports UserGoalSource, ActiveEditorSource, OpenTabsSource, .... | 211 LOC large |
| apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts | Exports ContextSufficiencyChecker, IContextSufficiency. | 36 LOC small |
| apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts | Core engine implementing subsystem workflow logic. | 112 LOC medium |
| apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts | Exports PromptNormalizer. | 30 LOC small |
| apps/forge-desktop/electron/main/ai/context/repository-indexer.ts | Exports RepositoryIndexer, IndexedSymbol, IndexedFile. | 123 LOC medium |
| apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts | Coordinator/manager for related subsystem state. | 42 LOC medium |
| apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | Exports ExecutionRequest, ExecutionResult, WorkspaceProfile, .... | 81 LOC medium |
| apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts | Service layer implementation. | 88 LOC medium |
| apps/forge-desktop/electron/main/ai/errors/planning-errors.ts | Exports ForgeError, PlanningError, ValidationError, .... | 89 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-budget.ts | Exports ExecutionBudgetTracker. | 79 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-context.ts | Exports ExecutionContextFactory. | 28 LOC small |
| apps/forge-desktop/electron/main/ai/execution/execution-engine.ts | Core engine implementing subsystem workflow logic. | 130 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-events.ts | Exports BaseExecutionEvent, ExecutionQueuedEvent, ExecutionStartedEvent, .... | 78 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts | Core engine implementing subsystem workflow logic. | 90 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-metrics.ts | Exports ExecutionMetricsService, ITaskMetric. | 62 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-observer.ts | Exports ExecutionObserver, ExecutionObserverCallback. | 29 LOC small |
| apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts | Registry for pluggable subsystem entries. | 54 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts | Exports ExponentialRetry, LinearRetry, ExecutionScheduler. | 192 LOC large |
| apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts | Service layer implementation. | 47 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-state-machine.ts | Exports ExecutionStateMachine. | 47 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/execution-types.ts | Shared TypeScript contracts/interfaces. | 95 LOC medium |
| apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts | Exports TaskDispatcher. | 71 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-environment.ts | Exports ExternalEnvironment. | 96 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-process.ts | Exports ExternalProcess. | 98 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts | Coordinator/manager for related subsystem state. | 68 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-runtime.ts | Exports ExternalRuntime. | 218 LOC large |
| apps/forge-desktop/electron/main/ai/external/external-session.ts | Exports ExternalSession. | 66 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts | Exports ExternalStreamParser. | 116 LOC medium |
| apps/forge-desktop/electron/main/ai/external/external-types.ts | Shared TypeScript contracts/interfaces. | 61 LOC medium |
| apps/forge-desktop/electron/main/ai/external/index.ts | Source or support file for this module. | 14 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | Core engine implementing subsystem workflow logic. | 361 LOC large |
| apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts | Exports IncrementalIndexer. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts | Exports ArchitectureProvider, ArchitectureTopology. | 50 LOC medium |
| apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts | Exports DeadCodeProvider, DeadCodeReport. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts | Exports DependencyProvider, DependencyGraph. | 32 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts | Exports GitProvider, GitMetadata. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts | Exports SymbolProvider, SymbolEntry. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts | Exports TestProvider, TestSuiteStats. | 22 LOC small |
| apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts | Exports TodoProvider, TodoItem. | 23 LOC small |
| apps/forge-desktop/electron/main/ai/kernel/ai-kernel.ts | Exports AiKernel. | 108 LOC medium |
| apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts | Exports SemanticKnowledgeBuilder, ISemanticLink. | 42 LOC medium |
| apps/forge-desktop/electron/main/ai/learning/learning-engine.ts | Core engine implementing subsystem workflow logic. | 247 LOC large |
| apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts | Core engine implementing subsystem workflow logic. | 114 LOC medium |
| apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts | Exports MCPClient, MCPToolDefinition, MCPResource. | 96 LOC medium |
| apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts | Exports MCPResourceAdapter. | 39 LOC small |
| apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts | Exports MCPRuntime, IMCPRuntime. | 210 LOC large |
| apps/forge-desktop/electron/main/ai/mcp/mcp-server.ts | Exports MCPServerState, MCPServerConfig, MCPHealth, .... | 51 LOC medium |
| apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts | Exports MCPToolAdapter. | 60 LOC medium |
| apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts | Exports MockMCPTransport, JSONRPCRequest, JSONRPCResponse, .... | 123 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts | Exports MemoryConsolidator. | 66 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-engine.ts | Core engine implementing subsystem workflow logic. | 105 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts | Exports MemoryIndexer. | 71 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-registry.ts | Registry for pluggable subsystem entries. | 55 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts | Exports MemoryRetriever. | 94 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-store.ts | Zustand state store or state helper. | 63 LOC medium |
| apps/forge-desktop/electron/main/ai/memory/memory-types.ts | Shared TypeScript contracts/interfaces. | 55 LOC medium |
| apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts | Exports ExecutionOrchestrator, OrchestrationRequest, OrchestrationResult, .... | 274 LOC large |
| apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts | Exports AiOrchestrator, IAiRequest. | 140 LOC medium |
| apps/forge-desktop/electron/main/ai/outcome/decision-log.ts | Exports DecisionLog, IDecisionLogEntry. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts | Exports ExperienceBuilder. | 21 LOC small |
| apps/forge-desktop/electron/main/ai/outcome/outcome-events.ts | Exports OutcomeEvent. | 6 LOC small |
| apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts | Coordinator/manager for related subsystem state. | 68 LOC medium |
| apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts | Shared TypeScript contracts/interfaces. | 27 LOC small |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts | Exports PipelineContextHelper, PipelineTimelineEntry, PipelineContext. | 69 LOC medium |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts | Exports PipelineExecutor. | 132 LOC medium |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts | Exports PipelineRecorder. | 39 LOC small |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts | Exports ContextCollectionStage, MemoryRetrievalStage, RepositoryScanStage, .... | 388 LOC large |
| apps/forge-desktop/electron/main/ai/planner/dependency-resolver.ts | Exports DependencyResolver, IDependencyRelation. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/planner/execution-planner.ts | Exports ExecutionPlanner, IExecutionStrategy, ExecutionStrategyType. | 49 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts | Exports GoalExtractor, IGoal. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/intent-detector.ts | Exports IntentDetector, IIntent. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts | Exports PlanApprovalPolicy, ApprovalAction. | 16 LOC small |
| apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts | Exports PlanScorer, IPlanScore. | 41 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/plan-validator.ts | Exports PlanValidator, IValidationResult. | 64 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/planner.ts | Exports TaskPlanner, Calculator. | 65 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/planning-graph.ts | Exports PlanningGraph, GraphNode. | 147 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/task-planner.ts | Exports GoalTaskPlanner, ITaskGraph. | 61 LOC medium |
| apps/forge-desktop/electron/main/ai/planner/tool-selector.ts | Exports ToolSelector. | 28 LOC small |
| apps/forge-desktop/electron/main/ai/providers/mock-provider.ts | Exports MockProvider. | 63 LOC medium |
| apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts | Exports OllamaProvider. | 183 LOC large |
| apps/forge-desktop/electron/main/ai/providers/token-stream.ts | Exports AiTokenStream. | 46 LOC medium |
| apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts | Core engine implementing subsystem workflow logic. | 162 LOC large |
| apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts | Exports FailureAnalyzer, IFailureAnalysis. | 61 LOC medium |
| apps/forge-desktop/electron/main/ai/recovery/recovery-events.ts | Exports RecoveryEvent. | 15 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts | Exports RecoveryExecutor. | 17 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/recovery-journal.ts | Exports RecoveryJournal, RecoveryAttemptLog. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/recovery/recovery-metrics.ts | Exports RecoveryMetrics. | 29 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts | Exports RecoveryOrchestrator. | 115 LOC medium |
| apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts | Core engine implementing subsystem workflow logic. | 39 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts | Registry for pluggable subsystem entries. | 25 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts | Shared TypeScript contracts/interfaces. | 39 LOC small |
| apps/forge-desktop/electron/main/ai/recovery/rollback-manager.ts | Coordinator/manager for related subsystem state. | 22 LOC small |
| apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | Core engine implementing subsystem workflow logic. | 227 LOC large |
| apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts | Exports CapabilityMatcher, RuntimeCandidateInfo. | 46 LOC medium |
| apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts | Exports IntentAnalyzer. | 87 LOC medium |
| apps/forge-desktop/electron/main/ai/routing/runtime-router.ts | Exports RuntimeRouter, IRuntimeExecutionHandler. | 107 LOC medium |
| apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts | Exports RuntimeScorer, ScoredRuntimeCandidate. | 89 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts | Exports EnvironmentDoctor, EnvironmentIssue, EnvironmentVariableStatus, .... | 165 LOC large |
| apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts | Source or support file for this module. | 14 LOC small |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts | Exports RuntimeCache, CacheEntry. | 54 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts | Tooling/build/test configuration. | 89 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts | Exports RuntimeDetector, DetectionResult. | 343 LOC large |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts | Core engine implementing subsystem workflow logic. | 207 LOC large |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts | Exports RuntimeEvents, RuntimeDiscoveryEventType. | 40 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts | Exports RuntimeHealthChecker, HealthCheckResult. | 277 LOC large |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts | Shared TypeScript contracts/interfaces. | 55 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts | Exports RuntimeValidator, ValidationResult, EnvValidationResult. | 118 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts | Exports AiderCLIRuntime. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts | Exports ClaudeCodeRuntime. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts | Exports BaseCLIRuntime. | 139 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts | Exports CodexCLIRuntime. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts | Exports GeminiCLIRuntime. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts | Exports GooseCLIRuntime. | 24 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts | Exports AnthropicRuntime. | 163 LOC large |
| apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts | Exports OpenAICompatibleRuntime, extractOpenAIToken, extractAnthropicToken, .... | 392 LOC large |
| apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts | Exports GeminiRuntime. | 181 LOC large |
| apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts | Exports GroqRuntime. | 32 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts | Exports OpenAIRuntime. | 35 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts | Exports OpenRouterRuntime. | 41 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/index.ts | Exports RuntimeManager, OpenAICompatibleRuntime, OpenAIRuntime, .... | 22 LOC small |
| apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts | Exports RuntimeEventBus, NormalizedRuntimeExecutionEvent, NormalizedRuntimeEventType. | 52 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts | Coordinator/manager for related subsystem state. | 276 LOC large |
| apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts | Coordinator/manager for related subsystem state. | 172 LOC large |
| apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts | Exports RuntimeSessionStateMachine, RuntimeSessionState. | 52 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts | Exports JsonSessionStorage, RuntimeNegotiatedCapabilities, RuntimeSessionData, .... | 114 LOC medium |
| apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts | Shared TypeScript contracts/interfaces. | 133 LOC medium |
| apps/forge-desktop/electron/main/ai/session/ai-session-service.ts | Service layer implementation. | 132 LOC medium |
| apps/forge-desktop/electron/main/ai/session/conversation-manager.ts | Coordinator/manager for related subsystem state. | 43 LOC medium |
| apps/forge-desktop/electron/main/ai/session/provider-registry.ts | Registry for pluggable subsystem entries. | 13 LOC small |
| apps/forge-desktop/electron/main/ai/session/workspace-profile.ts | Exports WorkspaceProfileManager. | 71 LOC medium |
| apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts | Coordinator/manager for related subsystem state. | 75 LOC medium |
| apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts | Exports ReadFileTool, WriteFileTool, ListDirectoryTool, .... | 274 LOC large |
| apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts | Core engine implementing subsystem workflow logic. | 199 LOC large |
| apps/forge-desktop/electron/main/ai/tools/tool-registry.ts | Registry for pluggable subsystem entries. | 31 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts | Exports CompilationVerifier. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts | Exports FormattingChecker. | 39 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts | Exports LintVerifier. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts | Exports PerformanceChecker. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts | Exports RepositoryRules. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts | Exports SecurityScanner. | 34 LOC small |
| apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts | Exports TestRunner. | 37 LOC small |
| apps/forge-desktop/electron/main/ai/verification/verification-engine.ts | Core engine implementing subsystem workflow logic. | 27 LOC small |
| apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts | Exports VerificationMetrics. | 33 LOC small |
| apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts | Exports VerificationPipeline. | 247 LOC large |
| apps/forge-desktop/electron/main/ai/verification/verification-types.ts | Shared TypeScript contracts/interfaces. | 79 LOC medium |
| apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts | Core engine implementing subsystem workflow logic. | 156 LOC medium |
| apps/forge-desktop/electron/main/ai/workspace/file-operations.ts | Exports FileOperations. | 97 LOC medium |
| apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts | Core engine implementing subsystem workflow logic. | 147 LOC medium |
| apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts | Exports WorkspaceDiff, FileDiffItem, WorkspaceDiffReport. | 103 LOC medium |
| apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts | Core engine implementing subsystem workflow logic. | 97 LOC medium |
| apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts | Exports WorkspaceSnapshot, SnapshotState. | 72 LOC medium |

### Desktop Electron Main

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/index.ts | Source or support file for this module. | 88 LOC medium |
| apps/forge-desktop/electron/main/logging/console-sink.ts | Exports ConsoleSink. | 34 LOC small |
| apps/forge-desktop/electron/main/logging/desktop-logger.ts | Exports DesktopLogger. | 96 LOC medium |
| apps/forge-desktop/electron/main/logging/file-sink.ts | Exports FileSink. | 88 LOC medium |
| apps/forge-desktop/electron/main/logging/interfaces.ts | Shared TypeScript contracts/interfaces. | 35 LOC small |
| apps/forge-desktop/electron/main/performance-monitor.ts | Exports PerformanceMonitor, default. | 43 LOC medium |
| apps/forge-desktop/electron/main/session-manager.ts | Coordinator/manager for related subsystem state. | 93 LOC medium |
| apps/forge-desktop/electron/main/startup-manager.ts | Coordinator/manager for related subsystem state. | 330 LOC large |
| apps/forge-desktop/electron/main/terminal-service.ts | Service layer implementation. | 118 LOC medium |
| apps/forge-desktop/electron/main/theme-service.ts | Service layer implementation. | 26 LOC small |
| apps/forge-desktop/electron/main/window-manager.ts | Coordinator/manager for related subsystem state. | 152 LOC medium |
| apps/forge-desktop/electron/main/window-registry.ts | Registry for pluggable subsystem entries. | 59 LOC medium |
| apps/forge-desktop/electron/main/window-service.ts | Service layer implementation. | 272 LOC large |
| apps/forge-desktop/electron/main/workspace-metadata.ts | Exports WorkspaceMetadata, IWorkspaceConfig. | 128 LOC medium |
| apps/forge-desktop/electron/main/workspace-service.ts | Service layer implementation. | 255 LOC large |

### Desktop IPC

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts | Exports registerAiHandlers. | 324 LOC large |
| apps/forge-desktop/electron/ipc/handlers/session-handlers.ts | Exports registerSessionHandlers. | 25 LOC small |
| apps/forge-desktop/electron/ipc/handlers/system-handlers.ts | Exports registerSystemHandlers, default. | 47 LOC medium |
| apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts | Exports registerTerminalHandlers. | 87 LOC medium |
| apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts | Exports registerThemeHandlers. | 26 LOC small |
| apps/forge-desktop/electron/ipc/handlers/window-handlers.ts | Exports registerWindowHandlers. | 28 LOC small |
| apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts | Exports registerWorkspaceHandlers. | 94 LOC medium |
| apps/forge-desktop/electron/ipc/interfaces.ts | Shared TypeScript contracts/interfaces. | 40 LOC medium |
| apps/forge-desktop/electron/ipc/ipc-middleware.ts | Exports LoggerMiddleware, MetricsMiddleware. | 61 LOC medium |
| apps/forge-desktop/electron/ipc/ipc-router.ts | Exports IpcRouter. | 134 LOC medium |

### Desktop Platform

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/main/platform/architecture-validator.ts | Exports ArchitectureValidator, ArchitectureReport. | 125 LOC medium |
| apps/forge-desktop/electron/main/platform/background-scheduler.ts | Exports BackgroundScheduler, IJob, JobPriority, .... | 104 LOC medium |
| apps/forge-desktop/electron/main/platform/dependency-graph.ts | Exports DependencyGraphService. | 98 LOC medium |
| apps/forge-desktop/electron/main/platform/feature-registry.ts | Registry for pluggable subsystem entries. | 71 LOC medium |
| apps/forge-desktop/electron/main/platform/incremental-indexer.ts | Exports IncrementalIndexerService. | 38 LOC small |
| apps/forge-desktop/electron/main/platform/internal-platform.ts | Exports InternalPlatform. | 17 LOC small |
| apps/forge-desktop/electron/main/platform/lifecycle-manager.ts | Coordinator/manager for related subsystem state. | 81 LOC medium |
| apps/forge-desktop/electron/main/platform/observability.ts | Exports Observability. | 56 LOC medium |
| apps/forge-desktop/electron/main/platform/platform-inspector-service.ts | Service layer implementation. | 162 LOC large |
| apps/forge-desktop/electron/main/platform/platform-recovery-service.ts | Service layer implementation. | 69 LOC medium |
| apps/forge-desktop/electron/main/platform/regex-parser.ts | Exports RegexParser. | 219 LOC large |
| apps/forge-desktop/electron/main/platform/repository-analyzer.ts | Exports RepositoryAnalyzer, ComprehensiveProjectAnalysis. | 136 LOC medium |
| apps/forge-desktop/electron/main/platform/repository-diagnostics.ts | Exports RepositoryDiagnosticsService. | 58 LOC medium |
| apps/forge-desktop/electron/main/platform/repository-events.ts | Exports RepositoryEventService. | 21 LOC small |
| apps/forge-desktop/electron/main/platform/repository-importer.ts | Exports RepositoryImporter, ImportResult. | 104 LOC medium |
| apps/forge-desktop/electron/main/platform/repository-intelligence.ts | Exports RepositoryIntelligenceEngine. | 187 LOC large |
| apps/forge-desktop/electron/main/platform/repository-search.ts | Exports RepositorySearchService. | 38 LOC small |
| apps/forge-desktop/electron/main/platform/repository-types.ts | Shared TypeScript contracts/interfaces. | 72 LOC medium |
| apps/forge-desktop/electron/main/platform/resource-manager.ts | Coordinator/manager for related subsystem state. | 64 LOC medium |
| apps/forge-desktop/electron/main/platform/runtime-health-service.ts | Service layer implementation. | 42 LOC medium |
| apps/forge-desktop/electron/main/platform/runtime-kernel.ts | Exports RuntimeKernel. | 93 LOC medium |
| apps/forge-desktop/electron/main/platform/runtime-registry.ts | Registry for pluggable subsystem entries. | 60 LOC medium |
| apps/forge-desktop/electron/main/platform/runtime-service.ts | Service layer implementation. | 14 LOC small |
| apps/forge-desktop/electron/main/platform/symbol-index.ts | Exports SymbolIndexService. | 48 LOC medium |
| apps/forge-desktop/electron/main/platform/workspace-discovery.ts | Exports WorkspaceDiscoveryService, IProjectMetadata, IWorkspaceManifest. | 113 LOC medium |

### Desktop Preload

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/electron/preload/index.ts | Source or support file for this module. | 229 LOC large |

### Desktop Tests

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/tests/action-system.test.ts | Automated test coverage for adjacent module behavior. | 158 LOC medium |
| apps/forge-desktop/tests/agent-loop.test.ts | Automated test coverage for adjacent module behavior. | 225 LOC large |
| apps/forge-desktop/tests/ai-foundation.test.ts | Automated test coverage for adjacent module behavior. | 189 LOC large |
| apps/forge-desktop/tests/ai-intelligence-foundation.test.ts | Automated test coverage for adjacent module behavior. | 108 LOC medium |
| apps/forge-desktop/tests/ai-orchestrator.test.ts | Automated test coverage for adjacent module behavior. | 104 LOC medium |
| apps/forge-desktop/tests/ai-planning-reasoning.test.ts | Automated test coverage for adjacent module behavior. | 119 LOC medium |
| apps/forge-desktop/tests/architecture-validator.test.ts | Automated test coverage for adjacent module behavior. | 126 LOC medium |
| apps/forge-desktop/tests/background-scheduler.test.ts | Automated test coverage for adjacent module behavior. | 70 LOC medium |
| apps/forge-desktop/tests/bootstrap.test.ts | Automated test coverage for adjacent module behavior. | 57 LOC medium |
| apps/forge-desktop/tests/cli-manager.test.ts | Automated test coverage for adjacent module behavior. | 111 LOC medium |
| apps/forge-desktop/tests/cli-runtimes.test.ts | Automated test coverage for adjacent module behavior. | 96 LOC medium |
| apps/forge-desktop/tests/cloud-runtimes.test.ts | Automated test coverage for adjacent module behavior. | 501 LOC very large |
| apps/forge-desktop/tests/code-intelligence.test.ts | Automated test coverage for adjacent module behavior. | 162 LOC large |
| apps/forge-desktop/tests/command-registry.test.ts | Automated test coverage for adjacent module behavior. | 44 LOC medium |
| apps/forge-desktop/tests/configuration-service.test.ts | Tooling/build/test configuration. | 278 LOC large |
| apps/forge-desktop/tests/desktop-container.test.ts | Automated test coverage for adjacent module behavior. | 667 LOC very large |
| apps/forge-desktop/tests/desktop-eventbus.test.ts | Automated test coverage for adjacent module behavior. | 61 LOC medium |
| apps/forge-desktop/tests/desktop-logger.test.ts | Automated test coverage for adjacent module behavior. | 169 LOC large |
| apps/forge-desktop/tests/editor-store.test.ts | Automated test coverage for adjacent module behavior. | 63 LOC medium |
| apps/forge-desktop/tests/execution-budget.test.ts | Automated test coverage for adjacent module behavior. | 42 LOC medium |
| apps/forge-desktop/tests/execution-context.test.ts | Automated test coverage for adjacent module behavior. | 26 LOC small |
| apps/forge-desktop/tests/execution-engine.test.ts | Automated test coverage for adjacent module behavior. | 56 LOC medium |
| apps/forge-desktop/tests/execution-events.test.ts | Automated test coverage for adjacent module behavior. | 22 LOC small |
| apps/forge-desktop/tests/execution-graph.test.ts | Automated test coverage for adjacent module behavior. | 61 LOC medium |
| apps/forge-desktop/tests/execution-journal.test.ts | Automated test coverage for adjacent module behavior. | 45 LOC medium |
| apps/forge-desktop/tests/execution-metrics.test.ts | Automated test coverage for adjacent module behavior. | 33 LOC small |
| apps/forge-desktop/tests/execution-observer.test.ts | Automated test coverage for adjacent module behavior. | 26 LOC small |
| apps/forge-desktop/tests/execution-orchestrator.test.ts | Automated test coverage for adjacent module behavior. | 204 LOC large |
| apps/forge-desktop/tests/execution-policy.test.ts | Automated test coverage for adjacent module behavior. | 33 LOC small |
| apps/forge-desktop/tests/execution-scheduler.test.ts | Automated test coverage for adjacent module behavior. | 86 LOC medium |
| apps/forge-desktop/tests/execution-snapshot.test.ts | Automated test coverage for adjacent module behavior. | 26 LOC small |
| apps/forge-desktop/tests/execution-state-machine.test.ts | Automated test coverage for adjacent module behavior. | 30 LOC small |
| apps/forge-desktop/tests/extension-sdk.test.ts | Automated test coverage for adjacent module behavior. | 69 LOC medium |
| apps/forge-desktop/tests/focus-service.test.ts | Automated test coverage for adjacent module behavior. | 40 LOC medium |
| apps/forge-desktop/tests/ipc-router.test.ts | Automated test coverage for adjacent module behavior. | 202 LOC large |
| apps/forge-desktop/tests/layout-store.test.ts | Automated test coverage for adjacent module behavior. | 129 LOC medium |
| apps/forge-desktop/tests/learning-engine.test.ts | Automated test coverage for adjacent module behavior. | 104 LOC medium |
| apps/forge-desktop/tests/mcp-runtime.test.ts | Automated test coverage for adjacent module behavior. | 101 LOC medium |
| apps/forge-desktop/tests/memory-engine.test.ts | Automated test coverage for adjacent module behavior. | 121 LOC medium |
| apps/forge-desktop/tests/outcome-bridge.test.ts | Automated test coverage for adjacent module behavior. | 58 LOC medium |
| apps/forge-desktop/tests/panel-registry.test.ts | Automated test coverage for adjacent module behavior. | 59 LOC medium |
| apps/forge-desktop/tests/performance-monitor.test.ts | Automated test coverage for adjacent module behavior. | 54 LOC medium |
| apps/forge-desktop/tests/pipeline-executor.test.ts | Automated test coverage for adjacent module behavior. | 120 LOC medium |
| apps/forge-desktop/tests/planning-graph.test.ts | Automated test coverage for adjacent module behavior. | 80 LOC medium |
| apps/forge-desktop/tests/plugin-manager.test.ts | Automated test coverage for adjacent module behavior. | 94 LOC medium |
| apps/forge-desktop/tests/preload.test.ts | Automated test coverage for adjacent module behavior. | 123 LOC medium |
| apps/forge-desktop/tests/prompt-assembly-engine.test.ts | Automated test coverage for adjacent module behavior. | 68 LOC medium |
| apps/forge-desktop/tests/recovery-orchestrator.test.ts | Automated test coverage for adjacent module behavior. | 78 LOC medium |
| apps/forge-desktop/tests/reflection-engine.test.ts | Automated test coverage for adjacent module behavior. | 75 LOC medium |
| apps/forge-desktop/tests/repository-importer.test.ts | Automated test coverage for adjacent module behavior. | 49 LOC medium |
| apps/forge-desktop/tests/repository-intelligence.test.ts | Automated test coverage for adjacent module behavior. | 95 LOC medium |
| apps/forge-desktop/tests/resource-manager.test.ts | Automated test coverage for adjacent module behavior. | 21 LOC small |
| apps/forge-desktop/tests/runtime-discovery.test.ts | Automated test coverage for adjacent module behavior. | 151 LOC medium |
| apps/forge-desktop/tests/runtime-execution.test.ts | Automated test coverage for adjacent module behavior. | 121 LOC medium |
| apps/forge-desktop/tests/runtime-kernel.test.ts | Automated test coverage for adjacent module behavior. | 57 LOC medium |
| apps/forge-desktop/tests/runtime-manager.test.ts | Automated test coverage for adjacent module behavior. | 196 LOC large |
| apps/forge-desktop/tests/runtime-router.test.ts | Automated test coverage for adjacent module behavior. | 84 LOC medium |
| apps/forge-desktop/tests/session-manager.test.ts | Automated test coverage for adjacent module behavior. | 98 LOC medium |
| apps/forge-desktop/tests/setup.ts | Automated test coverage for adjacent module behavior. | 2 LOC small |
| apps/forge-desktop/tests/startup-manager.test.ts | Automated test coverage for adjacent module behavior. | 225 LOC large |
| apps/forge-desktop/tests/task-dispatcher.test.ts | Automated test coverage for adjacent module behavior. | 95 LOC medium |
| apps/forge-desktop/tests/terminal-service.test.ts | Automated test coverage for adjacent module behavior. | 111 LOC medium |
| apps/forge-desktop/tests/theme-manager.test.ts | Automated test coverage for adjacent module behavior. | 106 LOC medium |
| apps/forge-desktop/tests/theme-service.test.ts | Automated test coverage for adjacent module behavior. | 23 LOC small |
| apps/forge-desktop/tests/tool-execution-engine.test.ts | Automated test coverage for adjacent module behavior. | 188 LOC large |
| apps/forge-desktop/tests/verification-checkers.test.ts | Automated test coverage for adjacent module behavior. | 82 LOC medium |
| apps/forge-desktop/tests/verification-engine.test.ts | Automated test coverage for adjacent module behavior. | 41 LOC medium |
| apps/forge-desktop/tests/verification-metrics.test.ts | Automated test coverage for adjacent module behavior. | 25 LOC small |
| apps/forge-desktop/tests/verification-pipeline.test.ts | Automated test coverage for adjacent module behavior. | 82 LOC medium |
| apps/forge-desktop/tests/window-manager.test.ts | Automated test coverage for adjacent module behavior. | 131 LOC medium |
| apps/forge-desktop/tests/window-service.test.ts | Automated test coverage for adjacent module behavior. | 227 LOC large |
| apps/forge-desktop/tests/workflow-engine.test.ts | Automated test coverage for adjacent module behavior. | 33 LOC small |
| apps/forge-desktop/tests/workspace-context-engine.test.ts | Automated test coverage for adjacent module behavior. | 214 LOC large |
| apps/forge-desktop/tests/workspace-engine.test.ts | Automated test coverage for adjacent module behavior. | 130 LOC medium |
| apps/forge-desktop/tests/workspace-intelligence.test.ts | Automated test coverage for adjacent module behavior. | 30 LOC small |
| apps/forge-desktop/tests/workspace-service.test.ts | Automated test coverage for adjacent module behavior. | 175 LOC large |
| apps/forge-desktop/tests/workspace-session.test.ts | Automated test coverage for adjacent module behavior. | 52 LOC medium |

### Documentation

| File | Purpose | Size / Complexity |
|---|---|---|
| docs/adr/ADR-001-Turborepo.md | Project documentation or architecture notes. | 23 LOC small |
| docs/adr/ADR-002-Uv-Python.md | Project documentation or architecture notes. | 23 LOC small |
| docs/adr/ADR-003-Event-Bus.md | Project documentation or architecture notes. | 23 LOC small |
| docs/ARCHITECTURE_PRINCIPLES.md | Project documentation or architecture notes. | 38 LOC small |
| docs/CONTRIBUTING.md | Project documentation or architecture notes. | 41 LOC medium |
| docs/FORGE_ARCHITECTURE.md | Project documentation or architecture notes. | 146 LOC medium |

### Forge CLI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-cli/dist/index.js | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-cli/package.json | Package manifest and scripts/dependencies. | 24 LOC small |
| apps/forge-cli/README.md | Project documentation or architecture notes. | 22 LOC small |
| apps/forge-cli/src/index.ts | Source or support file for this module. | 17 LOC small |
| apps/forge-cli/tsconfig.json | Tooling/build/test configuration. | 14 LOC small |

### Generated Electron Build Output

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/dist-electron/ipc/handlers/ai-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 4 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/ai-handlers.js | Generated build/cache artifact; should be derived from source. | 113 LOC medium |
| apps/forge-desktop/dist-electron/ipc/handlers/ai-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/session-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 4 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/session-handlers.js | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/session-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/system-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/system-handlers.js | Generated build/cache artifact; should be derived from source. | 42 LOC medium |
| apps/forge-desktop/dist-electron/ipc/handlers/system-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/terminal-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/terminal-handlers.js | Generated build/cache artifact; should be derived from source. | 82 LOC medium |
| apps/forge-desktop/dist-electron/ipc/handlers/terminal-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/theme-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/theme-handlers.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/theme-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/window-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/window-handlers.js | Generated build/cache artifact; should be derived from source. | 25 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/window-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/workspace-handlers.d.ts | Generated build/cache artifact; should be derived from source. | 18 LOC small |
| apps/forge-desktop/dist-electron/ipc/handlers/workspace-handlers.js | Generated build/cache artifact; should be derived from source. | 89 LOC medium |
| apps/forge-desktop/dist-electron/ipc/handlers/workspace-handlers.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/interfaces.d.ts | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| apps/forge-desktop/dist-electron/ipc/interfaces.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/ipc/interfaces.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/ipc-middleware.d.ts | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/ipc/ipc-middleware.js | Generated build/cache artifact; should be derived from source. | 61 LOC medium |
| apps/forge-desktop/dist-electron/ipc/ipc-middleware.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/ipc/ipc-router.d.ts | Generated build/cache artifact; should be derived from source. | 35 LOC small |
| apps/forge-desktop/dist-electron/ipc/ipc-router.js | Generated build/cache artifact; should be derived from source. | 106 LOC medium |
| apps/forge-desktop/dist-electron/ipc/ipc-router.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-collectors.d.ts | Generated build/cache artifact; should be derived from source. | 47 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/context/context-collectors.js | Generated build/cache artifact; should be derived from source. | 141 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/context/context-collectors.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-engine.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-engine.js | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-package.d.ts | Generated build/cache artifact; should be derived from source. | 28 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-package.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-package.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-ranking-service.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-ranking-service.js | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-ranking-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-sufficiency.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-sufficiency.js | Generated build/cache artifact; should be derived from source. | 29 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/context-sufficiency.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/prompt-normalizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/prompt-normalizer.js | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/prompt-normalizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/token-budget-manager.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/ai/context/token-budget-manager.js | Generated build/cache artifact; should be derived from source. | 44 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/context/token-budget-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/diagnostics/diagnostics-service.d.ts | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/diagnostics/diagnostics-service.js | Generated build/cache artifact; should be derived from source. | 73 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/diagnostics/diagnostics-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-budget.d.ts | Generated build/cache artifact; should be derived from source. | 31 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-budget.js | Generated build/cache artifact; should be derived from source. | 73 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-budget.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-context.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-context.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-context.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-engine.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-engine.js | Generated build/cache artifact; should be derived from source. | 147 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-events.d.ts | Generated build/cache artifact; should be derived from source. | 58 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-events.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-graph-engine.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-graph-engine.js | Generated build/cache artifact; should be derived from source. | 126 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-graph-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-metrics.d.ts | Generated build/cache artifact; should be derived from source. | 26 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-metrics.js | Generated build/cache artifact; should be derived from source. | 50 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-metrics.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-observer.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-observer.js | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-observer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-policy-registry.d.ts | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-policy-registry.js | Generated build/cache artifact; should be derived from source. | 42 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-policy-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-scheduler.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-scheduler.js | Generated build/cache artifact; should be derived from source. | 146 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-scheduler.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-snapshot-service.d.ts | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-snapshot-service.js | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-snapshot-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-state-machine.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-state-machine.js | Generated build/cache artifact; should be derived from source. | 43 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-state-machine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-timeout-manager.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-timeout-manager.js | Generated build/cache artifact; should be derived from source. | 31 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-timeout-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-types.d.ts | Generated build/cache artifact; should be derived from source. | 67 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/execution-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/task-dispatcher.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/task-dispatcher.js | Generated build/cache artifact; should be derived from source. | 66 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/execution/task-dispatcher.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/tool-router.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/tool-router.js | Generated build/cache artifact; should be derived from source. | 29 LOC small |
| apps/forge-desktop/dist-electron/main/ai/execution/tool-router.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/kernel/ai-kernel.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/kernel/ai-kernel.js | Generated build/cache artifact; should be derived from source. | 74 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/kernel/ai-kernel.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/knowledge/semantic-knowledge-builder.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/ai/knowledge/semantic-knowledge-builder.js | Generated build/cache artifact; should be derived from source. | 37 LOC small |
| apps/forge-desktop/dist-electron/main/ai/knowledge/semantic-knowledge-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/confidence-calibrator.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/confidence-calibrator.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/confidence-calibrator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/experience-store.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/experience-store.js | Generated build/cache artifact; should be derived from source. | 61 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/learning/experience-store.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-engine.d.ts | Generated build/cache artifact; should be derived from source. | 34 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-engine.js | Generated build/cache artifact; should be derived from source. | 79 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-events.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-events.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-metrics.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-metrics.js | Generated build/cache artifact; should be derived from source. | 25 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-metrics.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-policy-engine.d.ts | Generated build/cache artifact; should be derived from source. | 4 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-policy-engine.js | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-policy-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-report-builder.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-report-builder.js | Generated build/cache artifact; should be derived from source. | 51 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-report-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-types.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/learning-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/memory-consolidator.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/memory-consolidator.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/memory-consolidator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/pattern-engine.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/pattern-engine.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/pattern-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/planning-optimizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/planning-optimizer.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/planning-optimizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/prompt-optimizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/prompt-optimizer.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/prompt-optimizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/recovery-optimizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/recovery-optimizer.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/recovery-optimizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/replay-service.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/replay-service.js | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/replay-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/strategy-optimizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/strategy-optimizer.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/strategy-optimizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/tool-optimizer.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/tool-optimizer.js | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/learning/tool-optimizer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/memory/memory-registry.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/main/ai/memory/memory-registry.js | Generated build/cache artifact; should be derived from source. | 41 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/memory/memory-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/orchestrator/ai-orchestrator.d.ts | Generated build/cache artifact; should be derived from source. | 46 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/orchestrator/ai-orchestrator.js | Generated build/cache artifact; should be derived from source. | 94 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/orchestrator/ai-orchestrator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/decision-log.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/decision-log.js | Generated build/cache artifact; should be derived from source. | 66 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/outcome/decision-log.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/experience-builder.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/experience-builder.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/experience-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-events.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-events.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-manager.d.ts | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-manager.js | Generated build/cache artifact; should be derived from source. | 84 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-types.d.ts | Generated build/cache artifact; should be derived from source. | 25 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/outcome/outcome-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-context.d.ts | Generated build/cache artifact; should be derived from source. | 45 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-context.js | Generated build/cache artifact; should be derived from source. | 28 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-context.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-executor.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-executor.js | Generated build/cache artifact; should be derived from source. | 122 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-executor.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-recorder.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-recorder.js | Generated build/cache artifact; should be derived from source. | 71 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-recorder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-stage.d.ts | Generated build/cache artifact; should be derived from source. | 132 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-stage.js | Generated build/cache artifact; should be derived from source. | 344 LOC large |
| apps/forge-desktop/dist-electron/main/ai/pipeline/pipeline-stage.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/dependency-resolver.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/dependency-resolver.js | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/dependency-resolver.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/execution-planner.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/execution-planner.js | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/execution-planner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/goal-extractor.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/goal-extractor.js | Generated build/cache artifact; should be derived from source. | 34 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/goal-extractor.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/intent-detector.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/intent-detector.js | Generated build/cache artifact; should be derived from source. | 41 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/planner/intent-detector.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-approval-policy.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-approval-policy.js | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-approval-policy.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-scorer.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-scorer.js | Generated build/cache artifact; should be derived from source. | 39 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-scorer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-validator.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-validator.js | Generated build/cache artifact; should be derived from source. | 49 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/planner/plan-validator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/planner.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/planner.js | Generated build/cache artifact; should be derived from source. | 58 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/planner/planner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/task-planner.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/task-planner.js | Generated build/cache artifact; should be derived from source. | 53 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/planner/task-planner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/tool-selector.d.ts | Generated build/cache artifact; should be derived from source. | 4 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/tool-selector.js | Generated build/cache artifact; should be derived from source. | 30 LOC small |
| apps/forge-desktop/dist-electron/main/ai/planner/tool-selector.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/model-context-builder.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/model-context-builder.js | Generated build/cache artifact; should be derived from source. | 26 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/model-context-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-builder.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-builder.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-template-registry.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-template-registry.js | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/ai/prompt/prompt-template-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/mock-provider.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/mock-provider.js | Generated build/cache artifact; should be derived from source. | 48 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/providers/mock-provider.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/ollama-provider.d.ts | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/ollama-provider.js | Generated build/cache artifact; should be derived from source. | 149 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/providers/ollama-provider.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/token-stream.d.ts | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/ai/providers/token-stream.js | Generated build/cache artifact; should be derived from source. | 41 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/providers/token-stream.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/assumption-manager.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/assumption-manager.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/assumption-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/constraint-registry.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/constraint-registry.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/constraint-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/evidence-collector.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/evidence-collector.js | Generated build/cache artifact; should be derived from source. | 24 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/evidence-collector.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reasoning/reasoning-engine.d.ts | Generated build/cache artifact; should be derived from source. | 57 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reasoning/reasoning-engine.js | Generated build/cache artifact; should be derived from source. | 130 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reasoning/reasoning-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/failure-analyzer.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/failure-analyzer.js | Generated build/cache artifact; should be derived from source. | 49 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/recovery/failure-analyzer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-events.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-events.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-executor.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-executor.js | Generated build/cache artifact; should be derived from source. | 18 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-executor.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-journal.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-journal.js | Generated build/cache artifact; should be derived from source. | 66 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-journal.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-metrics.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-metrics.js | Generated build/cache artifact; should be derived from source. | 30 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-metrics.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-orchestrator.d.ts | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-orchestrator.js | Generated build/cache artifact; should be derived from source. | 100 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-orchestrator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-policy-engine.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-policy-engine.js | Generated build/cache artifact; should be derived from source. | 40 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-policy-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-strategy-registry.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-strategy-registry.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-strategy-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-types.d.ts | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/recovery-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/rollback-manager.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/ai/recovery/rollback-manager.js | Generated build/cache artifact; should be derived from source. | 55 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/recovery/rollback-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/architecture-reviewer.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/architecture-reviewer.js | Generated build/cache artifact; should be derived from source. | 60 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reflection/architecture-reviewer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/confidence-engine.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/confidence-engine.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/confidence-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/recommendation-engine.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/recommendation-engine.js | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/recommendation-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-context.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-context.js | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-context.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-engine.d.ts | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-engine.js | Generated build/cache artifact; should be derived from source. | 56 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-events.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-events.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-report-builder.d.ts | Generated build/cache artifact; should be derived from source. | 5 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-report-builder.js | Generated build/cache artifact; should be derived from source. | 51 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-report-builder.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-types.d.ts | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/reflection-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/score-aggregator.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/score-aggregator.js | Generated build/cache artifact; should be derived from source. | 18 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/score-aggregator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/self-critique-engine.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/self-critique-engine.js | Generated build/cache artifact; should be derived from source. | 60 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reflection/self-critique-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/solution-reviewer.d.ts | Generated build/cache artifact; should be derived from source. | 6 LOC small |
| apps/forge-desktop/dist-electron/main/ai/reflection/solution-reviewer.js | Generated build/cache artifact; should be derived from source. | 60 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/reflection/solution-reviewer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/ai-session-service.d.ts | Generated build/cache artifact; should be derived from source. | 35 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/ai-session-service.js | Generated build/cache artifact; should be derived from source. | 107 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/session/ai-session-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/conversation-manager.d.ts | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/conversation-manager.js | Generated build/cache artifact; should be derived from source. | 34 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/conversation-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/provider-registry.d.ts | Generated build/cache artifact; should be derived from source. | 8 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/provider-registry.js | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/ai/session/provider-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/tools/built-in-tools.d.ts | Generated build/cache artifact; should be derived from source. | 258 LOC large |
| apps/forge-desktop/dist-electron/main/ai/tools/built-in-tools.js | Generated build/cache artifact; should be derived from source. | 282 LOC large |
| apps/forge-desktop/dist-electron/main/ai/tools/built-in-tools.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/tools/tool-registry.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/tools/tool-registry.js | Generated build/cache artifact; should be derived from source. | 29 LOC small |
| apps/forge-desktop/dist-electron/main/ai/tools/tool-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/compilation-verifier.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/compilation-verifier.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/compilation-verifier.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/formatting-checker.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/formatting-checker.js | Generated build/cache artifact; should be derived from source. | 68 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/formatting-checker.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/lint-verifier.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/lint-verifier.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/lint-verifier.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/performance-checker.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/performance-checker.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/performance-checker.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/repository-rules.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/repository-rules.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/repository-rules.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/security-scanner.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/security-scanner.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/security-scanner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/test-runner.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/test-runner.js | Generated build/cache artifact; should be derived from source. | 66 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/checkers/test-runner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-engine.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-engine.js | Generated build/cache artifact; should be derived from source. | 26 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-engine.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-metrics.d.ts | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-metrics.js | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-metrics.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-pipeline.d.ts | Generated build/cache artifact; should be derived from source. | 19 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-pipeline.js | Generated build/cache artifact; should be derived from source. | 241 LOC large |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-pipeline.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-types.d.ts | Generated build/cache artifact; should be derived from source. | 63 LOC medium |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/ai/verification/verification-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/desktop-container.d.ts | Generated build/cache artifact; should be derived from source. | 85 LOC medium |
| apps/forge-desktop/dist-electron/main/container/desktop-container.js | Generated build/cache artifact; should be derived from source. | 713 LOC very large |
| apps/forge-desktop/dist-electron/main/container/desktop-container.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/errors.d.ts | Generated build/cache artifact; should be derived from source. | 40 LOC medium |
| apps/forge-desktop/dist-electron/main/container/errors.js | Generated build/cache artifact; should be derived from source. | 101 LOC medium |
| apps/forge-desktop/dist-electron/main/container/errors.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/graph-exporter.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| apps/forge-desktop/dist-electron/main/container/graph-exporter.js | Generated build/cache artifact; should be derived from source. | 115 LOC medium |
| apps/forge-desktop/dist-electron/main/container/graph-exporter.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/interfaces.d.ts | Generated build/cache artifact; should be derived from source. | 189 LOC large |
| apps/forge-desktop/dist-electron/main/container/interfaces.js | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/container/interfaces.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/service-interfaces.d.ts | Generated build/cache artifact; should be derived from source. | 285 LOC large |
| apps/forge-desktop/dist-electron/main/container/service-interfaces.js | Generated build/cache artifact; should be derived from source. | 68 LOC medium |
| apps/forge-desktop/dist-electron/main/container/service-interfaces.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/service-scope.d.ts | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/container/service-scope.js | Generated build/cache artifact; should be derived from source. | 87 LOC medium |
| apps/forge-desktop/dist-electron/main/container/service-scope.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/container/tokens.d.ts | Generated build/cache artifact; should be derived from source. | 109 LOC medium |
| apps/forge-desktop/dist-electron/main/container/tokens.js | Generated build/cache artifact; should be derived from source. | 120 LOC medium |
| apps/forge-desktop/dist-electron/main/container/tokens.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/index.d.ts | Generated build/cache artifact; should be derived from source. | 2 LOC small |
| apps/forge-desktop/dist-electron/main/index.js | Generated build/cache artifact; should be derived from source. | 111 LOC medium |
| apps/forge-desktop/dist-electron/main/index.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/logging/console-sink.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/logging/console-sink.js | Generated build/cache artifact; should be derived from source. | 36 LOC small |
| apps/forge-desktop/dist-electron/main/logging/console-sink.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/logging/desktop-logger.d.ts | Generated build/cache artifact; should be derived from source. | 35 LOC small |
| apps/forge-desktop/dist-electron/main/logging/desktop-logger.js | Generated build/cache artifact; should be derived from source. | 82 LOC medium |
| apps/forge-desktop/dist-electron/main/logging/desktop-logger.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/logging/file-sink.d.ts | Generated build/cache artifact; should be derived from source. | 26 LOC small |
| apps/forge-desktop/dist-electron/main/logging/file-sink.js | Generated build/cache artifact; should be derived from source. | 126 LOC medium |
| apps/forge-desktop/dist-electron/main/logging/file-sink.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/logging/interfaces.d.ts | Generated build/cache artifact; should be derived from source. | 31 LOC small |
| apps/forge-desktop/dist-electron/main/logging/interfaces.js | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| apps/forge-desktop/dist-electron/main/logging/interfaces.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/ai.module.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/modules/ai.module.js | Generated build/cache artifact; should be derived from source. | 763 LOC very large |
| apps/forge-desktop/dist-electron/main/modules/ai.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/core.module.d.ts | Generated build/cache artifact; should be derived from source. | 19 LOC small |
| apps/forge-desktop/dist-electron/main/modules/core.module.js | Generated build/cache artifact; should be derived from source. | 65 LOC medium |
| apps/forge-desktop/dist-electron/main/modules/core.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/ipc.module.d.ts | Generated build/cache artifact; should be derived from source. | 16 LOC small |
| apps/forge-desktop/dist-electron/main/modules/ipc.module.js | Generated build/cache artifact; should be derived from source. | 39 LOC small |
| apps/forge-desktop/dist-electron/main/modules/ipc.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/performance.module.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/modules/performance.module.js | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/modules/performance.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/session.module.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/modules/session.module.js | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/modules/session.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/startup.module.d.ts | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/modules/startup.module.js | Generated build/cache artifact; should be derived from source. | 57 LOC medium |
| apps/forge-desktop/dist-electron/main/modules/startup.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/terminal.module.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/modules/terminal.module.js | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/modules/terminal.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/theme.module.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/modules/theme.module.js | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/modules/theme.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/window.module.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/modules/window.module.js | Generated build/cache artifact; should be derived from source. | 36 LOC small |
| apps/forge-desktop/dist-electron/main/modules/window.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/modules/workspace.module.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/modules/workspace.module.js | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/modules/workspace.module.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/performance-monitor.d.ts | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| apps/forge-desktop/dist-electron/main/performance-monitor.js | Generated build/cache artifact; should be derived from source. | 41 LOC medium |
| apps/forge-desktop/dist-electron/main/performance-monitor.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/architecture-validator.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/platform/architecture-validator.js | Generated build/cache artifact; should be derived from source. | 106 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/architecture-validator.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/background-scheduler.d.ts | Generated build/cache artifact; should be derived from source. | 36 LOC small |
| apps/forge-desktop/dist-electron/main/platform/background-scheduler.js | Generated build/cache artifact; should be derived from source. | 84 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/background-scheduler.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/dependency-graph.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/platform/dependency-graph.js | Generated build/cache artifact; should be derived from source. | 90 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/dependency-graph.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/feature-registry.d.ts | Generated build/cache artifact; should be derived from source. | 28 LOC small |
| apps/forge-desktop/dist-electron/main/platform/feature-registry.js | Generated build/cache artifact; should be derived from source. | 57 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/feature-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/incremental-indexer.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/platform/incremental-indexer.js | Generated build/cache artifact; should be derived from source. | 70 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/incremental-indexer.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/internal-platform.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/platform/internal-platform.js | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| apps/forge-desktop/dist-electron/main/platform/internal-platform.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/lifecycle-manager.d.ts | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/platform/lifecycle-manager.js | Generated build/cache artifact; should be derived from source. | 62 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/lifecycle-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/observability.d.ts | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/platform/observability.js | Generated build/cache artifact; should be derived from source. | 50 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/observability.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/platform-inspector-service.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/platform/platform-inspector-service.js | Generated build/cache artifact; should be derived from source. | 173 LOC large |
| apps/forge-desktop/dist-electron/main/platform/platform-inspector-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/platform-recovery-service.d.ts | Generated build/cache artifact; should be derived from source. | 22 LOC small |
| apps/forge-desktop/dist-electron/main/platform/platform-recovery-service.js | Generated build/cache artifact; should be derived from source. | 101 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/platform-recovery-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/regex-parser.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/platform/regex-parser.js | Generated build/cache artifact; should be derived from source. | 222 LOC large |
| apps/forge-desktop/dist-electron/main/platform/regex-parser.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-diagnostics.d.ts | Generated build/cache artifact; should be derived from source. | 7 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-diagnostics.js | Generated build/cache artifact; should be derived from source. | 82 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/repository-diagnostics.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-events.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-events.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-intelligence.d.ts | Generated build/cache artifact; should be derived from source. | 35 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-intelligence.js | Generated build/cache artifact; should be derived from source. | 205 LOC large |
| apps/forge-desktop/dist-electron/main/platform/repository-intelligence.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-search.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-search.js | Generated build/cache artifact; should be derived from source. | 35 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-search.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-types.d.ts | Generated build/cache artifact; should be derived from source. | 92 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/repository-types.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/platform/repository-types.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/resource-manager.d.ts | Generated build/cache artifact; should be derived from source. | 24 LOC small |
| apps/forge-desktop/dist-electron/main/platform/resource-manager.js | Generated build/cache artifact; should be derived from source. | 58 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/resource-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-health-service.d.ts | Generated build/cache artifact; should be derived from source. | 20 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-health-service.js | Generated build/cache artifact; should be derived from source. | 44 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/runtime-health-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-kernel.d.ts | Generated build/cache artifact; should be derived from source. | 13 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-kernel.js | Generated build/cache artifact; should be derived from source. | 89 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/runtime-kernel.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-registry.d.ts | Generated build/cache artifact; should be derived from source. | 10 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-registry.js | Generated build/cache artifact; should be derived from source. | 55 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/runtime-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-service.d.ts | Generated build/cache artifact; should be derived from source. | 14 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-service.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| apps/forge-desktop/dist-electron/main/platform/runtime-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/symbol-index.d.ts | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| apps/forge-desktop/dist-electron/main/platform/symbol-index.js | Generated build/cache artifact; should be derived from source. | 43 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/symbol-index.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/platform/workspace-discovery.d.ts | Generated build/cache artifact; should be derived from source. | 19 LOC small |
| apps/forge-desktop/dist-electron/main/platform/workspace-discovery.js | Generated build/cache artifact; should be derived from source. | 129 LOC medium |
| apps/forge-desktop/dist-electron/main/platform/workspace-discovery.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/session-manager.d.ts | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| apps/forge-desktop/dist-electron/main/session-manager.js | Generated build/cache artifact; should be derived from source. | 120 LOC medium |
| apps/forge-desktop/dist-electron/main/session-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/startup-manager.d.ts | Generated build/cache artifact; should be derived from source. | 67 LOC medium |
| apps/forge-desktop/dist-electron/main/startup-manager.js | Generated build/cache artifact; should be derived from source. | 255 LOC large |
| apps/forge-desktop/dist-electron/main/startup-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/terminal-service.d.ts | Generated build/cache artifact; should be derived from source. | 29 LOC small |
| apps/forge-desktop/dist-electron/main/terminal-service.js | Generated build/cache artifact; should be derived from source. | 143 LOC medium |
| apps/forge-desktop/dist-electron/main/terminal-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/theme-service.d.ts | Generated build/cache artifact; should be derived from source. | 12 LOC small |
| apps/forge-desktop/dist-electron/main/theme-service.js | Generated build/cache artifact; should be derived from source. | 23 LOC small |
| apps/forge-desktop/dist-electron/main/theme-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/window-manager.d.ts | Generated build/cache artifact; should be derived from source. | 42 LOC medium |
| apps/forge-desktop/dist-electron/main/window-manager.js | Generated build/cache artifact; should be derived from source. | 153 LOC medium |
| apps/forge-desktop/dist-electron/main/window-manager.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/window-registry.d.ts | Generated build/cache artifact; should be derived from source. | 32 LOC small |
| apps/forge-desktop/dist-electron/main/window-registry.js | Generated build/cache artifact; should be derived from source. | 40 LOC medium |
| apps/forge-desktop/dist-electron/main/window-registry.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/window-service.d.ts | Generated build/cache artifact; should be derived from source. | 31 LOC small |
| apps/forge-desktop/dist-electron/main/window-service.js | Generated build/cache artifact; should be derived from source. | 300 LOC large |
| apps/forge-desktop/dist-electron/main/window-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/workspace-metadata.d.ts | Generated build/cache artifact; should be derived from source. | 27 LOC small |
| apps/forge-desktop/dist-electron/main/workspace-metadata.js | Generated build/cache artifact; should be derived from source. | 149 LOC medium |
| apps/forge-desktop/dist-electron/main/workspace-metadata.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/main/workspace-service.d.ts | Generated build/cache artifact; should be derived from source. | 31 LOC small |
| apps/forge-desktop/dist-electron/main/workspace-service.js | Generated build/cache artifact; should be derived from source. | 261 LOC large |
| apps/forge-desktop/dist-electron/main/workspace-service.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| apps/forge-desktop/dist-electron/preload/index.d.ts | Generated build/cache artifact; should be derived from source. | 2 LOC small |
| apps/forge-desktop/dist-electron/preload/index.js | Generated build/cache artifact; should be derived from source. | 174 LOC large |
| apps/forge-desktop/dist-electron/preload/index.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |

### Git Hooks

| File | Purpose | Size / Complexity |
|---|---|---|
| .husky/_/.gitignore | Source or support file for this module. | 1 KB asset/binary |
| .husky/_/husky.sh | Source or support file for this module. | 1 KB asset/binary |

### Renderer Actions UI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/actions/ActionCard.tsx | React UI component/view. | 68 LOC medium |
| apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx | React UI component/view. | 50 LOC medium |
| apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx | React UI component/view. | 64 LOC medium |
| apps/forge-desktop/src/panels/actions/ApprovalBar.tsx | React UI component/view. | 47 LOC medium |

### Renderer Agent UI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | React UI component/view. | 142 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx | React UI component/view. | 111 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx | React UI component/view. | 93 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/ContextInspectorCard.tsx | React UI component/view. | 156 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx | React UI component/view. | 258 LOC large |
| apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx | React UI component/view. | 170 LOC large |
| apps/forge-desktop/src/panels/agent/cards/PreviewCard.tsx | React UI component/view. | 117 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/RuntimeDashboardCard.tsx | React UI component/view. | 112 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx | React UI component/view. | 239 LOC large |
| apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx | React UI component/view. | 96 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx | React UI component/view. | 115 LOC medium |
| apps/forge-desktop/src/panels/agent/cards/WalkthroughCard.tsx | React UI component/view. | 86 LOC medium |
| apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx | React UI component/view. | 43 LOC medium |
| apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx | React UI component/view. | 45 LOC medium |
| apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx | React UI component/view. | 52 LOC medium |
| apps/forge-desktop/src/panels/agent/components/StatusBadge.tsx | React UI component/view. | 56 LOC medium |
| apps/forge-desktop/src/panels/agent/InboxStrip.tsx | React UI component/view. | 156 LOC medium |
| apps/forge-desktop/src/panels/agent/RecentRunsDrawer.tsx | React UI component/view. | 99 LOC medium |
| apps/forge-desktop/src/panels/agent/RunTimeline.tsx | React UI component/view. | 273 LOC large |
| apps/forge-desktop/src/panels/agent/StageDetailDrawer.tsx | React UI component/view. | 228 LOC large |
| apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx | React UI component/view. | 191 LOC large |

### Renderer App Shell

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/app/App.tsx | React UI component/view. | 142 LOC medium |
| apps/forge-desktop/src/commands/command-service.ts | Service layer implementation. | 25 LOC small |
| apps/forge-desktop/src/eventbus/desktop-eventbus.ts | Exports DesktopEventBus, EventListener. | 79 LOC medium |
| apps/forge-desktop/src/eventbus/desktop-events.ts | Exports DesktopEventMap. | 35 LOC small |
| apps/forge-desktop/src/hooks/useAgentBridge.ts | Exports useAgentBridge. | 142 LOC medium |
| apps/forge-desktop/src/hooks/useCommand.ts | Exports useCommand. | 18 LOC small |
| apps/forge-desktop/src/hooks/useDesktopEvent.ts | Exports useDesktopEvent, DesktopEventBusContext. | 29 LOC small |
| apps/forge-desktop/src/main.tsx | React UI component/view. | 17 LOC small |
| apps/forge-desktop/src/styles/globals.css | Global or module styling. | 173 LOC large |
| apps/forge-desktop/src/types/agent.ts | Exports TaskItem, TaskListPayload, PlanFileItem, .... | 162 LOC large |
| apps/forge-desktop/src/types/comment-types.ts | Shared TypeScript contracts/interfaces. | 15 LOC small |
| apps/forge-desktop/src/types/forge-api.d.ts | Ambient TypeScript declarations for runtime APIs. | 166 LOC large |
| apps/forge-desktop/src/types/runtime-workspace.ts | Exports NormalizedRuntimeEvent, RuntimeWorkspaceCapabilities, RuntimeWorkspaceEntry, .... | 144 LOC medium |
| apps/forge-desktop/src/types/workspace-metadata.d.ts | Ambient TypeScript declarations for runtime APIs. | 6 LOC small |
| apps/forge-desktop/src/utils/animation-controller.ts | Exports AnimationController, default. | 26 LOC small |

### Renderer Components

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/components/CommandPalette.tsx | React UI component/view. | 184 LOC large |
| apps/forge-desktop/src/components/DockDivider.tsx | React UI component/view. | 109 LOC medium |
| apps/forge-desktop/src/components/DockPanel.tsx | React UI component/view. | 24 LOC small |
| apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx | React UI component/view. | 158 LOC medium |
| apps/forge-desktop/src/components/ResizablePanel.tsx | React UI component/view. | 91 LOC medium |
| apps/forge-desktop/src/components/review/CommentThread.tsx | React UI component/view. | 115 LOC medium |
| apps/forge-desktop/src/components/ui/Badge.tsx | React UI component/view. | 59 LOC medium |
| apps/forge-desktop/src/components/ui/Button.tsx | React UI component/view. | 58 LOC medium |
| apps/forge-desktop/src/components/ui/CommandPaletteModal.tsx | React UI component/view. | 159 LOC medium |
| apps/forge-desktop/src/components/ui/EmptyState.tsx | React UI component/view. | 31 LOC small |
| apps/forge-desktop/src/components/ui/PanelHeader.tsx | React UI component/view. | 46 LOC medium |
| apps/forge-desktop/src/components/ui/Skeleton.tsx | React UI component/view. | 45 LOC medium |

### Renderer Editor UI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/editor/EditorPanel.tsx | React UI component/view. | 36 LOC small |
| apps/forge-desktop/src/panels/editor/EditorTabs.tsx | React UI component/view. | 53 LOC medium |
| apps/forge-desktop/src/panels/editor/interfaces.ts | Shared TypeScript contracts/interfaces. | 12 LOC small |
| apps/forge-desktop/src/panels/editor/monaco-config.ts | Tooling/build/test configuration. | 42 LOC medium |
| apps/forge-desktop/src/panels/editor/MonacoAdapter.tsx | React UI component/view. | 82 LOC medium |

### Renderer Layout

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/layouts/ActivityBar.tsx | React UI component/view. | 109 LOC medium |
| apps/forge-desktop/src/layouts/DockHost.tsx | React UI component/view. | 180 LOC large |
| apps/forge-desktop/src/layouts/DockTabBar.tsx | React UI component/view. | 115 LOC medium |
| apps/forge-desktop/src/layouts/StatusBar.tsx | React UI component/view. | 65 LOC medium |
| apps/forge-desktop/src/layouts/WelcomeScreen.tsx | React UI component/view. | 133 LOC medium |
| apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx | React UI component/view. | 117 LOC medium |
| apps/forge-desktop/src/layouts/WorkspaceLayout.tsx | React UI component/view. | 18 LOC small |

### Renderer Panels

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/ai/AIEnginePanel.tsx | React UI component/view. | 460 LOC very large |
| apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx | React UI component/view. | 277 LOC large |
| apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx | React UI component/view. | 287 LOC large |
| apps/forge-desktop/src/panels/terminal/TerminalPanel.tsx | React UI component/view. | 162 LOC large |

### Renderer Plugin System

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/plugins/command-registry.ts | Registry for pluggable subsystem entries. | 31 LOC small |
| apps/forge-desktop/src/plugins/contribution-point.ts | Exports ContributionPoint. | 17 LOC small |
| apps/forge-desktop/src/plugins/interfaces.ts | Shared TypeScript contracts/interfaces. | 65 LOC medium |
| apps/forge-desktop/src/plugins/panel-registry.ts | Registry for pluggable subsystem entries. | 35 LOC small |
| apps/forge-desktop/src/plugins/plugin-loader.ts | Exports PluginLoader. | 19 LOC small |
| apps/forge-desktop/src/plugins/plugin-manager.ts | Coordinator/manager for related subsystem state. | 511 LOC very large |

### Renderer Runtime UI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/runtime/EnvironmentDoctorView.tsx | React UI component/view. | 161 LOC large |
| apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx | React UI component/view. | 288 LOC large |
| apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx | React UI component/view. | 99 LOC medium |
| apps/forge-desktop/src/panels/runtime/RuntimeLogs.tsx | React UI component/view. | 103 LOC medium |
| apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx | React UI component/view. | 159 LOC medium |
| apps/forge-desktop/src/panels/runtime/RuntimeSessionView.tsx | React UI component/view. | 243 LOC large |
| apps/forge-desktop/src/panels/runtime/RuntimeToolbar.tsx | React UI component/view. | 163 LOC large |

### Renderer Services

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/services/engineering-intelligence-engine.ts | Core engine implementing subsystem workflow logic. | 34 LOC small |
| apps/forge-desktop/src/services/focus-service.ts | Service layer implementation. | 57 LOC medium |
| apps/forge-desktop/src/services/platform-diagnostics-service.ts | Service layer implementation. | 50 LOC medium |
| apps/forge-desktop/src/services/runtime/RuntimeSessionManager.ts | Exports RuntimeSessionManager, runtimeSessionManager. | 173 LOC large |
| apps/forge-desktop/src/services/runtime/RuntimeTelemetry.ts | Exports RuntimeTelemetry, runtimeTelemetry. | 94 LOC medium |
| apps/forge-desktop/src/services/session-client.ts | Exports SessionClient, default. | 25 LOC small |
| apps/forge-desktop/src/services/session-helper.ts | Exports restoreSession, saveSession. | 108 LOC medium |
| apps/forge-desktop/src/services/workspace-client.ts | Exports WorkspaceClient. | 63 LOC medium |

### Renderer State Stores

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/stores/action-store.ts | Zustand state store or state helper. | 158 LOC medium |
| apps/forge-desktop/src/stores/agent-store.ts | Zustand state store or state helper. | 22 LOC small |
| apps/forge-desktop/src/stores/ai-store.ts | Zustand state store or state helper. | 258 LOC large |
| apps/forge-desktop/src/stores/command-palette-store.ts | Zustand state store or state helper. | 14 LOC small |
| apps/forge-desktop/src/stores/editor-store.ts | Zustand state store or state helper. | 97 LOC medium |
| apps/forge-desktop/src/stores/focus-store.ts | Zustand state store or state helper. | 14 LOC small |
| apps/forge-desktop/src/stores/intelligence-store.ts | Zustand state store or state helper. | 46 LOC medium |
| apps/forge-desktop/src/stores/layout-store.ts | Zustand state store or state helper. | 461 LOC very large |
| apps/forge-desktop/src/stores/project-store.ts | Zustand state store or state helper. | 78 LOC medium |
| apps/forge-desktop/src/stores/run-store.ts | Zustand state store or state helper. | 149 LOC medium |
| apps/forge-desktop/src/stores/runtime-store.ts | Zustand state store or state helper. | 367 LOC large |
| apps/forge-desktop/src/stores/session-store.ts | Zustand state store or state helper. | 87 LOC medium |
| apps/forge-desktop/src/stores/theme-store.ts | Zustand state store or state helper. | 54 LOC medium |
| apps/forge-desktop/src/stores/workspace-store.ts | Zustand state store or state helper. | 109 LOC medium |

### Renderer Themes

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/themes/built-in/forge-dark.json | Built-in theme token definition. | 21 LOC small |
| apps/forge-desktop/src/themes/built-in/forge-light.json | Built-in theme token definition. | 21 LOC small |
| apps/forge-desktop/src/themes/theme-loader.ts | Exports ThemeLoader. | 40 LOC medium |
| apps/forge-desktop/src/themes/theme-manager.ts | Coordinator/manager for related subsystem state. | 30 LOC small |
| apps/forge-desktop/src/themes/theme-registry.ts | Registry for pluggable subsystem entries. | 28 LOC small |
| apps/forge-desktop/src/themes/vscode-compat.ts | Exports VSCodeThemeRaw, ForgeTheme, convertVSCodeTheme. | 44 LOC medium |

### Renderer Workspace UI

| File | Purpose | Size / Complexity |
|---|---|---|
| apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx | React UI component/view. | 101 LOC medium |
| apps/forge-desktop/src/panels/workspace/RecentProjects.tsx | React UI component/view. | 82 LOC medium |
| apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx | React UI component/view. | 76 LOC medium |
| apps/forge-desktop/src/panels/workspace/WorkspaceInsightsPanel.tsx | React UI component/view. | 200 LOC large |

### Repo-Level Tests

| File | Purpose | Size / Complexity |
|---|---|---|
| tests/integration/README.md | Project documentation or architecture notes. | 23 LOC small |

### Repository Root Config/Docs

| File | Purpose | Size / Complexity |
|---|---|---|
| .editorconfig | Tooling/build/test configuration. | 1 KB asset/binary |
| .gitignore | Source or support file for this module. | 1 KB asset/binary |
| .npmrc | Source or support file for this module. | 1 KB asset/binary |
| .pnpm-store/v11/index.db | Source or support file for this module. | 8 KB asset/binary |
| eslint.config.mjs | Tooling/build/test configuration. | 28 LOC small |
| implementation_plan.md | Project documentation or architecture notes. | 281 LOC large |
| nova_mindmap.md | Project documentation or architecture notes. | 130 LOC medium |
| package.json | Package manifest and scripts/dependencies. | 31 LOC small |
| pnpm-lock.yaml | Source or support file for this module. | 5591 LOC very large |
| pnpm-workspace.yaml | Tooling/build/test configuration. | 8 LOC small |
| pyproject.toml | Tooling/build/test configuration. | 32 LOC small |
| tsconfig.json | Tooling/build/test configuration. | 20 LOC small |
| turbo.json | Tooling/build/test configuration. | 26 LOC small |

### Scripts

| File | Purpose | Size / Complexity |
|---|---|---|
| scripts/dev-desktop.ps1 | Source or support file for this module. | 6 LOC small |
| scripts/rebuild-native.ps1 | Source or support file for this module. | 13 LOC small |

### Shared Domain Models

| File | Purpose | Size / Complexity |
|---|---|---|
| packages/shared/src/domain/agent.ts | Exports IHierarchicalGoal, IReflectionDecision, IApprovalItem, .... | 58 LOC medium |
| packages/shared/src/domain/ai.ts | Exports IChatMessage, IChatRequest, IChatResponse, .... | 34 LOC small |
| packages/shared/src/domain/context.ts | Exports IIntent, IContextPlan, IContextMetadata, .... | 80 LOC medium |
| packages/shared/src/domain/graph.ts | Exports IStructuredMetadata, IGraphNode, IGraphEdge, .... | 72 LOC medium |
| packages/shared/src/domain/manifest.ts | Exports ForgeExtensionManifest. | 47 LOC medium |
| packages/shared/src/domain/memory.ts | Exports IMemoryEdge, IBaseMemory, ISemanticMemory, .... | 52 LOC medium |
| packages/shared/src/domain/planner.ts | Exports IGoal, ICondition, IPlanStep, .... | 90 LOC medium |
| packages/shared/src/domain/relationship.ts | Exports IRelationship, RelationshipType. | 23 LOC small |
| packages/shared/src/domain/retrieval.ts | Exports IRetrievalSource, IRetrievalTraceItem, IRetrievalTrace, .... | 44 LOC medium |
| packages/shared/src/domain/symbol.ts | Exports ISourceLocation, ISourceRange, ISymbol, .... | 55 LOC medium |
| packages/shared/src/domain/tools.ts | Exports IToolRequest, IToolMetrics, IExecutionResult. | 23 LOC small |
| packages/shared/src/domain/workspace.ts | Exports Workspace, WorkspaceFile, IWorkspaceSettings, .... | 85 LOC medium |

### Shared Event Contracts

| File | Purpose | Size / Complexity |
|---|---|---|
| packages/shared/src/events/schema.ts | Exports IDiagnosticEvent, SystemEventMap. | 218 LOC large |
| packages/shared/src/events/workbench-events.ts | Exports WorkbenchEvents. | 15 LOC small |

### Shared Extension SDK

| File | Purpose | Size / Complexity |
|---|---|---|
| packages/shared/src/sdk/extension-sdk.ts | Exports IExtensionWorkspace, IExtensionEditor, IExtensionLayout, .... | 76 LOC medium |

### Shared Package Config

| File | Purpose | Size / Complexity |
|---|---|---|
| packages/shared/dist/domain/agent.d.ts | Generated build/cache artifact; should be derived from source. | 52 LOC medium |
| packages/shared/dist/domain/agent.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/agent.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/agent.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/ai.d.ts | Generated build/cache artifact; should be derived from source. | 30 LOC small |
| packages/shared/dist/domain/ai.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/ai.js | Generated build/cache artifact; should be derived from source. | 11 LOC small |
| packages/shared/dist/domain/ai.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/context.d.ts | Generated build/cache artifact; should be derived from source. | 74 LOC medium |
| packages/shared/dist/domain/context.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/context.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/context.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/graph.d.ts | Generated build/cache artifact; should be derived from source. | 41 LOC medium |
| packages/shared/dist/domain/graph.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/graph.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/graph.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/manifest.d.ts | Generated build/cache artifact; should be derived from source. | 46 LOC medium |
| packages/shared/dist/domain/manifest.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/manifest.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/manifest.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/memory.d.ts | Generated build/cache artifact; should be derived from source. | 50 LOC medium |
| packages/shared/dist/domain/memory.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/memory.js | Generated build/cache artifact; should be derived from source. | 24 LOC small |
| packages/shared/dist/domain/memory.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/planner.d.ts | Generated build/cache artifact; should be derived from source. | 84 LOC medium |
| packages/shared/dist/domain/planner.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/planner.js | Generated build/cache artifact; should be derived from source. | 36 LOC small |
| packages/shared/dist/domain/planner.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/relationship.d.ts | Generated build/cache artifact; should be derived from source. | 9 LOC small |
| packages/shared/dist/domain/relationship.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/relationship.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/relationship.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/retrieval.d.ts | Generated build/cache artifact; should be derived from source. | 38 LOC small |
| packages/shared/dist/domain/retrieval.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/retrieval.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/retrieval.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/symbol.d.ts | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| packages/shared/dist/domain/symbol.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/symbol.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/symbol.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/tools.d.ts | Generated build/cache artifact; should be derived from source. | 21 LOC small |
| packages/shared/dist/domain/tools.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/tools.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/domain/tools.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/workspace.d.ts | Generated build/cache artifact; should be derived from source. | 55 LOC medium |
| packages/shared/dist/domain/workspace.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/domain/workspace.js | Generated build/cache artifact; should be derived from source. | 58 LOC medium |
| packages/shared/dist/domain/workspace.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/events/schema.d.ts | Generated build/cache artifact; should be derived from source. | 867 LOC very large |
| packages/shared/dist/events/schema.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/events/schema.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/events/schema.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/events/workbench-events.d.ts | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| packages/shared/dist/events/workbench-events.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/events/workbench-events.js | Generated build/cache artifact; should be derived from source. | 19 LOC small |
| packages/shared/dist/events/workbench-events.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/index.d.ts | Generated build/cache artifact; should be derived from source. | 17 LOC small |
| packages/shared/dist/index.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/index.js | Generated build/cache artifact; should be derived from source. | 33 LOC small |
| packages/shared/dist/index.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/permissions/permission.d.ts | Generated build/cache artifact; should be derived from source. | 15 LOC small |
| packages/shared/dist/permissions/permission.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/permissions/permission.js | Generated build/cache artifact; should be derived from source. | 18 LOC small |
| packages/shared/dist/permissions/permission.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/sdk/extension-sdk.d.ts | Generated build/cache artifact; should be derived from source. | 66 LOC medium |
| packages/shared/dist/sdk/extension-sdk.d.ts.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/dist/sdk/extension-sdk.js | Generated build/cache artifact; should be derived from source. | 3 LOC small |
| packages/shared/dist/sdk/extension-sdk.js.map | Generated build/cache artifact; should be derived from source. | 1 LOC small |
| packages/shared/package.json | Package manifest and scripts/dependencies. | 16 LOC small |
| packages/shared/src/index.ts | Source or support file for this module. | 19 LOC small |
| packages/shared/tsconfig.json | Tooling/build/test configuration. | 9 LOC small |
| packages/shared/tsconfig.tsbuildinfo | Generated build/cache artifact; should be derived from source. | 39 KB asset/binary |

### Shared Permissions

| File | Purpose | Size / Complexity |
|---|---|---|
| packages/shared/src/permissions/permission.ts | Exports TrustLevel, Permission. | 16 LOC small |

## Dependency Graph

### Desktop App Config/Docs

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/postcss.config.cjs | (none) | (none) |
| apps/forge-desktop/tailwind.config.cjs | tailwindcss | (none) |
| apps/forge-desktop/vite.config.ts | vite<br>@vitejs/plugin-react<br>path | (none) |
| apps/forge-desktop/vitest.config.ts | vitest/config<br>path | (none) |

### Desktop Composition Modules

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/modules/ai.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/session/ai-session-service.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/repository-indexer.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-registry.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts<br>apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-engine.ts<br>apps/forge-desktop/electron/main/ai/planner/planning-graph.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts<br>apps/forge-desktop/electron/main/ai/kernel/ai-kernel.ts<br>apps/forge-desktop/electron/main/ai/providers/mock-provider.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts<br>apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-profile.ts<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/electron/main/ai/actions/action-registry.ts<br>apps/forge-desktop/electron/main/ai/actions/action-history.ts<br>apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts<br>apps/forge-desktop/electron/main/ai/planner/planner.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts<br>apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts<br>apps/forge-desktop/electron/main/ai/session/conversation-manager.ts<br>apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/planner/dependency-resolver.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-validator.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts<br>apps/forge-desktop/electron/main/ai/planner/tool-selector.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-context.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-metrics.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts<br>apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts<br>apps/forge-desktop/electron/main/ai/recovery/rollback-manager.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-journal.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-metrics.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts<br>apps/forge-desktop/electron/main/ai/outcome/decision-log.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts<br>apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/modules/core.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/logging/desktop-logger.ts<br>apps/forge-desktop/electron/main/logging/console-sink.ts<br>events | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/performance-monitor.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/terminal-service.test.ts<br>apps/forge-desktop/tests/theme-service.test.ts |
| apps/forge-desktop/electron/main/modules/ipc.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/ipc/ipc-router.ts<br>apps/forge-desktop/electron/ipc/ipc-middleware.ts | apps/forge-desktop/electron/main/index.ts |
| apps/forge-desktop/electron/main/modules/performance.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/performance-monitor.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/performance-monitor.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/modules/session.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/session-manager.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/modules/startup.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/index.ts |
| apps/forge-desktop/electron/main/modules/terminal.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/terminal-service.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/terminal-service.test.ts |
| apps/forge-desktop/electron/main/modules/theme.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/theme-service.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/theme-service.test.ts |
| apps/forge-desktop/electron/main/modules/window.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/window-service.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/modules/workspace.module.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/workspace-service.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |

### Desktop Configuration

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/config/configuration-loader.ts | fs<br>path<br>apps/forge-desktop/electron/main/config/configuration-schema.ts | apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts<br>apps/forge-desktop/tests/configuration-service.test.ts |
| apps/forge-desktop/electron/main/config/configuration-schema.ts | (none) | apps/forge-desktop/electron/main/config/configuration-loader.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/configuration-store.ts<br>apps/forge-desktop/electron/main/config/configuration-validator.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/tests/configuration-service.test.ts |
| apps/forge-desktop/electron/main/config/configuration-service.ts | apps/forge-desktop/electron/main/config/configuration-schema.ts<br>apps/forge-desktop/electron/main/config/configuration-store.ts<br>apps/forge-desktop/electron/main/config/configuration-loader.ts<br>apps/forge-desktop/electron/main/config/configuration-validator.ts | apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts<br>apps/forge-desktop/tests/configuration-service.test.ts |
| apps/forge-desktop/electron/main/config/configuration-store.ts | apps/forge-desktop/electron/main/config/configuration-schema.ts | apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/tests/configuration-service.test.ts |
| apps/forge-desktop/electron/main/config/configuration-validator.ts | apps/forge-desktop/electron/main/config/configuration-schema.ts | apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/tests/configuration-service.test.ts |
| apps/forge-desktop/electron/main/config/index.ts | apps/forge-desktop/electron/main/config/configuration-schema.ts<br>apps/forge-desktop/electron/main/config/configuration-validator.ts<br>apps/forge-desktop/electron/main/config/configuration-store.ts<br>apps/forge-desktop/electron/main/config/configuration-loader.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts |

### Desktop DI Container

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/container/desktop-container.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/errors.ts<br>apps/forge-desktop/electron/main/container/service-scope.ts<br>apps/forge-desktop/electron/main/container/graph-exporter.ts | apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/performance-monitor.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/terminal-service.test.ts<br>apps/forge-desktop/tests/theme-service.test.ts |
| apps/forge-desktop/electron/main/container/errors.ts | apps/forge-desktop/electron/main/container/interfaces.ts | apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/container/service-scope.ts<br>apps/forge-desktop/tests/desktop-container.test.ts |
| apps/forge-desktop/electron/main/container/graph-exporter.ts | apps/forge-desktop/electron/main/container/interfaces.ts | apps/forge-desktop/electron/main/container/desktop-container.ts |
| apps/forge-desktop/electron/main/container/interfaces.ts | (none) | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/session-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/system-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/container/errors.ts<br>apps/forge-desktop/electron/main/container/graph-exporter.ts<br>apps/forge-desktop/electron/main/container/service-scope.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/modules/startup.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/platform/architecture-validator.ts<br>apps/forge-desktop/electron/main/platform/internal-platform.ts<br>apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/architecture-validator.test.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/ipc/interfaces.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/config/index.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts<br>apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-types.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/ai/planner/planning-graph.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/repository-scanner.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-server.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-types.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/repository-indexer.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts<br>apps/forge-desktop/electron/main/platform/repository-types.ts<br>apps/forge-desktop/electron/main/ai/context/context-package.ts<br>apps/forge-desktop/electron/main/ai/context/context-collectors.ts<br>apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts<br>apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts<br>apps/forge-desktop/electron/main/ai/session/conversation-manager.ts<br>apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/planner/dependency-resolver.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-validator.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts<br>apps/forge-desktop/electron/main/ai/planner/tool-selector.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-events.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-context.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-metrics.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-state-machine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts<br>apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts<br>apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts<br>apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-profile.ts<br>apps/forge-desktop/electron/main/platform/repository-analyzer.ts<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/electron/main/ai/actions/action-types.ts<br>apps/forge-desktop/electron/main/ai/actions/action-registry.ts<br>apps/forge-desktop/electron/main/ai/actions/action-validator.ts<br>apps/forge-desktop/electron/main/ai/actions/action-events.ts<br>apps/forge-desktop/electron/main/ai/actions/action-history.ts<br>apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/session-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/system-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/window-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts<br>apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/context/context-collectors.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts<br>apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-context.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/kernel/ai-kernel.ts<br>apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/ai/planner/planner.ts<br>apps/forge-desktop/electron/main/ai/providers/mock-provider.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/ai/session/ai-session-service.ts<br>apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-registry.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/modules/startup.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/performance-monitor.ts<br>apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/electron/main/platform/platform-recovery-service.ts<br>apps/forge-desktop/electron/main/platform/repository-events.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/session-manager.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/electron/main/terminal-service.ts<br>apps/forge-desktop/electron/main/theme-service.ts<br>apps/forge-desktop/electron/main/window-service.ts<br>apps/forge-desktop/electron/main/workspace-service.ts<br>apps/forge-desktop/src/eventbus/desktop-events.ts<br>apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx<br>apps/forge-desktop/src/services/workspace-client.ts<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/tests/agent-loop.test.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/execution-context.test.ts<br>apps/forge-desktop/tests/execution-engine.test.ts<br>apps/forge-desktop/tests/execution-graph.test.ts<br>apps/forge-desktop/tests/execution-journal.test.ts<br>apps/forge-desktop/tests/execution-orchestrator.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts<br>apps/forge-desktop/tests/learning-engine.test.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts<br>apps/forge-desktop/tests/performance-monitor.test.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts<br>apps/forge-desktop/tests/reflection-engine.test.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/task-dispatcher.test.ts<br>apps/forge-desktop/tests/terminal-service.test.ts<br>apps/forge-desktop/tests/theme-service.test.ts<br>apps/forge-desktop/tests/tool-execution-engine.test.ts<br>apps/forge-desktop/tests/verification-engine.test.ts<br>apps/forge-desktop/tests/verification-pipeline.test.ts<br>apps/forge-desktop/tests/window-service.test.ts<br>apps/forge-desktop/tests/workspace-service.test.ts |
| apps/forge-desktop/electron/main/container/service-scope.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/errors.ts | apps/forge-desktop/electron/main/container/desktop-container.ts |
| apps/forge-desktop/electron/main/container/tokens.ts | apps/forge-desktop/electron/main/container/interfaces.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/session-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/system-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/modules/startup.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/platform/architecture-validator.ts<br>apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/desktop-container.test.ts<br>apps/forge-desktop/tests/performance-monitor.test.ts<br>apps/forge-desktop/tests/session-manager.test.ts<br>apps/forge-desktop/tests/startup-manager.test.ts<br>apps/forge-desktop/tests/terminal-service.test.ts<br>apps/forge-desktop/tests/theme-service.test.ts |

### Desktop Electron AI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/ai/actions/action-events.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts<br>apps/forge-desktop/electron/main/ai/actions/action-registry.ts<br>apps/forge-desktop/electron/main/ai/actions/action-validator.ts<br>apps/forge-desktop/electron/main/ai/actions/action-events.ts<br>apps/forge-desktop/electron/main/ai/actions/action-history.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/action-history.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/action-registry.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/action-types.ts | (none) | apps/forge-desktop/electron/main/ai/actions/action-events.ts<br>apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/ai/actions/action-history.ts<br>apps/forge-desktop/electron/main/ai/actions/action-registry.ts<br>apps/forge-desktop/electron/main/ai/actions/action-validator.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/action-validator.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts |
| apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts |
| apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts |
| apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts |
| apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts |
| apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/actions/action-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts | apps/forge-desktop/electron/main/ai/actions/action-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/action-system.test.ts |
| apps/forge-desktop/electron/main/ai/agent/agent-loop.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/agent-loop.test.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts | apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts<br>apps/forge-desktop/electron/main/ai/external/external-types.ts | apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts | (none) | apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts | fs<br>path<br>os<br>child_process<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | (none) | apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-manager.ts | apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-types.ts | apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-manager.test.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-process.ts | child_process<br>apps/forge-desktop/electron/main/ai/cli/cli-types.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-stream.ts | apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts | events<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | apps/forge-desktop/electron/main/ai/cli/index.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-session.ts | apps/forge-desktop/electron/main/ai/cli/cli-process.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-types.ts<br>apps/forge-desktop/electron/main/ai/external/external-types.ts | apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-stream.ts | events<br>stream | apps/forge-desktop/electron/main/ai/cli/cli-process.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts |
| apps/forge-desktop/electron/main/ai/cli/cli-types.ts | (none) | apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-process.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/cli/index.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/cli/index.ts | apps/forge-desktop/electron/main/ai/cli/cli-types.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-process.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-stream.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts | (none) |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts | apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>child_process | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-discovery.ts | fs<br>path<br>os | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts<br>${entryPath} | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts | apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts | (none) | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts | apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-discovery.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | apps/forge-desktop/electron/main/ai/cli/sdk/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts | apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-errors.ts | apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/index.ts |
| apps/forge-desktop/electron/main/ai/cli/sdk/index.ts | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-discovery.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts | apps/forge-desktop/electron/main/ai/cli/index.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/ast-parser.ts | typescript | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/tests/code-intelligence.test.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts | (none) | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/code-intelligence/repository-scanner.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/ast-parser.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/code-intelligence.test.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts | (none) | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/repository-scanner.ts | (none) | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts | apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts | (none) | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts<br>apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/context/context-budget.ts | apps/forge-desktop/electron/main/ai/context/context-selector.ts | apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/tests/workspace-context-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-collectors.ts | apps/forge-desktop/electron/main/ai/context/context-package.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/context/repository-indexer.ts<br>apps/forge-desktop/electron/main/ai/context/context-sources.ts<br>apps/forge-desktop/electron/main/ai/context/context-selector.ts<br>apps/forge-desktop/electron/main/ai/context/context-budget.ts | apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/workspace-context-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-package.ts | apps/forge-desktop/electron/main/platform/repository-types.ts | apps/forge-desktop/electron/main/ai/context/context-collectors.ts<br>apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts<br>apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts<br>apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts | apps/forge-desktop/electron/main/ai/context/context-package.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-selector.ts | apps/forge-desktop/electron/main/ai/context/context-sources.ts<br>apps/forge-desktop/electron/main/ai/context/repository-indexer.ts | apps/forge-desktop/electron/main/ai/context/context-budget.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts<br>apps/forge-desktop/tests/workspace-context-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-sources.ts | (none) | apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/context-selector.ts<br>apps/forge-desktop/tests/workspace-context-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts | apps/forge-desktop/electron/main/ai/context/context-package.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-types.ts | apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/prompt-assembly-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/context/repository-indexer.ts | (none) | apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/context-selector.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/workspace-context-engine.test.ts |
| apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts | apps/forge-desktop/electron/main/ai/context/context-package.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts<br>apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-profile.ts<br>apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/platform/repository-analyzer.ts<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx<br>apps/forge-desktop/src/stores/project-store.ts |
| apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/errors/planning-errors.ts | (none) | apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-budget.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/tests/execution-budget.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-context.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/execution-context.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-budget.ts<br>fs<br>path | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-engine.test.ts<br>apps/forge-desktop/tests/execution-journal.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-events.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/execution-events.test.ts<br>apps/forge-desktop/tests/execution-observer.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/ai/planner/planning-graph.ts<br>apps/forge-desktop/electron/main/ai/errors/planning-errors.ts | apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-engine.test.ts<br>apps/forge-desktop/tests/execution-graph.test.ts<br>apps/forge-desktop/tests/execution-journal.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-metrics.ts | (none) | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/execution-metrics.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-observer.ts | apps/forge-desktop/electron/main/ai/execution/execution-events.ts | apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-engine.test.ts<br>apps/forge-desktop/tests/execution-journal.test.ts<br>apps/forge-desktop/tests/execution-observer.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-policy.test.ts<br>apps/forge-desktop/tests/task-dispatcher.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-budget.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/errors/planning-errors.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts | apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-engine.test.ts<br>apps/forge-desktop/tests/execution-journal.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts | apps/forge-desktop/electron/main/ai/execution/execution-events.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/execution-snapshot.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-state-machine.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/execution-state-machine.test.ts |
| apps/forge-desktop/electron/main/ai/execution/execution-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-budget.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-context.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-events.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-state-machine.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts | apps/forge-desktop/electron/main/ai/execution/execution-types.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/execution-scheduler.test.ts<br>apps/forge-desktop/tests/task-dispatcher.test.ts |
| apps/forge-desktop/electron/main/ai/external/external-environment.ts | os<br>path<br>fs | apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/external-process.ts | child_process<br>events<br>apps/forge-desktop/electron/main/ai/external/external-types.ts | apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts | apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/external-types.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts | apps/forge-desktop/electron/main/ai/external/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts |
| apps/forge-desktop/electron/main/ai/external/external-runtime.ts | events<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/external/external-types.ts<br>apps/forge-desktop/electron/main/ai/external/external-environment.ts<br>apps/forge-desktop/electron/main/ai/external/external-process.ts<br>apps/forge-desktop/electron/main/ai/external/external-session.ts<br>apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts | apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/external-session.ts | apps/forge-desktop/electron/main/ai/external/external-types.ts | apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts | events<br>apps/forge-desktop/electron/main/ai/external/external-types.ts | apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/external-types.ts | (none) | apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-session.ts<br>apps/forge-desktop/electron/main/ai/external/external-process.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/external-session.ts<br>apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts<br>apps/forge-desktop/electron/main/ai/external/index.ts |
| apps/forge-desktop/electron/main/ai/external/index.ts | apps/forge-desktop/electron/main/ai/external/external-types.ts<br>apps/forge-desktop/electron/main/ai/external/external-environment.ts<br>apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts<br>apps/forge-desktop/electron/main/ai/external/external-process.ts<br>apps/forge-desktop/electron/main/ai/external/external-session.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts | (none) |
| apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts<br>apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/src/services/engineering-intelligence-engine.ts<br>apps/forge-desktop/tests/workspace-intelligence.test.ts |
| apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts | (none) | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts |
| apps/forge-desktop/electron/main/ai/kernel/ai-kernel.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/learning/learning-engine.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/learning-engine.test.ts |
| apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts | fs<br>path | apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts |
| apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts | apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts | apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts | apps/forge-desktop/electron/main/ai/context/context-selector.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts | (none) |
| apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-server.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/mcp-runtime.test.ts |
| apps/forge-desktop/electron/main/ai/mcp/mcp-server.ts | (none) | apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts | apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts |
| apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts | (none) | apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/tests/mcp-runtime.test.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts | apps/forge-desktop/electron/main/ai/memory/memory-store.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-types.ts | apps/forge-desktop/electron/main/ai/memory/memory-engine.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-engine.ts | apps/forge-desktop/electron/main/ai/memory/memory-types.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-store.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/memory-engine.test.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts | apps/forge-desktop/electron/main/ai/memory/memory-types.ts | apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-engine.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-registry.ts | (none) | apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts | apps/forge-desktop/electron/main/ai/memory/memory-types.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-store.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts | apps/forge-desktop/electron/main/ai/memory/memory-engine.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-store.ts | apps/forge-desktop/electron/main/ai/memory/memory-types.ts | apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-engine.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts |
| apps/forge-desktop/electron/main/ai/memory/memory-types.ts | (none) | apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-engine.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-store.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/planner/planning-graph.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/execution-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts | apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/outcome/decision-log.ts | fs<br>path | apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts |
| apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts | apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts | apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts |
| apps/forge-desktop/electron/main/ai/outcome/outcome-events.ts | (none) | (none) |
| apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts<br>apps/forge-desktop/electron/main/ai/outcome/decision-log.ts<br>fs<br>path | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts |
| apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/learning-engine.test.ts |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts | apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts | apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/tests/pipeline-executor.test.ts |
| apps/forge-desktop/electron/main/ai/planner/dependency-resolver.ts | (none) | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/execution-planner.ts | apps/forge-desktop/electron/main/ai/planner/task-planner.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts | (none) | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/intent-detector.ts | (none) | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts | apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts | apps/forge-desktop/electron/main/ai/planner/task-planner.ts | apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/plan-validator.ts | apps/forge-desktop/electron/main/ai/planner/task-planner.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/planner.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>react | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/planner/planning-graph.ts | (none) | apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/planning-graph.test.ts |
| apps/forge-desktop/electron/main/ai/planner/task-planner.ts | apps/forge-desktop/electron/main/ai/context/context-package.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-validator.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/planner/tool-selector.ts | (none) | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/providers/mock-provider.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts | apps/forge-desktop/electron/main/modules/ai.module.ts |
| apps/forge-desktop/electron/main/ai/providers/token-stream.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/providers/mock-provider.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts |
| apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts | (none) | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/ai-planning-reasoning.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-events.ts | (none) | (none) |
| apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-journal.ts | fs<br>path | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-metrics.ts | (none) | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts<br>apps/forge-desktop/electron/main/ai/recovery/rollback-manager.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-journal.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-metrics.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts | apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts | apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/recovery/rollback-manager.ts | fs | apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts |
| apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | fs<br>path<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts | apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/execution-orchestrator.test.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts<br>apps/forge-desktop/tests/reflection-engine.test.ts |
| apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/runtime-router.test.ts |
| apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/runtime-router.test.ts |
| apps/forge-desktop/electron/main/ai/routing/runtime-router.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts<br>apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts<br>apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts<br>apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/runtime-router.test.ts |
| apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts<br>apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts | apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts | os<br>fs<br>path<br>child_process<br>util<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts | (none) | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts | (none) | apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts | os<br>fs<br>path<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts | events | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts | http<br>https<br>child_process<br>util | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts | (none) | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts |
| apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts | fs<br>path<br>child_process<br>util<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts | apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/tests/runtime-discovery.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-session.ts | apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cli-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>../../config/configuration-service<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts | apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts | apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>../../config/configuration-service<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/providers/token-stream.ts | apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>../../config/configuration-service | apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>../../config/configuration-service | apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts | apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>../../config/configuration-service | apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/cloud-runtimes.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/index.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts | (none) |
| apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts | events | apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/runtime-execution.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/runtime-execution.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts | apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts | apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/ai/session/provider-registry.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/configuration-service.test.ts<br>apps/forge-desktop/tests/runtime-manager.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts | (none) | apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/runtime-execution.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts | fs<br>path | apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/runtime-execution.test.ts |
| apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/external/external-runtime.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/providers/mock-provider.ts<br>apps/forge-desktop/electron/main/ai/providers/ollama-provider.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/index.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/configuration-service.test.ts<br>apps/forge-desktop/tests/runtime-manager.test.ts |
| apps/forge-desktop/electron/main/ai/session/ai-session-service.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/ai/session/conversation-manager.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/session/conversation-manager.ts | apps/forge-desktop/electron/main/ai/session/ai-session-service.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-intelligence-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/session/provider-registry.ts | ai/runtime<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts | apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/session/workspace-profile.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/tests/workspace-session.test.ts |
| apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts | fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/workspace-session.test.ts |
| apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>fs<br>path | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts |
| apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/tool-execution-engine.test.ts |
| apps/forge-desktop/electron/main/ai/tools/tool-registry.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/ai-foundation.test.ts<br>apps/forge-desktop/tests/mcp-runtime.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>fs<br>path | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-checkers.test.ts |
| apps/forge-desktop/electron/main/ai/verification/verification-engine.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/agent-loop.test.ts<br>apps/forge-desktop/tests/ai-orchestrator.test.ts<br>apps/forge-desktop/tests/execution-orchestrator.test.ts<br>apps/forge-desktop/tests/verification-engine.test.ts |
| apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts | apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-engine.test.ts<br>apps/forge-desktop/tests/verification-metrics.test.ts |
| apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts | apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/verification-engine.test.ts<br>apps/forge-desktop/tests/verification-pipeline.test.ts |
| apps/forge-desktop/electron/main/ai/verification/verification-types.ts | (none) | apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/outcome-bridge.test.ts<br>apps/forge-desktop/tests/recovery-orchestrator.test.ts<br>apps/forge-desktop/tests/reflection-engine.test.ts<br>apps/forge-desktop/tests/verification-pipeline.test.ts |
| apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts | apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/workflow-engine.test.ts |
| apps/forge-desktop/electron/main/ai/workspace/file-operations.ts | fs<br>path | apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts |
| apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts | apps/forge-desktop/electron/main/ai/workspace/file-operations.ts | apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts | apps/forge-desktop/electron/main/ai/workspace/file-operations.ts | apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |
| apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts | apps/forge-desktop/electron/main/ai/workspace/file-operations.ts<br>apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts<br>apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/workspace-engine.test.ts |
| apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts | apps/forge-desktop/electron/main/ai/workspace/file-operations.ts | apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts |

### Desktop Electron Main

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/index.ts | electron<br>path<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/modules/startup.module.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/electron/main/logging/console-sink.ts | apps/forge-desktop/electron/main/logging/interfaces.ts | apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/tests/desktop-logger.test.ts |
| apps/forge-desktop/electron/main/logging/desktop-logger.ts | apps/forge-desktop/electron/main/logging/interfaces.ts | apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/tests/desktop-logger.test.ts |
| apps/forge-desktop/electron/main/logging/file-sink.ts | apps/forge-desktop/electron/main/logging/interfaces.ts<br>fs<br>path | (none) |
| apps/forge-desktop/electron/main/logging/interfaces.ts | (none) | apps/forge-desktop/electron/main/logging/console-sink.ts<br>apps/forge-desktop/electron/main/logging/desktop-logger.ts<br>apps/forge-desktop/electron/main/logging/file-sink.ts<br>apps/forge-desktop/tests/desktop-logger.test.ts |
| apps/forge-desktop/electron/main/performance-monitor.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/performance.module.ts |
| apps/forge-desktop/electron/main/session-manager.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>fs<br>path | apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/tests/session-manager.test.ts |
| apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/ipc/handlers/system-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/window-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/session-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/main/platform/internal-platform.ts<br>apps/forge-desktop/electron/main/platform/architecture-validator.ts<br>apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-kernel.ts<br>apps/forge-desktop/electron/main/platform/lifecycle-manager.ts<br>apps/forge-desktop/electron/main/platform/background-scheduler.ts<br>apps/forge-desktop/electron/main/platform/resource-manager.ts<br>apps/forge-desktop/electron/main/platform/observability.ts<br>apps/forge-desktop/electron/main/platform/feature-registry.ts<br>apps/forge-desktop/electron/main/platform/platform-recovery-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-health-service.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/ai/session/ai-session-service.ts | apps/forge-desktop/electron/main/modules/startup.module.ts<br>apps/forge-desktop/tests/startup-manager.test.ts |
| apps/forge-desktop/electron/main/terminal-service.ts | node-pty<br>os<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/terminal.module.ts |
| apps/forge-desktop/electron/main/theme-service.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/theme.module.ts |
| apps/forge-desktop/electron/main/window-manager.ts | electron<br>path | apps/forge-desktop/tests/window-manager.test.ts |
| apps/forge-desktop/electron/main/window-registry.ts | (none) | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/window-service.ts<br>apps/forge-desktop/electron/main/workspace-service.ts<br>apps/forge-desktop/tests/window-service.test.ts<br>apps/forge-desktop/tests/workspace-service.test.ts |
| apps/forge-desktop/electron/main/window-service.ts | electron<br>path<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/tests/window-service.test.ts |
| apps/forge-desktop/electron/main/workspace-metadata.ts | fs<br>path<br>electron | apps/forge-desktop/electron/main/workspace-service.ts |
| apps/forge-desktop/electron/main/workspace-service.ts | fs<br>path<br>chokidar<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/workspace-metadata.ts | apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/tests/workspace-service.test.ts |

### Desktop IPC

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts | apps/forge-desktop/electron/ipc/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts<br>apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts<br>apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/session-handlers.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/ipc/interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/system-handlers.ts | electron<br>apps/forge-desktop/electron/ipc/interfaces.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/ipc/interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/ipc/interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/window-handlers.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts | electron<br>apps/forge-desktop/electron/ipc/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/ipc/interfaces.ts | electron | apps/forge-desktop/electron/ipc/handlers/ai-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/session-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/system-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts<br>apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts<br>apps/forge-desktop/electron/ipc/ipc-middleware.ts<br>apps/forge-desktop/electron/ipc/ipc-router.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/tests/ipc-router.test.ts |
| apps/forge-desktop/electron/ipc/ipc-middleware.ts | apps/forge-desktop/electron/ipc/interfaces.ts | apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/tests/ipc-router.test.ts |
| apps/forge-desktop/electron/ipc/ipc-router.ts | electron<br>apps/forge-desktop/electron/ipc/interfaces.ts | apps/forge-desktop/electron/main/modules/ipc.module.ts<br>apps/forge-desktop/tests/ipc-router.test.ts |

### Desktop Platform

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/main/platform/architecture-validator.ts | apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>electron<br>packages/shared/src/index.ts | apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/architecture-validator.test.ts |
| apps/forge-desktop/electron/main/platform/background-scheduler.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/background-scheduler.test.ts |
| apps/forge-desktop/electron/main/platform/dependency-graph.ts | (none) | apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/repository-diagnostics.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/platform/repository-search.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/feature-registry.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/incremental-indexer.ts | fs<br>apps/forge-desktop/electron/main/platform/repository-types.ts<br>apps/forge-desktop/electron/main/platform/symbol-index.ts<br>apps/forge-desktop/electron/main/platform/dependency-graph.ts<br>apps/forge-desktop/electron/main/platform/repository-events.ts | apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/internal-platform.ts | apps/forge-desktop/electron/main/container/interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/lifecycle-manager.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/observability.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/platform-inspector-service.ts | fs<br>path<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>packages/shared/src/index.ts<br>electron<br>apps/forge-desktop/electron/main/platform/runtime-kernel.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/platform-recovery-service.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts<br>fs<br>path<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/regex-parser.ts | path<br>apps/forge-desktop/electron/main/platform/repository-types.ts | apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/repository-analyzer.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/tests/repository-importer.test.ts |
| apps/forge-desktop/electron/main/platform/repository-diagnostics.ts | fs<br>path<br>apps/forge-desktop/electron/main/platform/workspace-discovery.ts<br>apps/forge-desktop/electron/main/platform/symbol-index.ts<br>apps/forge-desktop/electron/main/platform/dependency-graph.ts | apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/repository-events.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/repository-importer.ts | fs<br>path<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts<br>apps/forge-desktop/electron/main/platform/repository-analyzer.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-profile.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/tests/repository-importer.test.ts |
| apps/forge-desktop/electron/main/platform/repository-intelligence.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts<br>apps/forge-desktop/electron/main/platform/repository-types.ts<br>apps/forge-desktop/electron/main/platform/workspace-discovery.ts<br>apps/forge-desktop/electron/main/platform/regex-parser.ts<br>apps/forge-desktop/electron/main/platform/symbol-index.ts<br>apps/forge-desktop/electron/main/platform/dependency-graph.ts<br>apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/repository-search.ts<br>apps/forge-desktop/electron/main/platform/repository-diagnostics.ts<br>apps/forge-desktop/electron/main/platform/repository-events.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>fs<br>path | apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/repository-search.ts | apps/forge-desktop/electron/main/platform/symbol-index.ts<br>apps/forge-desktop/electron/main/platform/dependency-graph.ts<br>apps/forge-desktop/electron/main/platform/repository-types.ts | apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/repository-types.ts | (none) | apps/forge-desktop/electron/main/ai/context/context-package.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/regex-parser.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/platform/repository-search.ts<br>apps/forge-desktop/electron/main/platform/symbol-index.ts |
| apps/forge-desktop/electron/main/platform/resource-manager.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/resource-manager.test.ts |
| apps/forge-desktop/electron/main/platform/runtime-health-service.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-kernel.ts | apps/forge-desktop/electron/main/startup-manager.ts |
| apps/forge-desktop/electron/main/platform/runtime-kernel.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-registry.ts | apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-health-service.ts<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/tests/runtime-kernel.test.ts |
| apps/forge-desktop/electron/main/platform/runtime-registry.ts | apps/forge-desktop/electron/main/platform/runtime-service.ts | apps/forge-desktop/electron/main/platform/runtime-kernel.ts |
| apps/forge-desktop/electron/main/platform/runtime-service.ts | (none) | apps/forge-desktop/electron/main/ai/session/ai-session-service.ts<br>apps/forge-desktop/electron/main/platform/background-scheduler.ts<br>apps/forge-desktop/electron/main/platform/feature-registry.ts<br>apps/forge-desktop/electron/main/platform/lifecycle-manager.ts<br>apps/forge-desktop/electron/main/platform/observability.ts<br>apps/forge-desktop/electron/main/platform/platform-recovery-service.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/platform/resource-manager.ts<br>apps/forge-desktop/electron/main/platform/runtime-health-service.ts<br>apps/forge-desktop/electron/main/platform/runtime-kernel.ts<br>apps/forge-desktop/electron/main/platform/runtime-registry.ts<br>apps/forge-desktop/tests/runtime-kernel.test.ts |
| apps/forge-desktop/electron/main/platform/symbol-index.ts | apps/forge-desktop/electron/main/platform/repository-types.ts | apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/repository-diagnostics.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/platform/repository-search.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |
| apps/forge-desktop/electron/main/platform/workspace-discovery.ts | fs<br>path | apps/forge-desktop/electron/main/platform/repository-diagnostics.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/tests/repository-intelligence.test.ts |

### Desktop Preload

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/electron/preload/index.ts | electron | (none) |

### Desktop Tests

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/tests/action-system.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/ai/actions/action-registry.ts<br>apps/forge-desktop/electron/main/ai/actions/action-validator.ts<br>apps/forge-desktop/electron/main/ai/actions/action-history.ts<br>apps/forge-desktop/electron/main/ai/actions/action-executor.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts<br>apps/forge-desktop/electron/main/ai/actions/action-types.ts | (none) |
| apps/forge-desktop/tests/agent-loop.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/agent/agent-loop.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts | (none) |
| apps/forge-desktop/tests/ai-foundation.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/session/provider-registry.ts<br>apps/forge-desktop/electron/main/ai/session/ai-session-service.ts<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-registry.ts<br>apps/forge-desktop/electron/main/ai/kernel/ai-kernel.ts<br>apps/forge-desktop/electron/main/ai/providers/mock-provider.ts<br>apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts<br>apps/forge-desktop/electron/main/ai/planner/planner.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>path | (none) |
| apps/forge-desktop/tests/ai-intelligence-foundation.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/context/context-collectors.ts<br>apps/forge-desktop/electron/main/ai/context/context-ranking-service.ts<br>apps/forge-desktop/electron/main/ai/context/token-budget-manager.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts<br>apps/forge-desktop/electron/main/ai/session/conversation-manager.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/ai-orchestrator.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts | (none) |
| apps/forge-desktop/tests/ai-planning-reasoning.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/context/context-sufficiency.ts<br>apps/forge-desktop/electron/main/ai/planner/intent-detector.ts<br>apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts<br>apps/forge-desktop/electron/main/ai/reasoning/reasoning-engine.ts<br>apps/forge-desktop/electron/main/ai/planner/dependency-resolver.ts<br>apps/forge-desktop/electron/main/ai/planner/task-planner.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-validator.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-scorer.ts<br>apps/forge-desktop/electron/main/ai/planner/plan-approval-policy.ts<br>apps/forge-desktop/electron/main/ai/planner/tool-selector.ts<br>apps/forge-desktop/electron/main/ai/planner/execution-planner.ts | (none) |
| apps/forge-desktop/tests/architecture-validator.test.ts | vitest<br>apps/forge-desktop/electron/main/platform/architecture-validator.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>packages/shared/src/index.ts | (none) |
| apps/forge-desktop/tests/background-scheduler.test.ts | vitest<br>apps/forge-desktop/electron/main/platform/background-scheduler.ts | (none) |
| apps/forge-desktop/tests/bootstrap.test.ts | vitest<br>apps/forge-desktop/package.json | (none) |
| apps/forge-desktop/tests/cli-manager.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts | (none) |
| apps/forge-desktop/tests/cli-runtimes.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/cli/cli-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts | (none) |
| apps/forge-desktop/tests/cloud-runtimes.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts<br>apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts<br>apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/configuration-loader.ts | (none) |
| apps/forge-desktop/tests/code-intelligence.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts<br>apps/forge-desktop/electron/main/ai/code-intelligence/ast-parser.ts<br>react<br>./types<br>../services/user-service<br>./module_${(i + 1) % 120} | (none) |
| apps/forge-desktop/tests/command-registry.test.ts | vitest<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/commands/command-service.ts | (none) |
| apps/forge-desktop/tests/configuration-service.test.ts | vitest<br>apps/forge-desktop/electron/main/config/configuration-service.ts<br>apps/forge-desktop/electron/main/config/configuration-loader.ts<br>apps/forge-desktop/electron/main/config/configuration-store.ts<br>apps/forge-desktop/electron/main/config/configuration-validator.ts<br>apps/forge-desktop/electron/main/config/configuration-schema.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts | (none) |
| apps/forge-desktop/tests/desktop-container.test.ts | vitest<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/errors.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts | (none) |
| apps/forge-desktop/tests/desktop-eventbus.test.ts | vitest<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts | (none) |
| apps/forge-desktop/tests/desktop-logger.test.ts | vitest<br>apps/forge-desktop/electron/main/logging/desktop-logger.ts<br>apps/forge-desktop/electron/main/logging/console-sink.ts<br>apps/forge-desktop/electron/main/logging/interfaces.ts | (none) |
| apps/forge-desktop/tests/editor-store.test.ts | vitest<br>apps/forge-desktop/src/stores/editor-store.ts | (none) |
| apps/forge-desktop/tests/execution-budget.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-budget.ts | (none) |
| apps/forge-desktop/tests/execution-context.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-context.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/execution-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/execution-events.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-events.ts | (none) |
| apps/forge-desktop/tests/execution-graph.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/execution-journal.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/execution-metrics.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-metrics.ts | (none) |
| apps/forge-desktop/tests/execution-observer.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-events.ts | (none) |
| apps/forge-desktop/tests/execution-orchestrator.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | (none) |
| apps/forge-desktop/tests/execution-policy.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts | (none) |
| apps/forge-desktop/tests/execution-scheduler.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-budget.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-observer.ts<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/execution-snapshot.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-snapshot-service.ts | (none) |
| apps/forge-desktop/tests/execution-state-machine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/execution-state-machine.ts | (none) |
| apps/forge-desktop/tests/extension-sdk.test.ts | vitest<br>packages/shared/src/index.ts | (none) |
| apps/forge-desktop/tests/focus-service.test.ts | vitest<br>apps/forge-desktop/src/stores/focus-store.ts<br>apps/forge-desktop/src/services/focus-service.ts<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts | (none) |
| apps/forge-desktop/tests/ipc-router.test.ts | vitest<br>apps/forge-desktop/electron/ipc/ipc-router.ts<br>apps/forge-desktop/electron/ipc/ipc-middleware.ts<br>apps/forge-desktop/electron/ipc/interfaces.ts | (none) |
| apps/forge-desktop/tests/layout-store.test.ts | vitest<br>apps/forge-desktop/src/stores/layout-store.ts | (none) |
| apps/forge-desktop/tests/learning-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/learning/learning-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/outcome/outcome-types.ts | (none) |
| apps/forge-desktop/tests/mcp-runtime.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts<br>apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts<br>apps/forge-desktop/electron/main/ai/tools/tool-registry.ts | (none) |
| apps/forge-desktop/tests/memory-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/memory/memory-engine.ts | (none) |
| apps/forge-desktop/tests/outcome-bridge.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts<br>apps/forge-desktop/electron/main/ai/outcome/experience-builder.ts<br>apps/forge-desktop/electron/main/ai/outcome/decision-log.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts | (none) |
| apps/forge-desktop/tests/panel-registry.test.ts | vitest<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>react | (none) |
| apps/forge-desktop/tests/performance-monitor.test.ts | vitest<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/pipeline-executor.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts<br>apps/forge-desktop/electron/main/ai/diagnostics/diagnostics-service.ts<br>apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/memory/memory-registry.ts | (none) |
| apps/forge-desktop/tests/planning-graph.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/planner/planning-graph.ts | (none) |
| apps/forge-desktop/tests/plugin-manager.test.ts | vitest<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/plugins/interfaces.ts | (none) |
| apps/forge-desktop/tests/preload.test.ts | vitest | (none) |
| apps/forge-desktop/tests/prompt-assembly-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts | (none) |
| apps/forge-desktop/tests/recovery-orchestrator.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts<br>apps/forge-desktop/electron/main/ai/recovery/failure-analyzer.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-policy-engine.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-strategy-registry.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-executor.ts<br>apps/forge-desktop/electron/main/ai/recovery/rollback-manager.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-journal.ts<br>apps/forge-desktop/electron/main/ai/recovery/recovery-metrics.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts | (none) |
| apps/forge-desktop/tests/reflection-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts | (none) |
| apps/forge-desktop/tests/repository-importer.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/platform/repository-importer.ts<br>apps/forge-desktop/electron/main/platform/repository-analyzer.ts | (none) |
| apps/forge-desktop/tests/repository-intelligence.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/platform/workspace-discovery.ts<br>apps/forge-desktop/electron/main/platform/regex-parser.ts<br>apps/forge-desktop/electron/main/platform/symbol-index.ts<br>apps/forge-desktop/electron/main/platform/dependency-graph.ts<br>apps/forge-desktop/electron/main/platform/incremental-indexer.ts<br>apps/forge-desktop/electron/main/platform/repository-search.ts<br>apps/forge-desktop/electron/main/platform/repository-diagnostics.ts<br>apps/forge-desktop/electron/main/platform/repository-events.ts<br>apps/forge-desktop/electron/main/platform/repository-intelligence.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>react | (none) |
| apps/forge-desktop/tests/resource-manager.test.ts | vitest<br>apps/forge-desktop/electron/main/platform/resource-manager.ts | (none) |
| apps/forge-desktop/tests/runtime-discovery.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts<br>apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts | (none) |
| apps/forge-desktop/tests/runtime-execution.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts | (none) |
| apps/forge-desktop/tests/runtime-kernel.test.ts | vitest<br>apps/forge-desktop/electron/main/platform/runtime-kernel.ts<br>apps/forge-desktop/electron/main/platform/runtime-service.ts | (none) |
| apps/forge-desktop/tests/runtime-manager.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts<br>apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts | (none) |
| apps/forge-desktop/tests/runtime-router.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/routing/runtime-router.ts<br>apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts<br>apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts | (none) |
| apps/forge-desktop/tests/session-manager.test.ts | vitest<br>path<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/electron/main/session-manager.ts<br>fs | (none) |
| apps/forge-desktop/tests/setup.ts | @testing-library/jest-dom | (none) |
| apps/forge-desktop/tests/startup-manager.test.ts | vitest<br>apps/forge-desktop/electron/main/startup-manager.ts<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/window.module.ts<br>apps/forge-desktop/electron/main/modules/workspace.module.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/modules/session.module.ts<br>apps/forge-desktop/electron/main/modules/ai.module.ts<br>apps/forge-desktop/electron/main/modules/performance.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/interfaces.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/task-dispatcher.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts<br>apps/forge-desktop/electron/main/ai/execution/execution-policy-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/terminal-service.test.ts | vitest<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/modules/terminal.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/theme-manager.test.ts | vitest<br>apps/forge-desktop/src/themes/vscode-compat.ts<br>apps/forge-desktop/src/themes/theme-registry.ts<br>apps/forge-desktop/src/themes/theme-manager.ts<br>apps/forge-desktop/src/themes/theme-loader.ts<br>apps/forge-desktop/src/stores/theme-store.ts | (none) |
| apps/forge-desktop/tests/theme-service.test.ts | vitest<br>apps/forge-desktop/electron/main/container/desktop-container.ts<br>apps/forge-desktop/electron/main/modules/theme.module.ts<br>apps/forge-desktop/electron/main/modules/core.module.ts<br>apps/forge-desktop/electron/main/container/tokens.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/tool-execution-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/verification-checkers.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/verification/checkers/compilation-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/lint-verifier.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/formatting-checker.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/test-runner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/repository-rules.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/security-scanner.ts<br>apps/forge-desktop/electron/main/ai/verification/checkers/performance-checker.ts<br>fs<br>path | (none) |
| apps/forge-desktop/tests/verification-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/verification/verification-engine.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/verification-metrics.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/verification/verification-metrics.ts | (none) |
| apps/forge-desktop/tests/verification-pipeline.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts<br>apps/forge-desktop/electron/main/ai/verification/verification-types.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/window-manager.test.ts | vitest<br>apps/forge-desktop/electron/main/window-manager.ts<br>path | (none) |
| apps/forge-desktop/tests/window-service.test.ts | vitest<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/window-service.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/workflow-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts | (none) |
| apps/forge-desktop/tests/workspace-context-engine.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/context/context-engine.ts<br>apps/forge-desktop/electron/main/ai/context/repository-indexer.ts<br>apps/forge-desktop/electron/main/ai/context/context-selector.ts<br>apps/forge-desktop/electron/main/ai/context/context-budget.ts<br>apps/forge-desktop/electron/main/ai/context/context-sources.ts<br>./utils | (none) |
| apps/forge-desktop/tests/workspace-engine.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts | (none) |
| apps/forge-desktop/tests/workspace-intelligence.test.ts | vitest<br>apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | (none) |
| apps/forge-desktop/tests/workspace-service.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/workspace-service.ts<br>apps/forge-desktop/electron/main/window-registry.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | (none) |
| apps/forge-desktop/tests/workspace-session.test.ts | vitest<br>fs<br>path<br>apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts<br>apps/forge-desktop/electron/main/ai/session/workspace-profile.ts | (none) |

### Forge CLI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-cli/src/index.ts | (none) | (none) |

### Renderer Actions UI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/actions/ActionCard.tsx | react<br>apps/forge-desktop/src/stores/action-store.ts | apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx |
| apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx | react<br>apps/forge-desktop/src/stores/action-store.ts | (none) |
| apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx | react<br>apps/forge-desktop/src/stores/action-store.ts<br>apps/forge-desktop/src/panels/actions/ActionCard.tsx | (none) |
| apps/forge-desktop/src/panels/actions/ApprovalBar.tsx | react<br>apps/forge-desktop/src/stores/action-store.ts | (none) |

### Renderer Agent UI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/panels/agent/InboxStrip.tsx<br>apps/forge-desktop/src/panels/agent/RunTimeline.tsx<br>apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx<br>apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx<br>apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx<br>apps/forge-desktop/src/components/ui/CommandPaletteModal.tsx<br>apps/forge-desktop/src/panels/agent/RecentRunsDrawer.tsx | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx |
| apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/panels/agent/cards/ContextInspectorCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/PreviewCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/RuntimeDashboardCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/WalkthroughCard.tsx |
| apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx | react<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/WalkthroughCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/PreviewCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/RuntimeDashboardCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ContextInspectorCard.tsx | apps/forge-desktop/src/panels/agent/RunTimeline.tsx |
| apps/forge-desktop/src/panels/agent/cards/ContextInspectorCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Button.tsx<br>apps/forge-desktop/src/components/review/CommentThread.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Button.tsx<br>apps/forge-desktop/src/components/review/CommentThread.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/PreviewCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/RuntimeDashboardCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/components/ui/Badge.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Button.tsx<br>apps/forge-desktop/src/components/review/CommentThread.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Badge.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Badge.tsx | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/cards/WalkthroughCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx |
| apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/agent-store.ts | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/ai-store.ts | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/ai-store.ts | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/components/StatusBadge.tsx | react<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/panels/agent/InboxStrip.tsx<br>apps/forge-desktop/src/panels/agent/RunTimeline.tsx |
| apps/forge-desktop/src/panels/agent/InboxStrip.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/run-store.ts<br>apps/forge-desktop/src/panels/agent/components/StatusBadge.tsx<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/RecentRunsDrawer.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/run-store.ts<br>apps/forge-desktop/src/components/ui/Badge.tsx | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/RunTimeline.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/run-store.ts<br>apps/forge-desktop/src/panels/agent/components/StatusBadge.tsx<br>apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/panels/agent/StageDetailDrawer.tsx | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/panels/agent/StageDetailDrawer.tsx | react<br>lucide-react<br>apps/forge-desktop/src/types/agent.ts<br>apps/forge-desktop/src/components/ui/Badge.tsx | apps/forge-desktop/src/panels/agent/RunTimeline.tsx |
| apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx | react<br>lucide-react<br>apps/forge-desktop/src/components/ui/PanelHeader.tsx | (none) |

### Renderer App Shell

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/app/App.tsx | react<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/src/layouts/WelcomeScreen.tsx<br>apps/forge-desktop/src/layouts/WorkspaceLayout.tsx<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts<br>apps/forge-desktop/src/hooks/useDesktopEvent.ts<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/src/hooks/useAgentBridge.ts<br>apps/forge-desktop/src/services/workspace-client.ts<br>apps/forge-desktop/src/services/session-helper.ts<br>apps/forge-desktop/src/components/CommandPalette.tsx<br>apps/forge-desktop/src/commands/command-service.ts<br>apps/forge-desktop/src/services/focus-service.ts | apps/forge-desktop/src/main.tsx |
| apps/forge-desktop/src/commands/command-service.ts | apps/forge-desktop/src/plugins/command-registry.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/components/CommandPalette.tsx<br>apps/forge-desktop/src/layouts/ActivityBar.tsx<br>apps/forge-desktop/tests/command-registry.test.ts |
| apps/forge-desktop/src/eventbus/desktop-eventbus.ts | apps/forge-desktop/src/eventbus/desktop-events.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/hooks/useDesktopEvent.ts<br>apps/forge-desktop/src/plugins/interfaces.ts<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/services/focus-service.ts<br>apps/forge-desktop/tests/desktop-eventbus.test.ts<br>apps/forge-desktop/tests/focus-service.test.ts<br>apps/forge-desktop/tests/plugin-manager.test.ts |
| apps/forge-desktop/src/eventbus/desktop-events.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/src/eventbus/desktop-eventbus.ts<br>apps/forge-desktop/src/hooks/useDesktopEvent.ts |
| apps/forge-desktop/src/hooks/useAgentBridge.ts | react<br>apps/forge-desktop/src/stores/run-store.ts<br>apps/forge-desktop/src/stores/ai-store.ts<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/app/App.tsx |
| apps/forge-desktop/src/hooks/useCommand.ts | react<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/plugins/interfaces.ts | (none) |
| apps/forge-desktop/src/hooks/useDesktopEvent.ts | react<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts<br>apps/forge-desktop/src/eventbus/desktop-events.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/layouts/DockHost.tsx |
| apps/forge-desktop/src/main.tsx | react<br>react-dom/client<br>apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/panels/editor/monaco-config.ts<br>apps/forge-desktop/src/styles/globals.css | (none) |
| apps/forge-desktop/src/types/agent.ts | (none) | apps/forge-desktop/src/hooks/useAgentBridge.ts<br>apps/forge-desktop/src/panels/agent/InboxStrip.tsx<br>apps/forge-desktop/src/panels/agent/RunTimeline.tsx<br>apps/forge-desktop/src/panels/agent/StageDetailDrawer.tsx<br>apps/forge-desktop/src/panels/agent/cards/BaseCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/CardRenderer.tsx<br>apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/WalkthroughCard.tsx<br>apps/forge-desktop/src/panels/agent/components/StatusBadge.tsx<br>apps/forge-desktop/src/stores/run-store.ts |
| apps/forge-desktop/src/types/comment-types.ts | (none) | apps/forge-desktop/src/components/review/CommentThread.tsx |
| apps/forge-desktop/src/types/forge-api.d.ts | (none) | (none) |
| apps/forge-desktop/src/types/runtime-workspace.ts | (none) | apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeSessionView.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeToolbar.tsx<br>apps/forge-desktop/src/services/runtime/RuntimeSessionManager.ts<br>apps/forge-desktop/src/services/runtime/RuntimeTelemetry.ts<br>apps/forge-desktop/src/stores/runtime-store.ts |
| apps/forge-desktop/src/types/workspace-metadata.d.ts | (none) | (none) |
| apps/forge-desktop/src/utils/animation-controller.ts | (none) | (none) |

### Renderer Components

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/components/CommandPalette.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/command-palette-store.ts<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/commands/command-service.ts | apps/forge-desktop/src/app/App.tsx |
| apps/forge-desktop/src/components/DockDivider.tsx | react<br>apps/forge-desktop/src/stores/layout-store.ts | apps/forge-desktop/src/layouts/DockHost.tsx |
| apps/forge-desktop/src/components/DockPanel.tsx | react | apps/forge-desktop/src/layouts/DockHost.tsx |
| apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx | react<br>apps/forge-desktop/src/stores/project-store.ts<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | (none) |
| apps/forge-desktop/src/components/ResizablePanel.tsx | react | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx |
| apps/forge-desktop/src/components/review/CommentThread.tsx | react<br>lucide-react<br>apps/forge-desktop/src/types/comment-types.ts | apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx |
| apps/forge-desktop/src/components/ui/Badge.tsx | react | apps/forge-desktop/src/panels/agent/RecentRunsDrawer.tsx<br>apps/forge-desktop/src/panels/agent/StageDetailDrawer.tsx<br>apps/forge-desktop/src/panels/agent/cards/RuntimeDashboardCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ToolCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/VerificationCard.tsx<br>apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx |
| apps/forge-desktop/src/components/ui/Button.tsx | react | apps/forge-desktop/src/panels/agent/cards/DiffCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/ImplementationPlanCard.tsx<br>apps/forge-desktop/src/panels/agent/cards/TaskListCard.tsx |
| apps/forge-desktop/src/components/ui/CommandPaletteModal.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/run-store.ts<br>apps/forge-desktop/src/stores/agent-store.ts | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx |
| apps/forge-desktop/src/components/ui/EmptyState.tsx | react | (none) |
| apps/forge-desktop/src/components/ui/PanelHeader.tsx | react | apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx<br>apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/components/ui/Skeleton.tsx | react | (none) |

### Renderer Editor UI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/editor/EditorPanel.tsx | react<br>apps/forge-desktop/src/stores/editor-store.ts<br>apps/forge-desktop/src/panels/editor/EditorTabs.tsx<br>apps/forge-desktop/src/panels/editor/MonacoAdapter.tsx<br>lucide-react | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx |
| apps/forge-desktop/src/panels/editor/EditorTabs.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/editor-store.ts | apps/forge-desktop/src/panels/editor/EditorPanel.tsx |
| apps/forge-desktop/src/panels/editor/interfaces.ts | (none) | (none) |
| apps/forge-desktop/src/panels/editor/monaco-config.ts | @monaco-editor/react<br>monaco-editor | apps/forge-desktop/src/main.tsx |
| apps/forge-desktop/src/panels/editor/MonacoAdapter.tsx | react<br>@monaco-editor/react<br>apps/forge-desktop/src/stores/editor-store.ts<br>apps/forge-desktop/src/stores/theme-store.ts | apps/forge-desktop/src/panels/editor/EditorPanel.tsx |

### Renderer Layout

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/layouts/ActivityBar.tsx | react<br>lucide-react<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/commands/command-service.ts | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx |
| apps/forge-desktop/src/layouts/DockHost.tsx | react<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/components/DockDivider.tsx<br>apps/forge-desktop/src/layouts/DockTabBar.tsx<br>apps/forge-desktop/src/components/DockPanel.tsx<br>apps/forge-desktop/src/hooks/useDesktopEvent.ts<br>apps/forge-desktop/src/plugins/interfaces.ts<br>apps/forge-desktop/src/services/focus-service.ts | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx |
| apps/forge-desktop/src/layouts/DockTabBar.tsx | react<br>lucide-react<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/stores/layout-store.ts | apps/forge-desktop/src/layouts/DockHost.tsx |
| apps/forge-desktop/src/layouts/StatusBar.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/workspace-store.ts | apps/forge-desktop/src/layouts/WorkspaceLayout.tsx |
| apps/forge-desktop/src/layouts/WelcomeScreen.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/src/services/workspace-client.ts | apps/forge-desktop/src/app/App.tsx |
| apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx | react<br>apps/forge-desktop/src/layouts/ActivityBar.tsx<br>apps/forge-desktop/src/components/ResizablePanel.tsx<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/panels/editor/EditorPanel.tsx<br>apps/forge-desktop/src/layouts/DockHost.tsx<br>apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | apps/forge-desktop/src/layouts/WorkspaceLayout.tsx |
| apps/forge-desktop/src/layouts/WorkspaceLayout.tsx | react<br>apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx<br>apps/forge-desktop/src/layouts/StatusBar.tsx | apps/forge-desktop/src/app/App.tsx |

### Renderer Panels

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/ai/AIEnginePanel.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/ai-store.ts<br>apps/forge-desktop/src/stores/editor-store.ts | apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx | react<br>lucide-react<br>apps/forge-desktop/src/components/ui/PanelHeader.tsx<br>apps/forge-desktop/src/components/ui/Badge.tsx<br>apps/forge-desktop/src/services/engineering-intelligence-engine.ts | (none) |
| apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/src/stores/editor-store.ts<br>apps/forge-desktop/src/services/workspace-client.ts<br>apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/panels/terminal/TerminalPanel.tsx | react<br>xterm<br>xterm-addon-fit<br>xterm/css/xterm.css | apps/forge-desktop/src/plugins/plugin-manager.ts |

### Renderer Plugin System

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/plugins/command-registry.ts | apps/forge-desktop/src/plugins/interfaces.ts | apps/forge-desktop/src/commands/command-service.ts<br>apps/forge-desktop/src/components/CommandPalette.tsx<br>apps/forge-desktop/src/hooks/useCommand.ts<br>apps/forge-desktop/src/plugins/contribution-point.ts<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/services/platform-diagnostics-service.ts<br>apps/forge-desktop/tests/command-registry.test.ts<br>apps/forge-desktop/tests/plugin-manager.test.ts |
| apps/forge-desktop/src/plugins/contribution-point.ts | apps/forge-desktop/src/plugins/interfaces.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/plugins/command-registry.ts | (none) |
| apps/forge-desktop/src/plugins/interfaces.ts | react<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts | apps/forge-desktop/src/hooks/useCommand.ts<br>apps/forge-desktop/src/layouts/DockHost.tsx<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/plugins/contribution-point.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/plugins/plugin-loader.ts<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/tests/plugin-manager.test.ts |
| apps/forge-desktop/src/plugins/panel-registry.ts | apps/forge-desktop/src/plugins/interfaces.ts | apps/forge-desktop/src/layouts/ActivityBar.tsx<br>apps/forge-desktop/src/layouts/DockHost.tsx<br>apps/forge-desktop/src/layouts/DockTabBar.tsx<br>apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx<br>apps/forge-desktop/src/plugins/contribution-point.ts<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/services/platform-diagnostics-service.ts<br>apps/forge-desktop/tests/panel-registry.test.ts<br>apps/forge-desktop/tests/plugin-manager.test.ts |
| apps/forge-desktop/src/plugins/plugin-loader.ts | apps/forge-desktop/src/plugins/interfaces.ts | apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/plugins/plugin-manager.ts | react<br>apps/forge-desktop/src/plugins/interfaces.ts<br>apps/forge-desktop/src/plugins/plugin-loader.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/plugins/command-registry.ts<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts<br>apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx<br>apps/forge-desktop/src/panels/ai/AIEnginePanel.tsx<br>apps/forge-desktop/src/panels/terminal/TerminalPanel.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/src/stores/command-palette-store.ts<br>apps/forge-desktop/src/services/workspace-client.ts<br>apps/forge-desktop/src/services/platform-diagnostics-service.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/tests/plugin-manager.test.ts |

### Renderer Runtime UI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/runtime/EnvironmentDoctorView.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/runtime-store.ts | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx | react<br>lucide-react<br>apps/forge-desktop/src/components/ui/Badge.tsx<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/types/runtime-workspace.ts | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx | react<br>lucide-react<br>apps/forge-desktop/src/components/ui/Badge.tsx<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/types/runtime-workspace.ts | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/panels/runtime/RuntimeLogs.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/runtime-store.ts | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx | react<br>lucide-react<br>apps/forge-desktop/src/components/ui/PanelHeader.tsx<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/panels/runtime/RuntimeToolbar.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeLogs.tsx<br>apps/forge-desktop/src/panels/runtime/EnvironmentDoctorView.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeSessionView.tsx | apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/panels/runtime/RuntimeSessionView.tsx | react<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/types/runtime-workspace.ts<br>lucide-react | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |
| apps/forge-desktop/src/panels/runtime/RuntimeToolbar.tsx | react<br>lucide-react<br>apps/forge-desktop/src/stores/runtime-store.ts<br>apps/forge-desktop/src/types/runtime-workspace.ts | apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx |

### Renderer Services

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/services/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx<br>apps/forge-desktop/src/stores/intelligence-store.ts |
| apps/forge-desktop/src/services/focus-service.ts | apps/forge-desktop/src/stores/focus-store.ts<br>apps/forge-desktop/src/eventbus/desktop-eventbus.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/layouts/DockHost.tsx<br>apps/forge-desktop/tests/focus-service.test.ts |
| apps/forge-desktop/src/services/platform-diagnostics-service.ts | apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/stores/focus-store.ts<br>apps/forge-desktop/src/plugins/panel-registry.ts<br>apps/forge-desktop/src/plugins/command-registry.ts | apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/services/runtime/RuntimeSessionManager.ts | apps/forge-desktop/src/types/runtime-workspace.ts<br>apps/forge-desktop/src/services/runtime/RuntimeTelemetry.ts | apps/forge-desktop/src/stores/runtime-store.ts |
| apps/forge-desktop/src/services/runtime/RuntimeTelemetry.ts | apps/forge-desktop/src/types/runtime-workspace.ts | apps/forge-desktop/src/services/runtime/RuntimeSessionManager.ts<br>apps/forge-desktop/src/stores/runtime-store.ts |
| apps/forge-desktop/src/services/session-client.ts | (none) | apps/forge-desktop/src/services/session-helper.ts |
| apps/forge-desktop/src/services/session-helper.ts | apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/src/stores/editor-store.ts<br>apps/forge-desktop/src/stores/layout-store.ts<br>apps/forge-desktop/src/services/session-client.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/stores/workspace-store.ts |
| apps/forge-desktop/src/services/workspace-client.ts | apps/forge-desktop/electron/main/container/service-interfaces.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/layouts/WelcomeScreen.tsx<br>apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/stores/workspace-store.ts |

### Renderer State Stores

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/stores/action-store.ts | zustand | apps/forge-desktop/src/panels/actions/ActionCard.tsx<br>apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx<br>apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx<br>apps/forge-desktop/src/panels/actions/ApprovalBar.tsx |
| apps/forge-desktop/src/stores/agent-store.ts | zustand | apps/forge-desktop/src/components/ui/CommandPaletteModal.tsx<br>apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx |
| apps/forge-desktop/src/stores/ai-store.ts | zustand | apps/forge-desktop/src/hooks/useAgentBridge.ts<br>apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx<br>apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx<br>apps/forge-desktop/src/panels/ai/AIEnginePanel.tsx |
| apps/forge-desktop/src/stores/command-palette-store.ts | zustand | apps/forge-desktop/src/components/CommandPalette.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/stores/editor-store.ts | zustand | apps/forge-desktop/src/panels/ai/AIEnginePanel.tsx<br>apps/forge-desktop/src/panels/editor/EditorPanel.tsx<br>apps/forge-desktop/src/panels/editor/EditorTabs.tsx<br>apps/forge-desktop/src/panels/editor/MonacoAdapter.tsx<br>apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx<br>apps/forge-desktop/src/services/session-helper.ts<br>apps/forge-desktop/src/stores/workspace-store.ts<br>apps/forge-desktop/tests/editor-store.test.ts |
| apps/forge-desktop/src/stores/focus-store.ts | zustand | apps/forge-desktop/src/services/focus-service.ts<br>apps/forge-desktop/src/services/platform-diagnostics-service.ts<br>apps/forge-desktop/tests/focus-service.test.ts |
| apps/forge-desktop/src/stores/intelligence-store.ts | zustand<br>apps/forge-desktop/src/services/engineering-intelligence-engine.ts | (none) |
| apps/forge-desktop/src/stores/layout-store.ts | zustand | apps/forge-desktop/src/components/DockDivider.tsx<br>apps/forge-desktop/src/layouts/ActivityBar.tsx<br>apps/forge-desktop/src/layouts/DockHost.tsx<br>apps/forge-desktop/src/layouts/DockTabBar.tsx<br>apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx<br>apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/services/platform-diagnostics-service.ts<br>apps/forge-desktop/src/services/session-helper.ts<br>apps/forge-desktop/tests/layout-store.test.ts |
| apps/forge-desktop/src/stores/project-store.ts | zustand<br>apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts | apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx |
| apps/forge-desktop/src/stores/run-store.ts | zustand<br>apps/forge-desktop/src/types/agent.ts | apps/forge-desktop/src/components/ui/CommandPaletteModal.tsx<br>apps/forge-desktop/src/hooks/useAgentBridge.ts<br>apps/forge-desktop/src/panels/agent/InboxStrip.tsx<br>apps/forge-desktop/src/panels/agent/RecentRunsDrawer.tsx<br>apps/forge-desktop/src/panels/agent/RunTimeline.tsx |
| apps/forge-desktop/src/stores/runtime-store.ts | zustand<br>apps/forge-desktop/src/types/runtime-workspace.ts<br>apps/forge-desktop/src/services/runtime/RuntimeSessionManager.ts<br>apps/forge-desktop/src/services/runtime/RuntimeTelemetry.ts | apps/forge-desktop/src/panels/runtime/EnvironmentDoctorView.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeCard.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeDetails.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeLogs.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeManagerPanel.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeSessionView.tsx<br>apps/forge-desktop/src/panels/runtime/RuntimeToolbar.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts |
| apps/forge-desktop/src/stores/session-store.ts | zustand | (none) |
| apps/forge-desktop/src/stores/theme-store.ts | zustand<br>zustand/middleware<br>apps/forge-desktop/src/themes/vscode-compat.ts<br>apps/forge-desktop/src/themes/theme-loader.ts<br>apps/forge-desktop/src/themes/theme-manager.ts<br>apps/forge-desktop/src/themes/theme-registry.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/panels/editor/MonacoAdapter.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/tests/theme-manager.test.ts |
| apps/forge-desktop/src/stores/workspace-store.ts | zustand<br>apps/forge-desktop/electron/main/container/service-interfaces.ts<br>apps/forge-desktop/src/services/workspace-client.ts<br>apps/forge-desktop/src/services/session-helper.ts<br>apps/forge-desktop/src/stores/editor-store.ts | apps/forge-desktop/src/app/App.tsx<br>apps/forge-desktop/src/layouts/StatusBar.tsx<br>apps/forge-desktop/src/layouts/WelcomeScreen.tsx<br>apps/forge-desktop/src/panels/explorer/ExplorerPanel.tsx<br>apps/forge-desktop/src/plugins/plugin-manager.ts<br>apps/forge-desktop/src/services/session-helper.ts |

### Renderer Themes

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/themes/theme-loader.ts | apps/forge-desktop/src/themes/vscode-compat.ts<br>apps/forge-desktop/src/themes/built-in/forge-dark.json<br>apps/forge-desktop/src/themes/built-in/forge-light.json | apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/tests/theme-manager.test.ts |
| apps/forge-desktop/src/themes/theme-manager.ts | apps/forge-desktop/src/themes/vscode-compat.ts | apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/tests/theme-manager.test.ts |
| apps/forge-desktop/src/themes/theme-registry.ts | apps/forge-desktop/src/themes/vscode-compat.ts | apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/tests/theme-manager.test.ts |
| apps/forge-desktop/src/themes/vscode-compat.ts | (none) | apps/forge-desktop/src/stores/theme-store.ts<br>apps/forge-desktop/src/themes/theme-loader.ts<br>apps/forge-desktop/src/themes/theme-manager.ts<br>apps/forge-desktop/src/themes/theme-registry.ts<br>apps/forge-desktop/tests/theme-manager.test.ts |

### Renderer Workspace UI

| File | Imports / Depends On | Imported By |
|---|---|---|
| apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx | react<br>apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx | (none) |
| apps/forge-desktop/src/panels/workspace/RecentProjects.tsx | react | (none) |
| apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx | react | apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx |
| apps/forge-desktop/src/panels/workspace/WorkspaceInsightsPanel.tsx | react | (none) |

### Repository Root Config/Docs

| File | Imports / Depends On | Imported By |
|---|---|---|
| eslint.config.mjs | @typescript-eslint/eslint-plugin<br>@typescript-eslint/parser | (none) |

### Shared Domain Models

| File | Imports / Depends On | Imported By |
|---|---|---|
| packages/shared/src/domain/agent.ts | (none) | packages/shared/src/events/schema.ts<br>packages/shared/src/index.ts |
| packages/shared/src/domain/ai.ts | (none) | packages/shared/src/index.ts |
| packages/shared/src/domain/context.ts | packages/shared/src/domain/symbol.ts<br>packages/shared/src/domain/graph.ts | packages/shared/src/index.ts |
| packages/shared/src/domain/graph.ts | packages/shared/src/domain/symbol.ts | packages/shared/src/domain/context.ts<br>packages/shared/src/events/schema.ts<br>packages/shared/src/index.ts |
| packages/shared/src/domain/manifest.ts | packages/shared/src/permissions/permission.ts | packages/shared/src/index.ts |
| packages/shared/src/domain/memory.ts | (none) | packages/shared/src/index.ts |
| packages/shared/src/domain/planner.ts | (none) | packages/shared/src/index.ts |
| packages/shared/src/domain/relationship.ts | packages/shared/src/domain/symbol.ts | packages/shared/src/domain/symbol.ts<br>packages/shared/src/events/schema.ts<br>packages/shared/src/index.ts |
| packages/shared/src/domain/retrieval.ts | (none) | packages/shared/src/index.ts |
| packages/shared/src/domain/symbol.ts | packages/shared/src/domain/relationship.ts | packages/shared/src/domain/context.ts<br>packages/shared/src/domain/graph.ts<br>packages/shared/src/domain/relationship.ts<br>packages/shared/src/events/schema.ts<br>packages/shared/src/index.ts |
| packages/shared/src/domain/tools.ts | (none) | packages/shared/src/index.ts |
| packages/shared/src/domain/workspace.ts | (none) | packages/shared/src/events/schema.ts<br>packages/shared/src/index.ts |

### Shared Event Contracts

| File | Imports / Depends On | Imported By |
|---|---|---|
| packages/shared/src/events/schema.ts | packages/shared/src/domain/workspace.ts<br>packages/shared/src/domain/symbol.ts<br>packages/shared/src/domain/relationship.ts<br>packages/shared/src/domain/graph.ts<br>packages/shared/src/domain/agent.ts | packages/shared/src/index.ts |
| packages/shared/src/events/workbench-events.ts | (none) | packages/shared/src/index.ts<br>packages/shared/src/sdk/extension-sdk.ts |

### Shared Extension SDK

| File | Imports / Depends On | Imported By |
|---|---|---|
| packages/shared/src/sdk/extension-sdk.ts | packages/shared/src/events/workbench-events.ts<br>packages/shared/src/permissions/permission.ts | packages/shared/src/index.ts |

### Shared Package Config

| File | Imports / Depends On | Imported By |
|---|---|---|
| packages/shared/src/index.ts | packages/shared/src/domain/workspace.ts<br>packages/shared/src/domain/symbol.ts<br>packages/shared/src/domain/relationship.ts<br>packages/shared/src/domain/graph.ts<br>packages/shared/src/domain/context.ts<br>packages/shared/src/domain/retrieval.ts<br>packages/shared/src/domain/tools.ts<br>packages/shared/src/domain/planner.ts<br>packages/shared/src/domain/ai.ts<br>packages/shared/src/domain/memory.ts<br>packages/shared/src/domain/agent.ts<br>packages/shared/src/events/schema.ts<br>packages/shared/src/events/workbench-events.ts<br>packages/shared/src/permissions/permission.ts<br>packages/shared/src/domain/manifest.ts<br>packages/shared/src/sdk/extension-sdk.ts | apps/forge-desktop/electron/main/platform/architecture-validator.ts<br>apps/forge-desktop/electron/main/platform/platform-inspector-service.ts<br>apps/forge-desktop/tests/architecture-validator.test.ts<br>apps/forge-desktop/tests/extension-sdk.test.ts |

### Shared Permissions

| File | Imports / Depends On | Imported By |
|---|---|---|
| packages/shared/src/permissions/permission.ts | (none) | packages/shared/src/domain/manifest.ts<br>packages/shared/src/index.ts<br>packages/shared/src/sdk/extension-sdk.ts |

### Zero Incoming Source Files

- apps/forge-desktop/electron/main/ai/cli/index.ts
- apps/forge-desktop/electron/main/ai/external/index.ts
- apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts
- apps/forge-desktop/electron/main/ai/outcome/outcome-events.ts
- apps/forge-desktop/electron/main/ai/recovery/recovery-events.ts
- apps/forge-desktop/electron/main/ai/runtime/index.ts
- apps/forge-desktop/electron/main/logging/file-sink.ts
- apps/forge-desktop/postcss.config.cjs
- apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx
- apps/forge-desktop/src/components/ui/EmptyState.tsx
- apps/forge-desktop/src/components/ui/Skeleton.tsx
- apps/forge-desktop/src/hooks/useCommand.ts
- apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx
- apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx
- apps/forge-desktop/src/panels/actions/ApprovalBar.tsx
- apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx
- apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx
- apps/forge-desktop/src/panels/editor/interfaces.ts
- apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx
- apps/forge-desktop/src/panels/workspace/RecentProjects.tsx
- apps/forge-desktop/src/panels/workspace/WorkspaceInsightsPanel.tsx
- apps/forge-desktop/src/plugins/contribution-point.ts
- apps/forge-desktop/src/stores/intelligence-store.ts
- apps/forge-desktop/src/stores/session-store.ts
- apps/forge-desktop/src/types/forge-api.d.ts
- apps/forge-desktop/src/types/workspace-metadata.d.ts
- apps/forge-desktop/src/utils/animation-controller.ts
- apps/forge-desktop/tailwind.config.cjs
- apps/forge-desktop/tests/setup.ts
- apps/forge-desktop/vite.config.ts
- apps/forge-desktop/vitest.config.ts
- eslint.config.mjs

### Circular Dependencies

- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/agent/agent-loop.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/agent/agent-loop.ts -> apps/forge-desktop/electron/main/ai/verification/verification-engine.ts -> apps/forge-desktop/electron/main/ai/verification/verification-pipeline.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/agent/agent-loop.ts -> apps/forge-desktop/electron/main/ai/verification/verification-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts -> apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts -> apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts -> apps/forge-desktop/electron/main/ai/context/context-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts -> apps/forge-desktop/electron/main/ai/reflection/reflection-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts -> apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/context/prompt-normalizer.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/context/context-collectors.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/knowledge/semantic-knowledge-builder.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/session/conversation-manager.ts -> apps/forge-desktop/electron/main/ai/session/ai-session-service.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/execution/execution-types.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/execution/execution-scheduler.ts -> apps/forge-desktop/electron/main/ai/execution/task-dispatcher.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/execution/execution-context.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-context.ts -> apps/forge-desktop/electron/main/ai/learning/learning-engine.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts -> apps/forge-desktop/electron/main/ai/recovery/recovery-orchestrator.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-stage.ts -> apps/forge-desktop/electron/main/ai/outcome/outcome-manager.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-executor.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/ai/pipeline/pipeline-recorder.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/orchestrator/ai-orchestrator.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts -> apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts -> apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts -> apps/forge-desktop/electron/main/ai/external/external-runtime.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- apps/forge-desktop/electron/main/container/service-interfaces.ts -> apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts -> apps/forge-desktop/electron/main/container/service-interfaces.ts
- packages/shared/src/domain/symbol.ts -> packages/shared/src/domain/relationship.ts -> packages/shared/src/domain/symbol.ts
- apps/forge-desktop/src/stores/workspace-store.ts -> apps/forge-desktop/src/services/session-helper.ts -> apps/forge-desktop/src/stores/workspace-store.ts

## Duplicate / Overlapping Logic

### Repeated File Concepts

- cli-runtime: apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- dependency-graph: apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts, apps/forge-desktop/electron/main/platform/dependency-graph.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- symbol-index: apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts, apps/forge-desktop/electron/main/platform/symbol-index.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- engineering-intelligence-engine: apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts, apps/forge-desktop/src/services/engineering-intelligence-engine.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- incremental-indexer: apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts, apps/forge-desktop/electron/main/platform/incremental-indexer.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- planner: apps/forge-desktop/electron/main/ai/planner/planner.ts, packages/shared/src/domain/planner.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- runtime-types: apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts, apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- gemini-runtime: apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.
- agent: apps/forge-desktop/src/types/agent.ts, packages/shared/src/domain/agent.ts. Prefer the file with incoming production references; same-name tests or adapters are not automatically redundant.

### Repeated Export Names

- IIpcRouter: apps/forge-desktop/electron/ipc/interfaces.ts, apps/forge-desktop/electron/main/container/service-interfaces.ts
- LoggerMiddleware: apps/forge-desktop/electron/ipc/ipc-middleware.ts, apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts
- DependencyGraph: apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts, apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts
- SymbolKind: apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts, packages/shared/src/domain/symbol.ts
- IExecutionResult: apps/forge-desktop/electron/main/ai/execution/execution-types.ts, packages/shared/src/domain/tools.ts
- ToolInvocation: apps/forge-desktop/electron/main/ai/execution/execution-types.ts, apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts
- DeadCodeReport: apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts, apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts
- MemoryConsolidator: apps/forge-desktop/electron/main/ai/learning/learning-engine.ts, apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts
- IGoal: apps/forge-desktop/electron/main/ai/planner/goal-extractor.ts, packages/shared/src/domain/planner.ts
- IIntent: apps/forge-desktop/electron/main/ai/planner/intent-detector.ts, packages/shared/src/domain/context.ts
- IValidationResult: apps/forge-desktop/electron/main/ai/planner/plan-validator.ts, apps/forge-desktop/electron/main/container/interfaces.ts
- EnvironmentIssue: apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts, apps/forge-desktop/src/types/runtime-workspace.ts
- EnvironmentVariableStatus: apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts, apps/forge-desktop/src/types/runtime-workspace.ts
- EnvironmentDiagnostics: apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts, apps/forge-desktop/src/types/runtime-workspace.ts
- DiscoveredRuntime: apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts, apps/forge-desktop/src/types/runtime-workspace.ts
- ValidationResult: apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts, apps/forge-desktop/electron/main/config/configuration-validator.ts
- AnthropicRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- OpenAICompatibleRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- GeminiRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- GroqRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- OpenAIRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- OpenRouterRuntime: apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts, apps/forge-desktop/electron/main/ai/runtime/index.ts
- RuntimeManager: apps/forge-desktop/electron/main/ai/runtime/index.ts, apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts
- NormalizedRuntimeEventType: apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts, apps/forge-desktop/src/types/runtime-workspace.ts
- IMessage: apps/forge-desktop/electron/main/ai/session/conversation-manager.ts, apps/forge-desktop/src/stores/ai-store.ts
- ConfigurationLoader: apps/forge-desktop/electron/main/config/configuration-loader.ts, apps/forge-desktop/electron/main/config/index.ts
- createDefaultConfig: apps/forge-desktop/electron/main/config/configuration-schema.ts, apps/forge-desktop/electron/main/config/index.ts
- ConfigurationService: apps/forge-desktop/electron/main/config/configuration-service.ts, apps/forge-desktop/electron/main/config/index.ts
- ConfigurationStore: apps/forge-desktop/electron/main/config/configuration-store.ts, apps/forge-desktop/electron/main/config/index.ts
- validateConfig: apps/forge-desktop/electron/main/config/configuration-validator.ts, apps/forge-desktop/electron/main/config/index.ts
- IDesktopEventBus: apps/forge-desktop/electron/main/container/interfaces.ts, apps/forge-desktop/electron/main/container/service-interfaces.ts
- IWindowState: apps/forge-desktop/electron/main/container/service-interfaces.ts, apps/forge-desktop/electron/main/window-manager.ts, apps/forge-desktop/src/types/forge-api.d.ts
- ISymbol: apps/forge-desktop/electron/main/platform/repository-types.ts, packages/shared/src/domain/symbol.ts
- IWorkspaceConfig: apps/forge-desktop/electron/main/workspace-metadata.ts, apps/forge-desktop/src/types/workspace-metadata.d.ts
- UserService: apps/forge-desktop/tests/code-intelligence.test.ts, apps/forge-desktop/tests/workspace-context-engine.test.ts

## Merge Candidates

| Candidate | Sole Importer | Basis |
|---|---|---|
| apps/forge-desktop/electron/ipc/handlers/session-handlers.ts | apps/forge-desktop/electron/main/startup-manager.ts | 25 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/ipc/handlers/system-handlers.ts | apps/forge-desktop/electron/main/startup-manager.ts | 47 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts | apps/forge-desktop/electron/main/startup-manager.ts | 26 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/ipc/handlers/window-handlers.ts | apps/forge-desktop/electron/main/startup-manager.ts | 28 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts | 32 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts | 40 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts | 20 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts | 29 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts | apps/forge-desktop/electron/main/ai/actions/action-executor.ts | 27 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts | apps/forge-desktop/electron/main/ai/cli/sdk/index.ts | 68 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts | apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts | 67 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 34 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 50 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 24 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 32 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 24 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 24 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 22 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts | apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | 23 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts | apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts | 60 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts | apps/forge-desktop/electron/main/ai/memory/memory-engine.ts | 66 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/ai/session/provider-registry.ts | apps/forge-desktop/tests/ai-foundation.test.ts | 13 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/modules/ipc.module.ts | apps/forge-desktop/electron/main/index.ts | 39 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/modules/startup.module.ts | apps/forge-desktop/electron/main/index.ts | 55 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/performance-monitor.ts | apps/forge-desktop/electron/main/modules/performance.module.ts | 43 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/feature-registry.ts | apps/forge-desktop/electron/main/startup-manager.ts | 71 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/internal-platform.ts | apps/forge-desktop/electron/main/startup-manager.ts | 17 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/observability.ts | apps/forge-desktop/electron/main/startup-manager.ts | 56 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/platform-recovery-service.ts | apps/forge-desktop/electron/main/startup-manager.ts | 69 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/runtime-health-service.ts | apps/forge-desktop/electron/main/startup-manager.ts | 42 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/platform/runtime-registry.ts | apps/forge-desktop/electron/main/platform/runtime-kernel.ts | 60 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/electron/main/theme-service.ts | apps/forge-desktop/electron/main/modules/theme.module.ts | 26 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/components/DockPanel.tsx | apps/forge-desktop/src/layouts/DockHost.tsx | 24 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/layouts/StatusBar.tsx | apps/forge-desktop/src/layouts/WorkspaceLayout.tsx | 65 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/layouts/WorkspaceLayout.tsx | apps/forge-desktop/src/app/App.tsx | 18 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/actions/ActionCard.tsx | apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx | 68 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | 43 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | 45 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx | apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | 52 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/editor/EditorPanel.tsx | apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx | 36 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/editor/EditorTabs.tsx | apps/forge-desktop/src/panels/editor/EditorPanel.tsx | 53 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/editor/monaco-config.ts | apps/forge-desktop/src/main.tsx | 42 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx | apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx | 76 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/plugins/plugin-loader.ts | apps/forge-desktop/src/plugins/plugin-manager.ts | 19 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/services/platform-diagnostics-service.ts | apps/forge-desktop/src/plugins/plugin-manager.ts | 50 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/services/session-client.ts | apps/forge-desktop/src/services/session-helper.ts | 25 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/stores/project-store.ts | apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx | 78 LOC and one internal incoming reference. Review API boundaries before merging. |
| apps/forge-desktop/src/types/comment-types.ts | apps/forge-desktop/src/components/review/CommentThread.tsx | 15 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/ai.ts | packages/shared/src/index.ts | 34 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/context.ts | packages/shared/src/index.ts | 80 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/manifest.ts | packages/shared/src/index.ts | 47 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/memory.ts | packages/shared/src/index.ts | 52 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/retrieval.ts | packages/shared/src/index.ts | 44 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/domain/tools.ts | packages/shared/src/index.ts | 23 LOC and one internal incoming reference. Review API boundaries before merging. |
| packages/shared/src/sdk/extension-sdk.ts | packages/shared/src/index.ts | 76 LOC and one internal incoming reference. Review API boundaries before merging. |

## Dead / Unused Code

### Safe To Delete

- Generated build/cache artifacts are reproducible and have no source incoming references: 526 files under `apps/forge-desktop/dist-electron/` plus package `tsconfig.tsbuildinfo` files.

### Needs Manual Check

- Zero-incoming source files may be entry points, dynamically loaded modules, IPC handlers, test targets, or planned surfaces; review before deletion.
- apps/forge-desktop/electron/main/ai/cli/index.ts
- apps/forge-desktop/electron/main/ai/external/index.ts
- apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts
- apps/forge-desktop/electron/main/ai/outcome/outcome-events.ts
- apps/forge-desktop/electron/main/ai/recovery/recovery-events.ts
- apps/forge-desktop/electron/main/ai/runtime/index.ts
- apps/forge-desktop/electron/main/logging/file-sink.ts
- apps/forge-desktop/postcss.config.cjs
- apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx
- apps/forge-desktop/src/components/ui/EmptyState.tsx
- apps/forge-desktop/src/components/ui/Skeleton.tsx
- apps/forge-desktop/src/hooks/useCommand.ts
- apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx
- apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx
- apps/forge-desktop/src/panels/actions/ApprovalBar.tsx
- apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx
- apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx
- apps/forge-desktop/src/panels/editor/interfaces.ts
- apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx
- apps/forge-desktop/src/panels/workspace/RecentProjects.tsx
- apps/forge-desktop/src/panels/workspace/WorkspaceInsightsPanel.tsx
- apps/forge-desktop/src/plugins/contribution-point.ts
- apps/forge-desktop/src/stores/intelligence-store.ts
- apps/forge-desktop/src/stores/session-store.ts
- apps/forge-desktop/src/types/forge-api.d.ts
- apps/forge-desktop/src/types/workspace-metadata.d.ts
- apps/forge-desktop/src/utils/animation-controller.ts
- apps/forge-desktop/tailwind.config.cjs
- apps/forge-desktop/tests/setup.ts
- apps/forge-desktop/vite.config.ts
- apps/forge-desktop/vitest.config.ts
- eslint.config.mjs

### Commented-Out Blocks

- apps/forge-cli/src/index.ts: 1 possible commented code lines near 3
- apps/forge-desktop/electron/ipc/handlers/system-handlers.ts: 1 possible commented code lines near 7
- apps/forge-desktop/electron/ipc/handlers/terminal-handlers.ts: 5 possible commented code lines near 6, 21, 51, 63, 76
- apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts: 1 possible commented code lines near 6
- apps/forge-desktop/electron/ipc/handlers/window-handlers.ts: 1 possible commented code lines near 3
- apps/forge-desktop/electron/ipc/handlers/workspace-handlers.ts: 2 possible commented code lines near 5, 24
- apps/forge-desktop/electron/ipc/interfaces.ts: 5 possible commented code lines near 23, 25, 27, 29, 31
- apps/forge-desktop/electron/ipc/ipc-middleware.ts: 2 possible commented code lines near 3, 24
- apps/forge-desktop/electron/ipc/ipc-router.ts: 1 possible commented code lines near 10
- apps/forge-desktop/electron/main/ai/actions/action-events.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/action-executor.ts: 2 possible commented code lines near 1, 46
- apps/forge-desktop/electron/main/ai/actions/action-history.ts: 3 possible commented code lines near 1, 34, 107
- apps/forge-desktop/electron/main/ai/actions/action-registry.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/action-types.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/action-validator.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/providers/core-action-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/providers/git-action-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/actions/providers/ui-action-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/agent/agent-loop.ts: 8 possible commented code lines near 1, 59, 61, 63, 65, 67, 69, 71
- apps/forge-desktop/electron/main/ai/cli/cli-adapter.ts: 6 possible commented code lines near 1, 15, 20, 25, 30, 35
- apps/forge-desktop/electron/main/ai/cli/cli-capabilities.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-discovery.ts: 2 possible commented code lines near 1, 28
- apps/forge-desktop/electron/main/ai/cli/cli-errors.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-manager.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-process.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-session.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-stream.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/cli-types.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-diagnostics.ts: 2 possible commented code lines near 1, 26
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-discovery.ts: 2 possible commented code lines near 1, 30
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-loader.ts: 2 possible commented code lines near 1, 15
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-manifest.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-permissions.ts: 2 possible commented code lines near 1, 29
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-registry.ts: 7 possible commented code lines near 1, 27, 34, 42, 54, 69, 90
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts: 2 possible commented code lines near 1, 24
- apps/forge-desktop/electron/main/ai/cli/sdk/adapter-validator.ts: 2 possible commented code lines near 1, 19
- apps/forge-desktop/electron/main/ai/cli/sdk/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/ast-parser.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/call-graph.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/dependency-graph.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/repository-scanner.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/code-intelligence/symbol-index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/context/context-budget.ts: 2 possible commented code lines near 1, 17
- apps/forge-desktop/electron/main/ai/context/context-engine.ts: 3 possible commented code lines near 1, 64, 88
- apps/forge-desktop/electron/main/ai/context/context-selector.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/context/context-sources.ts: 2 possible commented code lines near 1, 196
- apps/forge-desktop/electron/main/ai/context/prompt-assembly-engine.ts: 7 possible commented code lines near 1, 31, 33, 35, 37, 39, 41
- apps/forge-desktop/electron/main/ai/context/repository-indexer.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/contracts/execution-contracts.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/errors/planning-errors.ts: 3 possible commented code lines near 1, 16, 57
- apps/forge-desktop/electron/main/ai/execution/execution-graph-engine.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/external/external-environment.ts: 3 possible commented code lines near 1, 31, 53
- apps/forge-desktop/electron/main/ai/external/external-process.ts: 4 possible commented code lines near 1, 20, 59, 69
- apps/forge-desktop/electron/main/ai/external/external-runtime-manager.ts: 2 possible commented code lines near 1, 16
- apps/forge-desktop/electron/main/ai/external/external-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/external/external-session.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/external/external-stream-parser.ts: 3 possible commented code lines near 1, 14, 32
- apps/forge-desktop/electron/main/ai/external/external-types.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/external/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts: 11 possible commented code lines near 1, 126, 155, 198, 211, 237, 263, 280
- apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/learning/runtime-learning-engine.ts: 3 possible commented code lines near 1, 43, 90
- apps/forge-desktop/electron/main/ai/mcp/mcp-client.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/mcp/mcp-server.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/mcp/mcp-transport.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/memory/memory-engine.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/memory/memory-indexer.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/memory/memory-retriever.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/memory/memory-store.ts: 2 possible commented code lines near 1, 43
- apps/forge-desktop/electron/main/ai/memory/memory-types.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/orchestration/execution-orchestrator.ts: 7 possible commented code lines near 1, 35, 37, 39, 41, 43, 45
- apps/forge-desktop/electron/main/ai/planner/planning-graph.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/routing/capability-matcher.ts: 2 possible commented code lines near 1, 20
- apps/forge-desktop/electron/main/ai/routing/intent-analyzer.ts: 2 possible commented code lines near 1, 12
- apps/forge-desktop/electron/main/ai/routing/runtime-router.ts: 3 possible commented code lines near 1, 32, 95
- apps/forge-desktop/electron/main/ai/routing/runtime-scorer.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime-discovery/environment-doctor.ts: 2 possible commented code lines near 1, 45
- apps/forge-desktop/electron/main/ai/runtime-discovery/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-cache.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-config.ts: 3 possible commented code lines near 1, 70, 77
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-detector.ts: 2 possible commented code lines near 1, 29
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-discovery-engine.ts: 8 possible commented code lines near 1, 44, 103, 111, 121, 135, 144, 159
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-events.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-health.ts: 2 possible commented code lines near 1, 21
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-types.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime-discovery/runtime-validator.ts: 3 possible commented code lines near 1, 28, 81
- apps/forge-desktop/electron/main/ai/runtime/cli/aider-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cli/claude-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cli/cli-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cli/codex-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cli/gemini-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cli/goose-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cloud/anthropic-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cloud/cloud-helpers.ts: 17 possible commented code lines near 1, 27, 65, 81, 103, 125, 134, 141
- apps/forge-desktop/electron/main/ai/runtime/cloud/gemini-runtime.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/cloud/groq-runtime.ts: 1 possible commented code lines near 5
- apps/forge-desktop/electron/main/ai/runtime/cloud/openai-runtime.ts: 1 possible commented code lines near 5
- apps/forge-desktop/electron/main/ai/runtime/cloud/openrouter-runtime.ts: 1 possible commented code lines near 5
- apps/forge-desktop/electron/main/ai/runtime/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/runtime-event-bus.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/runtime-execution-manager.ts: 7 possible commented code lines near 1, 45, 106, 139, 181, 198, 220
- apps/forge-desktop/electron/main/ai/runtime/runtime-manager.ts: 2 possible commented code lines near 1, 94
- apps/forge-desktop/electron/main/ai/runtime/runtime-session-state.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/runtime-session-storage.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/runtime/runtime-types.ts: 18 possible commented code lines near 1, 17, 31, 33, 35, 41, 48, 51
- apps/forge-desktop/electron/main/ai/session/provider-registry.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/session/workspace-profile.ts: 3 possible commented code lines near 1, 21, 59
- apps/forge-desktop/electron/main/ai/session/workspace-session-manager.ts: 4 possible commented code lines near 1, 33, 46, 61
- apps/forge-desktop/electron/main/ai/tools/built-in-tools.ts: 1 possible commented code lines near 245
- apps/forge-desktop/electron/main/ai/tools/tool-execution-engine.ts: 9 possible commented code lines near 1, 16, 18, 20, 25, 27, 29, 31
- apps/forge-desktop/electron/main/ai/workflow/workflow-engine.ts: 2 possible commented code lines near 1, 29
- apps/forge-desktop/electron/main/ai/workspace/file-operations.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/workspace/patch-engine.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/workspace/workspace-diff.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/workspace/workspace-engine.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/ai/workspace/workspace-snapshot.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/config/configuration-loader.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/config/configuration-schema.ts: 2 possible commented code lines near 1, 27
- apps/forge-desktop/electron/main/config/configuration-service.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/config/configuration-store.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/config/configuration-validator.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/config/index.ts: 1 possible commented code lines near 1
- apps/forge-desktop/electron/main/container/desktop-container.ts: 3 possible commented code lines near 48, 771, 815
- apps/forge-desktop/electron/main/container/graph-exporter.ts: 3 possible commented code lines near 3, 35, 76
- apps/forge-desktop/electron/main/container/interfaces.ts: 22 possible commented code lines near 1, 22, 24, 26, 33, 35, 37, 39
- apps/forge-desktop/electron/main/container/service-interfaces.ts: 2 possible commented code lines near 1, 255
- apps/forge-desktop/electron/main/container/service-scope.ts: 1 possible commented code lines near 4
- apps/forge-desktop/electron/main/container/tokens.ts: 2 possible commented code lines near 1, 163
- apps/forge-desktop/electron/main/logging/console-sink.ts: 1 possible commented code lines near 11
- apps/forge-desktop/electron/main/logging/desktop-logger.ts: 1 possible commented code lines near 7
- 105 additional files with possible commented code omitted from this section.

## Prioritized Action List

| Priority | Action | Item | Dependency-Graph Justification |
|---|---|---|---|
| P1 | [DELETE] | Generated Electron build output and tsbuildinfo files | 526 generated/cache files are not imported by source; package scripts regenerate them via build/tsc. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/cli/index.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/external/index.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/mcp/mcp-resource-adapter.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/outcome/outcome-events.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/recovery/recovery-events.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/ai/runtime/index.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/electron/main/logging/file-sink.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/postcss.config.cjs | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/components/ui/EmptyState.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/components/ui/Skeleton.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/hooks/useCommand.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/actions/ActionHistoryDrawer.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/actions/ApprovalBar.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/agent/WorkspaceMapPanel.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/ai/EngineeringDashboardPanel.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/editor/interfaces.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/workspace/RecentProjects.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/panels/workspace/WorkspaceInsightsPanel.tsx | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/plugins/contribution-point.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/stores/intelligence-store.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/stores/session-store.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/types/forge-api.d.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/types/workspace-metadata.d.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/src/utils/animation-controller.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/tailwind.config.cjs | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/tests/setup.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/vite.config.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | apps/forge-desktop/vitest.config.ts | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P2 | [INVESTIGATE] | eslint.config.mjs | Static graph shows zero incoming references; may still be runtime entry/dynamic path. |
| P3 | [MERGE] | apps/forge-desktop/electron/ipc/handlers/session-handlers.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/ipc/handlers/session-handlers.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 25 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/ipc/handlers/system-handlers.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/ipc/handlers/system-handlers.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 47 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/ipc/handlers/theme-handlers.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 26 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/ipc/handlers/window-handlers.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/ipc/handlers/window-handlers.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 28 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts into apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/middleware/action-middleware.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/actions/action-executor.ts) and is 32 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts into apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/middleware/approval-middleware.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/actions/action-executor.ts) and is 40 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts into apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/middleware/audit-middleware.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/actions/action-executor.ts) and is 20 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts into apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/middleware/logger-middleware.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/actions/action-executor.ts) and is 29 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts into apps/forge-desktop/electron/main/ai/actions/action-executor.ts | apps/forge-desktop/electron/main/ai/actions/middleware/permission-middleware.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/actions/action-executor.ts) and is 27 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts into apps/forge-desktop/electron/main/ai/cli/sdk/index.ts | apps/forge-desktop/electron/main/ai/cli/sdk/adapter-sdk.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/cli/sdk/index.ts) and is 68 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts into apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/code-intelligence/semantic-search.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/code-intelligence/code-intelligence-engine.ts) and is 67 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/incremental-indexer.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 34 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/architecture-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 50 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/deadcode-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 24 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/dependency-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 32 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/git-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 24 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/symbol-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 24 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/test-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 22 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts into apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts | apps/forge-desktop/electron/main/ai/intelligence/providers/todo-provider.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/intelligence/engineering-intelligence-engine.ts) and is 23 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts into apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts | apps/forge-desktop/electron/main/ai/mcp/mcp-tool-adapter.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/mcp/mcp-runtime.ts) and is 60 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts into apps/forge-desktop/electron/main/ai/memory/memory-engine.ts | apps/forge-desktop/electron/main/ai/memory/memory-consolidator.ts has exactly one incoming reference (apps/forge-desktop/electron/main/ai/memory/memory-engine.ts) and is 66 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/ai/session/provider-registry.ts into apps/forge-desktop/tests/ai-foundation.test.ts | apps/forge-desktop/electron/main/ai/session/provider-registry.ts has exactly one incoming reference (apps/forge-desktop/tests/ai-foundation.test.ts) and is 13 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/modules/ipc.module.ts into apps/forge-desktop/electron/main/index.ts | apps/forge-desktop/electron/main/modules/ipc.module.ts has exactly one incoming reference (apps/forge-desktop/electron/main/index.ts) and is 39 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/modules/startup.module.ts into apps/forge-desktop/electron/main/index.ts | apps/forge-desktop/electron/main/modules/startup.module.ts has exactly one incoming reference (apps/forge-desktop/electron/main/index.ts) and is 55 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/performance-monitor.ts into apps/forge-desktop/electron/main/modules/performance.module.ts | apps/forge-desktop/electron/main/performance-monitor.ts has exactly one incoming reference (apps/forge-desktop/electron/main/modules/performance.module.ts) and is 43 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/feature-registry.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/platform/feature-registry.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 71 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/internal-platform.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/platform/internal-platform.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 17 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/observability.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/platform/observability.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 56 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/platform-recovery-service.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/platform/platform-recovery-service.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 69 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/runtime-health-service.ts into apps/forge-desktop/electron/main/startup-manager.ts | apps/forge-desktop/electron/main/platform/runtime-health-service.ts has exactly one incoming reference (apps/forge-desktop/electron/main/startup-manager.ts) and is 42 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/platform/runtime-registry.ts into apps/forge-desktop/electron/main/platform/runtime-kernel.ts | apps/forge-desktop/electron/main/platform/runtime-registry.ts has exactly one incoming reference (apps/forge-desktop/electron/main/platform/runtime-kernel.ts) and is 60 LOC. |
| P3 | [MERGE] | apps/forge-desktop/electron/main/theme-service.ts into apps/forge-desktop/electron/main/modules/theme.module.ts | apps/forge-desktop/electron/main/theme-service.ts has exactly one incoming reference (apps/forge-desktop/electron/main/modules/theme.module.ts) and is 26 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/components/DockPanel.tsx into apps/forge-desktop/src/layouts/DockHost.tsx | apps/forge-desktop/src/components/DockPanel.tsx has exactly one incoming reference (apps/forge-desktop/src/layouts/DockHost.tsx) and is 24 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/layouts/StatusBar.tsx into apps/forge-desktop/src/layouts/WorkspaceLayout.tsx | apps/forge-desktop/src/layouts/StatusBar.tsx has exactly one incoming reference (apps/forge-desktop/src/layouts/WorkspaceLayout.tsx) and is 65 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/layouts/WorkspaceLayout.tsx into apps/forge-desktop/src/app/App.tsx | apps/forge-desktop/src/layouts/WorkspaceLayout.tsx has exactly one incoming reference (apps/forge-desktop/src/app/App.tsx) and is 18 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/actions/ActionCard.tsx into apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx | apps/forge-desktop/src/panels/actions/ActionCard.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/actions/ActionTimelinePanel.tsx) and is 68 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx into apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | apps/forge-desktop/src/panels/agent/components/AutonomyToggle.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx) and is 43 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx into apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | apps/forge-desktop/src/panels/agent/components/ModelSelector.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx) and is 45 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx into apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx | apps/forge-desktop/src/panels/agent/components/RuntimeSelector.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/agent/AgentPanelShell.tsx) and is 52 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/editor/EditorPanel.tsx into apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx | apps/forge-desktop/src/panels/editor/EditorPanel.tsx has exactly one incoming reference (apps/forge-desktop/src/layouts/WorkbenchLayoutManager.tsx) and is 36 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/editor/EditorTabs.tsx into apps/forge-desktop/src/panels/editor/EditorPanel.tsx | apps/forge-desktop/src/panels/editor/EditorTabs.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/editor/EditorPanel.tsx) and is 53 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/editor/monaco-config.ts into apps/forge-desktop/src/main.tsx | apps/forge-desktop/src/panels/editor/monaco-config.ts has exactly one incoming reference (apps/forge-desktop/src/main.tsx) and is 42 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx into apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx | apps/forge-desktop/src/panels/workspace/RuntimeRecommendationCard.tsx has exactly one incoming reference (apps/forge-desktop/src/panels/workspace/ProjectOverviewPanel.tsx) and is 76 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/plugins/plugin-loader.ts into apps/forge-desktop/src/plugins/plugin-manager.ts | apps/forge-desktop/src/plugins/plugin-loader.ts has exactly one incoming reference (apps/forge-desktop/src/plugins/plugin-manager.ts) and is 19 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/services/platform-diagnostics-service.ts into apps/forge-desktop/src/plugins/plugin-manager.ts | apps/forge-desktop/src/services/platform-diagnostics-service.ts has exactly one incoming reference (apps/forge-desktop/src/plugins/plugin-manager.ts) and is 50 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/services/session-client.ts into apps/forge-desktop/src/services/session-helper.ts | apps/forge-desktop/src/services/session-client.ts has exactly one incoming reference (apps/forge-desktop/src/services/session-helper.ts) and is 25 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/stores/project-store.ts into apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx | apps/forge-desktop/src/stores/project-store.ts has exactly one incoming reference (apps/forge-desktop/src/components/github/ImportRepositoryDialog.tsx) and is 78 LOC. |
| P3 | [MERGE] | apps/forge-desktop/src/types/comment-types.ts into apps/forge-desktop/src/components/review/CommentThread.tsx | apps/forge-desktop/src/types/comment-types.ts has exactly one incoming reference (apps/forge-desktop/src/components/review/CommentThread.tsx) and is 15 LOC. |
| P3 | [MERGE] | packages/shared/src/domain/ai.ts into packages/shared/src/index.ts | packages/shared/src/domain/ai.ts has exactly one incoming reference (packages/shared/src/index.ts) and is 34 LOC. |
| P3 | [MERGE] | packages/shared/src/domain/context.ts into packages/shared/src/index.ts | packages/shared/src/domain/context.ts has exactly one incoming reference (packages/shared/src/index.ts) and is 80 LOC. |
| P4 | [KEEP-AS-IS] | Core entrypoints, module registries, tests, docs, configs | They are reached by package scripts, runtime startup, or external tooling rather than normal imports. |

## Notes For Next Pass

- Start cleanup by deciding whether generated `dist-electron` and `tsconfig.tsbuildinfo` files belong in version control.
- Run `madge`, `ts-prune`, and `depcheck` after installing them if you want a second, tool-specific confirmation before deletion.
- Treat [MERGE] rows as candidates, not automatic edits; they are based on one-import graph shape and small size, then need readability review.