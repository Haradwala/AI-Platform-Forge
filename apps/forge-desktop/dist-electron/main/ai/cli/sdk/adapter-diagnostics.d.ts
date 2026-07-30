/**
 * adapter-diagnostics.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Diagnostic utilities for adapter health, self-testing, version verification, and binary dependencies.
 */
import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
export interface DiagnosticCheckResult {
    passed: boolean;
    message: string;
    timestamp: number;
}
export interface AdapterDiagnosticsReport {
    adapterId: string;
    healthy: boolean;
    version: string;
    selfTestResult: DiagnosticCheckResult;
    dependencyCheckResult: DiagnosticCheckResult;
}
export declare class AdapterDiagnostics {
    /**
     * Evaluates diagnostic health for a CLI adapter instance.
     */
    static runDiagnostics(adapter: CLIAdapter, manifest?: AdapterManifest): Promise<AdapterDiagnosticsReport>;
    static selfTest(adapter: CLIAdapter): Promise<DiagnosticCheckResult>;
    static version(adapter: CLIAdapter): string;
    static dependencyCheck(manifest?: AdapterManifest): DiagnosticCheckResult;
}
