"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanValidator = void 0;
class PlanValidator {
    validate(graph) {
        const errors = [];
        // 1. Check for circular cycles using DFS
        const visited = new Set();
        const recStack = new Set();
        const hasCycle = (nodeId) => {
            if (recStack.has(nodeId))
                return true;
            if (visited.has(nodeId))
                return false;
            visited.add(nodeId);
            recStack.add(nodeId);
            const node = graph.nodes.find((n) => n.id === nodeId);
            if (node) {
                for (const dep of node.dependencies) {
                    if (hasCycle(dep))
                        return true;
                }
            }
            recStack.delete(nodeId);
            return false;
        };
        for (const node of graph.nodes) {
            if (hasCycle(node.id)) {
                errors.push(`Circular dependency loop detected involving task: ${node.id}`);
                break;
            }
        }
        // 2. Check for missing dependencies references
        const nodeIds = new Set(graph.nodes.map((n) => n.id));
        for (const node of graph.nodes) {
            for (const dep of node.dependencies) {
                if (!nodeIds.has(dep)) {
                    errors.push(`Task: ${node.id} depends on unregistered task: ${dep}`);
                }
            }
        }
        // 3. Check for missing toolId specification on task nodes
        for (const node of graph.nodes) {
            if (!node.toolId || typeof node.toolId !== 'string' || !node.toolId.trim()) {
                errors.push(`Task: ${node.id} (${node.title}) is missing a valid toolId.`);
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
exports.PlanValidator = PlanValidator;
//# sourceMappingURL=plan-validator.js.map