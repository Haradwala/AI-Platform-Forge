"use strict";
/**
 * execution-graph-engine.ts
 *
 * Execution graph engine leveraging Phase 8 PlanningGraph for DAG validation,
 * cycle detection, topological sorting, and parallel ready-task resolution.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionGraphEngine = void 0;
const planning_graph_1 = require("../planner/planning-graph");
const planning_errors_1 = require("../errors/planning-errors");
class ExecutionGraphEngine {
    graph = new planning_graph_1.PlanningGraph();
    build(plan) {
        this.graph.clear();
        for (const task of plan.tasks) {
            // Fail fast: every task MUST declare a toolCall.
            // If the planner emitted undefined here, it is a planner bug — surface it
            // immediately instead of silently masking it with a no-op substitution.
            if (!task.toolCall?.toolId) {
                throw new planning_errors_1.PlanningError(`Planner produced task "${task.id}" (${task.title}) without a toolCall.toolId. ` +
                    `This is a planner defect — fix the plan generator instead of adding a fallback.`, task.id);
            }
            const runnableTask = {
                id: task.id,
                toolId: task.toolCall.toolId,
                dependencies: [...task.dependencies],
                priority: 'normal',
                retryLimit: 3,
                timeout: 30000,
                estimatedCost: 0.0,
                executionPolicy: 'auto',
                input: task.toolCall.input || {},
            };
            this.graph.addNode(task.id, runnableTask, task.dependencies);
        }
    }
    validate() {
        return this.graph.validate();
    }
    serialize() {
        const list = this.graph.getAllNodes().map((n) => ({
            task: n.payload,
            dependencies: n.dependencies,
        }));
        return JSON.stringify(list);
    }
    deserialize(serialized) {
        this.graph.clear();
        const list = JSON.parse(serialized);
        for (const item of list) {
            this.graph.addNode(item.task.id, item.task, item.dependencies);
        }
    }
    topologicalSort() {
        return this.graph.topologicalSort();
    }
    findReadyTasks(completedTaskIds) {
        const readyNodes = this.graph.getReadyNodes(completedTaskIds);
        return readyNodes.map((n) => n.payload);
    }
    getTask(taskId) {
        const node = this.graph.getNode(taskId);
        return node ? node.payload : null;
    }
    getAllTasks() {
        return this.graph.getAllNodes().map((n) => n.payload);
    }
}
exports.ExecutionGraphEngine = ExecutionGraphEngine;
//# sourceMappingURL=execution-graph-engine.js.map