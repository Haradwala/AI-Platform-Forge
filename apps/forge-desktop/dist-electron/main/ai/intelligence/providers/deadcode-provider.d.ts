/**
 * deadcode-provider.ts — Phase 25-28 Dead Code Scanner Provider
 *
 * Scans workspace files for unused exported symbols and orphan functions.
 */
export interface DeadCodeReport {
    unusedFiles: string[];
    unusedExports: Array<{
        symbol: string;
        filePath: string;
        line: number;
    }>;
    orphanFunctions: string[];
}
export declare class DeadCodeProvider {
    getDeadCode(workspaceRoot: string): DeadCodeReport;
}
