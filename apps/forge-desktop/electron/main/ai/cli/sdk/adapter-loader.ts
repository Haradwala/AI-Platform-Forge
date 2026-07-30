/**
 * adapter-loader.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Dynamically loads and instantiates CLI adapter classes from manifest definitions or directory paths.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
import { AdapterValidator } from './adapter-validator';
import { AdapterError } from '../cli-errors';

export class AdapterLoader {
  /**
   * Loads an adapter manifest and instantiates its CLIAdapter entry module.
   */
  static async loadFromDirectory(adapterDir: string): Promise<{ adapter: CLIAdapter; manifest: AdapterManifest }> {
    const manifestPath = path.join(adapterDir, 'adapter.json');
    if (!fs.existsSync(manifestPath)) {
      throw new AdapterError(`Adapter manifest "adapter.json" not found in "${adapterDir}"`);
    }

    let manifest: AdapterManifest;
    try {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(content);
    } catch (err) {
      throw new AdapterError(`Failed to parse adapter manifest in "${manifestPath}": ${err}`);
    }

    const report = AdapterValidator.validate(manifest, adapterDir);
    if (!report.valid) {
      throw new AdapterError(`Adapter manifest validation failed:\n${report.errors.join('\n')}`);
    }

    const entryPath = path.resolve(adapterDir, manifest.entry);
    try {
      // Dynamic import of adapter entry module
      const module = await import(entryPath);
      const AdapterClass = module.default || module.Adapter;

      if (!AdapterClass) {
        throw new AdapterError(`Adapter entry file "${entryPath}" does not export a default or named "Adapter" class.`);
      }

      const adapter: CLIAdapter = new AdapterClass(manifest);
      return { adapter, manifest };
    } catch (err) {
      throw new AdapterError(`Failed to load adapter module from "${entryPath}": ${err}`);
    }
  }
}
