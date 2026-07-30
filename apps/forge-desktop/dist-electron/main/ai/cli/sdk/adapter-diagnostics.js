"use strict";
/**
 * adapter-diagnostics.ts — Phase 20 CLI Adapter SDK & Registry
 *
 * Diagnostic utilities for adapter health, self-testing, version verification, and binary dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterDiagnostics = void 0;
const child_process_1 = require("child_process");
class AdapterDiagnostics {
    /**
     * Evaluates diagnostic health for a CLI adapter instance.
     */
    static async runDiagnostics(adapter, manifest) {
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
    static async selfTest(adapter) {
        try {
            const isDetected = await adapter.detect();
            return {
                passed: isDetected,
                message: isDetected
                    ? `Adapter "${adapter.name}" self-test passed successfully.`
                    : `Adapter "${adapter.name}" binary detection failed.`,
                timestamp: Date.now(),
            };
        }
        catch (err) {
            return {
                passed: false,
                message: `Self-test error: ${err instanceof Error ? err.message : String(err)}`,
                timestamp: Date.now(),
            };
        }
    }
    static version(adapter) {
        return adapter.version;
    }
    static dependencyCheck(manifest) {
        if (!manifest?.requiredBinaries || manifest.requiredBinaries.length === 0) {
            return {
                passed: true,
                message: 'No external binary dependencies specified.',
                timestamp: Date.now(),
            };
        }
        const missing = [];
        const isWin = process.platform === 'win32';
        for (const bin of manifest.requiredBinaries) {
            try {
                const cmd = isWin ? `where ${bin}` : `which ${bin}`;
                (0, child_process_1.execSync)(cmd, { stdio: 'ignore' });
            }
            catch {
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
exports.AdapterDiagnostics = AdapterDiagnostics;
//# sourceMappingURL=adapter-diagnostics.js.map