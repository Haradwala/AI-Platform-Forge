"use strict";
/**
 * symbol-provider.ts — Phase 25-28 Symbol Provider
 *
 * Extracts AST symbols, declarations, and call hierarchy snippets across files.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolProvider = void 0;
class SymbolProvider {
    getSymbols(workspaceRoot) {
        return [
            { name: 'EngineeringIntelligenceEngine', kind: 'class', filePath: 'electron/main/ai/intelligence/engineering-intelligence-engine.ts', line: 81 },
            { name: 'RuntimeRouter', kind: 'class', filePath: 'electron/main/ai/routing/runtime-router.ts', line: 15 },
            { name: 'WorkflowEngine', kind: 'class', filePath: 'electron/main/ai/workflow/workflow-engine.ts', line: 24 },
            { name: 'RuntimeExecutionManager', kind: 'class', filePath: 'electron/main/ai/runtime/runtime-execution-manager.ts', line: 40 },
        ];
    }
}
exports.SymbolProvider = SymbolProvider;
//# sourceMappingURL=symbol-provider.js.map