"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionPlanner = void 0;
class ExecutionPlanner {
    determineStrategy(graph) {
        const hasParallelPotential = graph.nodes.filter((n) => n.dependencies.length === 0).length > 1;
        const hasHighRisk = graph.nodes.some((n) => n.risk === 'high');
        let strategy = 'sequential';
        let concurrencyLimit = 1;
        let retriesAllowed = 2;
        let rollbackEnabled = true;
        if (hasHighRisk) {
            strategy = 'conditional'; // Require checks between steps
            concurrencyLimit = 1;
            retriesAllowed = 1;
            rollbackEnabled = true;
        }
        else if (hasParallelPotential) {
            strategy = 'parallel';
            concurrencyLimit = 3;
            retriesAllowed = 3;
            rollbackEnabled = false;
        }
        return {
            strategy,
            concurrencyLimit,
            retriesAllowed,
            rollbackEnabled,
        };
    }
}
exports.ExecutionPlanner = ExecutionPlanner;
//# sourceMappingURL=execution-planner.js.map