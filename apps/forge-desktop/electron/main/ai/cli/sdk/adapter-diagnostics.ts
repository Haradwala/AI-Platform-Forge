/**
 * adapter-diagnostics.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Diagnostic utilities for adapter health, self-testing, version verification, and binary dependencies.
 */

import type { CLIAdapter } from '../cli-adapter';
import type { AdapterManifest } from './adapter-manifest';
import { execSync } from 'child_process';

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

export class AdapterDiagnostics {
  /**
   * Evaluates diagnostic health for a CLI adapter instance.
   */
  static async runDiagnostics(adapter: CLIAdapter, manifest?: AdapterManifest): Promise<AdapterDiagnosticsReport> {
    const isDetected = await adapter.detect();
    const selfTestResult = await this.selfTest(adapter);
    const dependencyCheckResult = this.dependencyCheck(manifest);

    const healthy = isDetected && selfTestResult.passed && dependencyCheckResult.passed;

    return {
      adapterId: adapter.id,
      healthy,
      version: adapter.version,
      selfTestResult,
      dependencyCheckResult,
    };
  }

  static async selfTest(adapter: CLIAdapter): Promise<DiagnosticCheckResult> {
    try {
      const isDetected = await adapter.detect();
      return {
        passed: isDetected,
        message: isDetected
          ? `Adapter "${adapter.name}" self-test passed successfully.`
          : `Adapter "${adapter.name}" binary detection failed.`,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        passed: false,
        message: `Self-test error: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: Date.now(),
      };
    }
  }

  static version(adapter: CLIAdapter): string {
    return adapter.version;
  }

  static dependencyCheck(manifest?: AdapterManifest): DiagnosticCheckResult {
    if (!manifest?.requiredBinaries || manifest.requiredBinaries.length === 0) {
      return {
        passed: true,
        message: 'No external binary dependencies specified.',
        timestamp: Date.now(),
      };
    }

    const missing: string[] = [];
    const isWin = process.platform === 'win32';

    for (const bin of manifest.requiredBinaries) {
      try {
        const cmd = isWin ? `where ${bin}` : `which ${bin}`;
        execSync(cmd, { stdio: 'ignore' });
      } catch {
        missing.push(bin);
      }
    }

    return {
      passed: missing.length === 0,
      message: missing.length === 0
        ? 'All required binaries are present on system PATH.'
        : `Missing required binary dependencies: ${missing.join(', ')}`,
      timestamp: Date.now(),
    };
  }
}
