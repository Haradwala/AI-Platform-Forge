/**
 * adapter-registry.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Registry for managing loaded CLI adapters, discovery, enablement status, dynamic updates, and validation.
 */

import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
import { AdapterDiscovery, type DiscoveredAdapterPath } from './adapter-discovery';
import { AdapterLoader } from './adapter-loader';
import { AdapterValidator, type AdapterValidationReport } from './adapter-validator';
import { AdapterDiagnostics, type AdapterDiagnosticsReport } from './adapter-diagnostics';
import { AdapterError } from '../cli-errors';

export interface RegisteredAdapterEntry {
  adapter: CLIAdapter;
  manifest: AdapterManifest;
  enabled: boolean;
  sourcePath?: string;
  loadedAt: number;
}

export class AdapterRegistry {
  private readonly entries = new Map<string, RegisteredAdapterEntry>();
  private readonly discovery = new AdapterDiscovery();

  /**
   * Scans system discovery paths for adapters.
   */
  async discover(workspaceRoot?: string): Promise<DiscoveredAdapterPath[]> {
    return this.discovery.discoverAdapters(workspaceRoot);
  }

  /**
   * Loads an adapter from a directory path and registers it.
   */
  async load(directoryPath: string): Promise<RegisteredAdapterEntry> {
    const { adapter, manifest } = await AdapterLoader.loadFromDirectory(directoryPath);
    return this.register(adapter, manifest, directoryPath);
  }

  /**
   * Reloads an existing registered adapter.
   */
  async reload(id: string): Promise<RegisteredAdapterEntry> {
    const existing = this.entries.get(id);
    if (!existing || !existing.sourcePath) {
      throw new AdapterError(`Cannot reload adapter "${id}": no source directory path available.`);
    }
    this.unregister(id);
    return this.load(existing.sourcePath);
  }

  /**
   * Registers a CLIAdapter instance into the registry.
   */
  register(adapter: CLIAdapter, manifest: AdapterManifest, sourcePath?: string): RegisteredAdapterEntry {
    const entry: RegisteredAdapterEntry = {
      adapter,
      manifest,
      enabled: true,
      sourcePath,
      loadedAt: Date.now(),
    };
    this.entries.set(adapter.id, entry);
    return entry;
  }

  /**
   * Unregisters an adapter from the registry.
   */
  unregister(id: string): boolean {
    return this.entries.delete(id);
  }

  enable(id: string): void {
    const entry = this.entries.get(id);
    if (entry) {
      entry.enabled = true;
    }
  }

  disable(id: string): void {
    const entry = this.entries.get(id);
    if (entry) {
      entry.enabled = false;
    }
  }

  /**
   * Updates an existing adapter entry manifest or instance.
   */
  update(id: string, updatedAdapter: CLIAdapter, updatedManifest: AdapterManifest): void {
    const entry = this.entries.get(id);
    if (!entry) {
      throw new AdapterError(`Cannot update adapter "${id}": not found in registry.`);
    }
    entry.adapter = updatedAdapter;
    entry.manifest = updatedManifest;
    entry.loadedAt = Date.now();
  }

  list(onlyEnabled: boolean = false): RegisteredAdapterEntry[] {
    const all = Array.from(this.entries.values());
    return onlyEnabled ? all.filter((e) => e.enabled) : all;
  }

  get(id: string): RegisteredAdapterEntry | undefined {
    return this.entries.get(id);
  }

  getAdapter(id: string): CLIAdapter | undefined {
    return this.entries.get(id)?.adapter;
  }

  validate(manifest: Partial<AdapterManifest>, directoryPath?: string): AdapterValidationReport {
    return AdapterValidator.validate(manifest, directoryPath);
  }

  async runDiagnostics(id: string): Promise<AdapterDiagnosticsReport> {
    const entry = this.entries.get(id);
    if (!entry) {
      throw new AdapterError(`Cannot run diagnostics: adapter "${id}" not found.`);
    }
    return AdapterDiagnostics.runDiagnostics(entry.adapter, entry.manifest);
  }
}
