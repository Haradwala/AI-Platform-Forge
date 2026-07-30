/**
 * adapter-sdk.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Official Forge CLI Adapter SDK for constructing, validating, and registering CLI adapters.
 */
import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
export interface AdapterBuilderOptions {
    manifest: AdapterManifest;
    detectFn: () => Promise<boolean>;
    commandFn: () => string;
    argumentsFn: (prompt: string, options?: Record<string, unknown>) => string[];
    environmentFn?: (options?: Record<string, unknown>) => Record<string, string>;
    workingDirectoryFn?: (options?: Record<string, unknown>) => string;
}
export declare class AdapterSDK {
    /**
     * Helper utility to build a fully compliant CLIAdapter instance from a manifest and execution handlers.
     */
    static createAdapter(options: AdapterBuilderOptions): CLIAdapter;
}
