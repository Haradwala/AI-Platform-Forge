"use strict";
/**
 * architecture-provider.ts — Phase 25-28 Architecture Provider
 *
 * Generates high-level layer topology, entry points, and module graph nodes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchitectureProvider = void 0;
class ArchitectureProvider {
    getTopology(workspaceRoot) {
        return {
            layers: [
                {
                    name: 'Electron Main Process',
                    description: 'Core container, lifecycle, startup manager, IPC handlers',
                    moduleCount: 16,
                    files: ['electron/main/index.ts', 'electron/main/startup-manager.ts', 'electron/main/modules/ai.module.ts'],
                },
                {
                    name: 'AI Operating System & Orchestration',
                    description: 'Workflow Engine, Intent Analyzer, Runtime Router, Intelligence Providers',
                    moduleCount: 28,
                    files: [
                        'electron/main/ai/workflow/workflow-engine.ts',
                        'electron/main/ai/routing/runtime-router.ts',
                        'electron/main/ai/intelligence/engineering-intelligence-engine.ts',
                    ],
                },
                {
                    name: 'Renderer UI Shell',
                    description: 'React desktop interface, Zustand stores, workspace insights, session view',
                    moduleCount: 52,
                    files: ['src/App.tsx', 'src/panels/workspace/WorkspaceInsightsPanel.tsx', 'src/stores/session-store.ts'],
                },
            ],
            entryPoints: ['electron/main/index.ts', 'src/main.tsx', 'src/App.tsx', 'package.json'],
            moduleGraphNodes: [
                { id: 'app', name: 'App Shell', type: 'UI', connections: ['workspace-panel', 'runtime-panel'] },
                { id: 'orchestrator', name: 'AIOrchestrator', type: 'Backend', connections: ['workflow', 'router', 'session'] },
            ],
            frameworks: ['Electron', 'React 18', 'TypeScript 5', 'Zustand', 'Vite', 'Tailwind CSS'],
        };
    }
}
exports.ArchitectureProvider = ArchitectureProvider;
//# sourceMappingURL=architecture-provider.js.map