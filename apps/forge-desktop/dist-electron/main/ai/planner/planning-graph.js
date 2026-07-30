"use strict";
/**
 * planning-graph.ts
 *
 * Directed Acyclic Graph (DAG) task planner supporting dependency resolution,
 * cycle detection, topological sorting, parallel ready-node discovery, and status tracking.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningGraph = void 0;
class PlanningGraph {
    nodes = new Map();
    clear() {
        this.nodes.clear();
    }
    addNode(id, payload, dependencies = []) {
        this.nodes.set(id, {
            id,
            payload,
            dependencies: [...dependencies],
            status: 'pending',
        });
    }
    getNode(id) {
        return this.nodes.get(id) || null;
    }
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    markStatus(id, status, error) {
        const node = this.nodes.get(id);
        if (node) {
            node.status = status;
            if (error)
                node.error = error;
        }
    }
    validate() {
        // 1. Missing dependency check
        for (const [id, node] of this.nodes.entries()) {
            for (const depId of node.dependencies) {
                if (!this.nodes.has(depId)) {
                    return {
                        valid: false,
                        reason: `Node "${id}" depends on missing node "${depId}".`,
                    };
                }
            }
        }
        // 2. Cycle detection via DFS
        const visited = new Set();
        const recStack = new Set();
        const hasCycle = (id) => {
            visited.add(id);
            recStack.add(id);
            const node = this.nodes.get(id);
            if (node) {
                for (const depId of node.dependencies) {
                    if (!visited.has(depId)) {
                        if (hasCycle(depId))
                            return true;
                    }
                    else if (recStack.has(depId)) {
                        return true;
                    }
                }
            }
            recStack.delete(id);
            return false;
        };
        for (const id of this.nodes.keys()) {
            if (!visited.has(id)) {
                if (hasCycle(id)) {
                    return { valid: false, reason: `Circular dependency detected involving node "${id}".` };
                }
            }
        }
        return { valid: true };
    }
    topologicalSort() {
        const validation = this.validate();
        if (!validation.valid) {
            throw new Error(`Cannot perform topological sort: ${validation.reason}`);
        }
        const result = [];
        const visited = new Set();
        const visit = (id) => {
            if (visited.has(id))
                return;
            visited.add(id);
            const node = this.nodes.get(id);
            if (node) {
                for (const depId of node.dependencies) {
                    visit(depId);
                }
            }
            result.push(id);
        };
        for (const id of this.nodes.keys()) {
            visit(id);
        }
        return result;
    }
    getReadyNodes(completedNodeIds = []) {
        const completedSet = new Set(completedNodeIds);
        const ready = [];
        for (const node of this.nodes.values()) {
            if (node.status !== 'pending' || completedSet.has(node.id))
                continue;
            const depsSatisfied = node.dependencies.every((d) => completedSet.has(d) || this.nodes.get(d)?.status === 'completed');
            if (depsSatisfied) {
                ready.push(node);
            }
        }
        return ready;
    }
    isCompleted() {
        if (this.nodes.size === 0)
            return true;
        return Array.from(this.nodes.values()).every((n) => n.status === 'completed');
    }
    hasFailures() {
        return Array.from(this.nodes.values()).some((n) => n.status === 'failed');
    }
}
exports.PlanningGraph = PlanningGraph;
//# sourceMappingURL=planning-graph.js.map