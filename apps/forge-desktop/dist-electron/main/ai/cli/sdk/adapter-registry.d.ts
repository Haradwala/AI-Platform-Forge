/**
 * adapter-registry.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Registry for managing loaded CLI adapters, discovery, enablement status, dynamic updates, and validation.
 */
import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
import { type DiscoveredAdapterPath } from './adapter-discovery';
import { type AdapterValidationReport } from './adapter-validator';
import { type AdapterDiagnosticsReport } from './adapter-diagnostics';
export interface RegisteredAdapterEntry {
    adapter: CLIAdapter;
    manifest: AdapterManifest;
    enabled: boolean;
    sourcePath?: string;
    loadedAt: number;
}
export declare class AdapterRegistry {
    private readonly entries;
    private readonly discovery;
    /**
     * Scans system discovery paths for adapters.
     */
    discover(workspaceRoot?: string): Promise<DiscoveredAdapterPath[]>;
    /**
     * Loads an adapter from a directory path and registers it.
     */
    load(directoryPath: string): Promise<RegisteredAdapterEntry>;
    /**
     * Reloads an existing registered adapter.
     */
    reload(id: string): Promise<RegisteredAdapterEntry>;
    /**
     * Registers a CLIAdapter instance into the registry.
     */
    register(adapter: CLIAdapter, manifest: AdapterManifest, sourcePath?: string): RegisteredAdapterEntry;
    /**
     * Unregisters an adapter from the registry.
     */
    unregister(id: string): boolean;
    enable(id: string): void;
    disable(id: string): void;
    /**
     * Updates an existing adapter entry manifest or instance.
     */
    update(id: string, updatedAdapter: CLIAdapter, updatedManifest: AdapterManifest): void;
    list(onlyEnabled?: boolean): RegisteredAdapterEntry[];
    get(id: string): RegisteredAdapterEntry | undefined;
    getAdapter(id: string): CLIAdapter | undefined;
    validate(manifest: Partial<AdapterManifest>, directoryPath?: string): AdapterValidationReport;
    runDiagnostics(id: string): Promise<AdapterDiagnosticsReport>;
}
