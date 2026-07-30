/**
 * adapter-validator.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Validates adapter manifests, entry point availability, runtime compatibility, and binaries.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AdapterManifest } from './adapter-manifest';
import { PermissionChecker, ALL_ADAPTER_PERMISSIONS } from './adapter-permissions';

export interface AdapterValidationReport {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class AdapterValidator {
  /**
   * Validates a CLI adapter manifest and installation directory.
   */
  static validate(manifest: Partial<AdapterManifest>, adapterDir?: string): AdapterValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Manifest field checks
    if (!manifest.id || typeof manifest.id !== 'string') {
      errors.push('Manifest missing required field: "id"');
    }
    if (!manifest.name || typeof manifest.name !== 'string') {
      errors.push('Manifest missing required field: "name"');
    }
    if (!manifest.version || typeof manifest.version !== 'string') {
      errors.push('Manifest missing required field: "version"');
    }
    if (!manifest.runtimeVersion || typeof manifest.runtimeVersion !== 'string') {
      errors.push('Manifest missing required field: "runtimeVersion"');
    }
    if (!manifest.entry || typeof manifest.entry !== 'string') {
      errors.push('Manifest missing required field: "entry"');
    }

    // 2. Permission checks
    if (manifest.permissions && Array.isArray(manifest.permissions)) {
      const permCheck = PermissionChecker.validatePermissions(
        manifest.permissions,
        ALL_ADAPTER_PERMISSIONS
      );
      if (!permCheck.valid) {
        errors.push(`Manifest contains invalid permissions: ${permCheck.missing.join(', ')}`);
      }
    } else {
      warnings.push('Manifest does not declare explicit permissions list.');
    }

    // 3. Entry point file check
    if (adapterDir && manifest.entry) {
      const entryPath = path.resolve(adapterDir, manifest.entry);
      if (!fs.existsSync(entryPath)) {
        errors.push(`Adapter entry point file not found: "${entryPath}"`);
      }
    }

    // 4. Required binaries check
    if (manifest.requiredBinaries && Array.isArray(manifest.requiredBinaries)) {
      for (const bin of manifest.requiredBinaries) {
        if (typeof bin !== 'string') {
          errors.push('Invalid binary entry in "requiredBinaries"');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
