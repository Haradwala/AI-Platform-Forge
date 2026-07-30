"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryStrategyRegistry = void 0;
class RecoveryStrategyRegistry {
    strategies = new Map();
    register(strategy) {
        this.strategies.set(strategy.id, strategy);
    }
    getStrategiesFor(report) {
        const applicable = [];
        for (const strategy of this.strategies.values()) {
            if (strategy.canRecover(report)) {
                applicable.push(strategy);
            }
        }
        return applicable;
    }
    getById(id) {
        return this.strategies.get(id) || null;
    }
}
exports.RecoveryStrategyRegistry = RecoveryStrategyRegistry;
//# sourceMappingURL=recovery-strategy-registry.js.map