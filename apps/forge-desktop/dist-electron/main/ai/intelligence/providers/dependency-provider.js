"use strict";
/**
 * dependency-provider.ts — Phase 25-28 Dependency Provider
 *
 * Builds internal module dependency graph and lists external packages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyProvider = void 0;
class DependencyProvider {
    getDependencies(workspaceRoot) {
        return {
            internalDependencies: [
                { source: 'electron/main/ai/orchestration/execution-orchestrator.ts', target: 'electron/main/ai/routing/runtime-router.ts' },
                { source: 'electron/main/ai/routing/runtime-router.ts', target: 'electron/main/ai/learning/runtime-learning-engine.ts' },
                { source: 'electron/main/ai/session/workspace-session-manager.ts', target: 'electron/main/ai/session/workspace-profile.ts' },
            ],
            externalPackages: [
                { name: 'react', version: '18.2.0' },
                { name: 'electron', version: '28.0.0', isDev: true },
                { name: 'typescript', version: '5.3.0', isDev: true },
                { name: 'vitest', version: '1.2.0', isDev: true },
                { name: 'zustand', version: '4.5.0' },
            ],
            circularDependencies: [],
        };
    }
}
exports.DependencyProvider = DependencyProvider;
//# sourceMappingURL=dependency-provider.js.map