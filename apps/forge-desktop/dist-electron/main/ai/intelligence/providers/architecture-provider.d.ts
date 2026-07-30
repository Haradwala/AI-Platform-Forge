/**
 * architecture-provider.ts — Phase 25-28 Architecture Provider
 *
 * Generates high-level layer topology, entry points, and module graph nodes.
 */
export interface ArchitectureTopology {
    layers: Array<{
        name: string;
        description: string;
        moduleCount: number;
        files: string[];
    }>;
    entryPoints: string[];
    moduleGraphNodes: Array<{
        id: string;
        name: string;
        type: string;
        connections: string[];
    }>;
    frameworks: string[];
}
export declare class ArchitectureProvider {
    getTopology(workspaceRoot: string): ArchitectureTopology;
}
