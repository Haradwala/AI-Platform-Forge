"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPlanner = void 0;
class TaskPlanner {
    async generatePlan(goal, context) {
        const tasks = [];
        const cleanGoal = goal.toLowerCase();
        tasks.push({
            id: 'task_1',
            title: 'Analyze request context',
            description: `Evaluate goal: ${goal}`,
            status: 'pending',
            dependencies: [],
            toolCall: {
                toolId: 'noop',
                input: {}
            }
        });
        if (cleanGoal.includes('calc') || cleanGoal.includes('calculator')) {
            tasks.push({
                id: 'task_2',
                title: 'Generate React Calculator Component',
                description: 'Create src/components/Calculator.tsx containing calculator states and handlers.',
                status: 'pending',
                dependencies: ['task_1'],
                toolCall: {
                    toolId: 'write_file',
                    input: {
                        filePath: 'src/components/Calculator.tsx',
                        content: `import React from 'react';\n\nexport const Calculator: React.FC = () => {\n  return <div>Calculator Component</div>;\n};`
                    }
                }
            }, {
                id: 'task_3',
                title: 'Verify and Open File',
                description: 'Open the created calculator component tab in Monaco editor viewport.',
                status: 'pending',
                dependencies: ['task_2'],
                toolCall: {
                    toolId: 'open_file',
                    input: { filePath: 'src/components/Calculator.tsx' }
                }
            });
        }
        else {
            tasks.push({
                id: 'task_2',
                title: 'Run workspace query matching user intent',
                description: 'Examine workspace details to gather context for the request.',
                status: 'pending',
                dependencies: ['task_1'],
                toolCall: {
                    toolId: 'search_workspace',
                    input: { query: goal },
                },
            });
        }
        return {
            id: `plan_${Date.now()}`,
            goal,
            tasks
        };
    }
}
exports.TaskPlanner = TaskPlanner;
//# sourceMappingURL=planner.js.map