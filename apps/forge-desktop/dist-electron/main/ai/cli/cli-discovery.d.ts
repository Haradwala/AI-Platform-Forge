/**
 * cli-discovery.ts — Phase 19 Generic CLI Runtime
 *
 * Automatically detects installed AI CLI agents across system PATH, npm global,
 * pnpm global, bun, cargo, pipx, uv, and custom paths.
 */
export type CLIAgentStatus = 'installed' | 'not-found' | 'error';
export interface DiscoveredCLIResult {
    id: string;
    name: string;
    version: string;
    path: string;
    status: CLIAgentStatus;
    installLocation?: string;
}
export declare class CLIDiscovery {
    private readonly isWindows;
    /**
     * Scans system PATH and common package manager global directories for an agent.
     */
    discoverAgent(id: string, commandName: string): Promise<DiscoveredCLIResult>;
    private buildSearchLocations;
    private probeVersion;
}
