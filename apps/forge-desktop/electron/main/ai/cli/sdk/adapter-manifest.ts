/**
 * adapter-manifest.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Manifest specification for CLI agent adapters.
 */

import type { CLICapabilities } from '../cli-capabilities';
import type { AdapterPermission } from './adapter-permissions';

export interface AdapterManifest {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  license?: string;
  homepage?: string;
  repository?: string;
  runtimeVersion: string; // e.g. ">=1.0.0"
  entry: string;          // Entry file (e.g. "index.js" or "adapter.js")
  icon?: string;
  permissions: AdapterPermission[];
  capabilities: CLICapabilities;
  requiredBinaries?: string[];
  dependencies?: Record<string, string>;
}
