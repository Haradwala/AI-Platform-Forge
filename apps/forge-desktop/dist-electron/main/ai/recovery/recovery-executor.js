"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryExecutor = void 0;
class RecoveryExecutor {
    registry;
    constructor(registry) {
        this.registry = registry;
    }
    async executeStrategy(strategyId, workspaceRoot) {
        const strategy = this.registry.getById(strategyId);
        if (!strategy) {
            throw new Error(`Strategy plugin not found: "${strategyId}"`);
        }
        return strategy.execute(workspaceRoot);
    }
}
exports.RecoveryExecutor = RecoveryExecutor;
//# sourceMappingURL=recovery-executor.js.map