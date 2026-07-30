"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTaskPlanner = void 0;
class GoalTaskPlanner {
    buildTaskGraph(goal) {
        const nodes = [];
        const edges = [];
        // Create first analysis node
        const analyzeNode = {
            id: 'task_analyze',
            title: 'Analyze goal references',
            description: `Understand details of scope: ${goal.scope}`,
            dependencies: [],
            priority: 'high',
            risk: 'low',
            toolId: 'read_file',
            status: 'pending',
        };
        nodes.push(analyzeNode);
        // Create nodes for targets
        goal.targetFiles.forEach((file, index) => {
            const editId = `task_edit_${index}`;
            const editNode = {
                id: editId,
                title: `Modify file: ${file}`,
                description: `Apply goal modifications to ${file}`,
                dependencies: ['task_analyze'],
                priority: 'normal',
                risk: 'medium',
                toolId: 'write_file',
                status: 'pending',
            };
            nodes.push(editNode);
            edges.push({ from: 'task_analyze', to: editId });
            const openId = `task_open_${index}`;
            const openNode = {
                id: openId,
                title: `Open file tab: ${file}`,
                description: `Expose modified file: ${file} on Monaco editor viewport`,
                dependencies: [editId],
                priority: 'low',
                risk: 'low',
                toolId: 'open_file',
                status: 'pending',
            };
            nodes.push(openNode);
            edges.push({ from: editId, to: openId });
        });
        return { nodes, edges };
    }
}
exports.GoalTaskPlanner = GoalTaskPlanner;
//# sourceMappingURL=task-planner.js.map