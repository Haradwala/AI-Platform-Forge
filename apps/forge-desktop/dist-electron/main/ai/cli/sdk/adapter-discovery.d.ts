/**
 * adapter-discovery.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Scans built-in paths, workspace directories, user home folders, and custom paths for CLI adapters.
 */
export interface DiscoveredAdapterPath {
    id: string;
    directoryPath: string;
    source: 'builtin' | 'workspace' | 'user' | 'custom';
}
export declare class AdapterDiscovery {
    private customSearchPaths;
    constructor(customPaths?: string[]);
    addCustomPath(searchPath: string): void;
    /**
     * Scans all 4 discovery locations for valid adapter directories (containing adapter.json).
     */
    discoverAdapters(workspaceRoot?: string): Promise<DiscoveredAdapterPath[]>;
}
