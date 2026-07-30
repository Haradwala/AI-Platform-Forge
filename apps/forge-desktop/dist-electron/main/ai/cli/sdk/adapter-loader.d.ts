/**
 * adapter-loader.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Dynamically loads and instantiates CLI adapter classes from manifest definitions or directory paths.
 */
import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
export declare class AdapterLoader {
    /**
     * Loads an adapter manifest and instantiates its CLIAdapter entry module.
     */
    static loadFromDirectory(adapterDir: string): Promise<{
        adapter: CLIAdapter;
        manifest: AdapterManifest;
    }>;
}
