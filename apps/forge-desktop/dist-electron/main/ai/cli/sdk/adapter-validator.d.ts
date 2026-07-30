/**
 * adapter-validator.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Validates adapter manifests, entry point availability, runtime compatibility, and binaries.
 */
import type { AdapterManifest } from './adapter-manifest';
export interface AdapterValidationReport {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare class AdapterValidator {
    /**
     * Validates a CLI adapter manifest and installation directory.
     */
    static validate(manifest: Partial<AdapterManifest>, adapterDir?: string): AdapterValidationReport;
}
