"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionPolicyRegistry = void 0;
class ExecutionPolicyRegistry {
    readOnlyTools = new Set(['read_file', 'list_dir', 'search_workspace', 'open_file', 'noop', 'toggle_terminal', 'grep_search', 'search_web', 'read_url_content']);
    dangerousTools = new Set(['run_command']);
    validate(policy, toolId, input, workspaceRoot) {
        const isWrite = !this.readOnlyTools.has(toolId);
        // 1. ReadOnly enforcement
        if (policy === 'readonly' && isWrite) {
            return { allowed: false, reason: `Policy "readonly" rejects modifying tool "${toolId}"`, action: 'execute' };
        }
        // 2. WorkspaceOnly enforcement
        if (policy === 'workspace-only' && workspaceRoot) {
            if (input && typeof input === 'object') {
                const pathsToCheck = [input.path, input.targetFile, input.TargetFile, input.SearchPath].filter((p) => typeof p === 'string');
                for (const p of pathsToCheck) {
                    const absolutePath = p.replace(/\\/g, '/');
                    const absoluteRoot = workspaceRoot.replace(/\\/g, '/');
                    if (!absolutePath.startsWith(absoluteRoot)) {
                        return {
                            allowed: false,
                            reason: `Policy "workspace-only" rejects path "${p}" outside workspace root`,
                            action: 'execute',
                        };
                    }
                }
            }
        }
        // 3. Dry Run / Simulation mapping
        if (policy === 'dry-run' || policy === 'simulation') {
            return { allowed: true, action: 'mock' };
        }
        // 4. Safe / Interactive mapping for dangerous tools
        if ((policy === 'safe' || policy === 'interactive') && this.dangerousTools.has(toolId)) {
            return { allowed: true, action: 'confirm' };
        }
        return { allowed: true, action: 'execute' };
    }
}
exports.ExecutionPolicyRegistry = ExecutionPolicyRegistry;
//# sourceMappingURL=execution-policy-registry.js.map