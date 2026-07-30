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
    runtimeVersion: string;
    entry: string;
    icon?: string;
    permissions: AdapterPermission[];
    capabilities: CLICapabilities;
    requiredBinaries?: string[];
    dependencies?: Record<string, string>;
}
