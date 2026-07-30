/**
 * test-provider.ts — Phase 25-28 Test Intelligence Provider
 */
export interface TestSuiteStats {
    totalTestFiles: number;
    passCount: number;
    failCount: number;
    coveragePercent: number;
}
export declare class TestProvider {
    getTestStats(workspaceRoot: string): TestSuiteStats;
}
