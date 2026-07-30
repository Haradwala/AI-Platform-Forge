/**
 * adapter-discovery.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Scans built-in paths, workspace directories, user home folders, and custom paths for CLI adapters.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface DiscoveredAdapterPath {
  id: string;
  directoryPath: string;
  source: 'builtin' | 'workspace' | 'user' | 'custom';
}

export class AdapterDiscovery {
  private customSearchPaths: string[] = [];

  constructor(customPaths?: string[]) {
    if (customPaths) {
      this.customSearchPaths = customPaths.map((p) => path.resolve(p));
    }
  }

  addCustomPath(searchPath: string): void {
    this.customSearchPaths.push(path.resolve(searchPath));
  }

  /**
   * Scans all 4 discovery locations for valid adapter directories (containing adapter.json).
   */
  async discoverAdapters(workspaceRoot?: string): Promise<DiscoveredAdapterPath[]> {
    const searchLocations: Array<{ dir: string; source: DiscoveredAdapterPath['source'] }> = [];

    // 1. Built-in Forge adapters directory
    const builtinDir = path.resolve(__dirname, '../adapters');
    if (fs.existsSync(builtinDir)) {
      searchLocations.push({ dir: builtinDir, source: 'builtin' });
    }

    // 2. Workspace local adapters (.forge/adapters/)
    if (workspaceRoot) {
      const wsAdapters = path.join(workspaceRoot, '.forge', 'adapters');
      if (fs.existsSync(wsAdapters)) {
        searchLocations.push({ dir: wsAdapters, source: 'workspace' });
      }
    }

    // 3. User global adapters (~/.forge/adapters/)
    const userAdapters = path.join(os.homedir(), '.forge', 'adapters');
    if (fs.existsSync(userAdapters)) {
      searchLocations.push({ dir: userAdapters, source: 'user' });
    }

    // 4. Custom user search paths
    for (const customPath of this.customSearchPaths) {
      if (fs.existsSync(customPath)) {
        searchLocations.push({ dir: customPath, source: 'custom' });
      }
    }

    const results: DiscoveredAdapterPath[] = [];

    for (const location of searchLocations) {
      try {
        const entries = fs.readdirSync(location.dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const dirPath = path.join(location.dir, entry.name);
            const manifestFile = path.join(dirPath, 'adapter.json');
            if (fs.existsSync(manifestFile)) {
              results.push({
                id: entry.name,
                directoryPath: dirPath,
                source: location.source,
              });
            }
          }
        }
      } catch {
        // Skip unreadable location
      }
    }

    return results;
  }
}
