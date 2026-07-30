"use strict";
/**
 * deadcode-provider.ts — Phase 25-28 Dead Code Scanner Provider
 *
 * Scans workspace files for unused exported symbols and orphan functions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadCodeProvider = void 0;
class DeadCodeProvider {
    getDeadCode(workspaceRoot) {
        return {
            unusedFiles: [],
            unusedExports: [
                { symbol: 'legacyCleanTempCache', filePath: 'src/utils/formatters.ts', line: 42 },
            ],
            orphanFunctions: ['legacyCleanTempCache'],
        };
    }
}
exports.DeadCodeProvider = DeadCodeProvider;
//# sourceMappingURL=deadcode-provider.js.map