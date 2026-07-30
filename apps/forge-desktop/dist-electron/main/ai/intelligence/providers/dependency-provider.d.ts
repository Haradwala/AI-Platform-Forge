/**
 * dependency-provider.ts — Phase 25-28 Dependency Provider
 *
 * Builds internal module dependency graph and lists external packages.
 */
export interface DependencyGraph {
    internalDependencies: Array<{
        source: string;
        target: string;
        isCircular?: boolean;
    }>;
    externalPackages: Array<{
        name: string;
        version: string;
        isDev?: boolean;
    }>;
    circularDependencies: Array<{
        cycle: string[];
    }>;
}
export declare class DependencyProvider {
    getDependencies(workspaceRoot: string): DependencyGraph;
}
