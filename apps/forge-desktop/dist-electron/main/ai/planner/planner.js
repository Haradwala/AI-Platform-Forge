"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPlanner = void 0;
const task_planner_1 = require("./task-planner");
class TaskPlanner {
    goalPlanner;
    constructor(goalPlanner = new task_planner_1.GoalTaskPlanner()) {
        this.goalPlanner = goalPlanner;
    }
    async generatePlan(goal, context) {
        const tasks = [];
        const cleanGoal = (goal || '').toLowerCase();
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
        const intent = this.goalPlanner.classifyIntent(goal);
        switch (intent.type) {
            case 'workspace_statistics': {
                tasks.push({
                    id: 'task_2',
                    title: 'Gather workspace statistics',
                    description: 'Query file counts and language breakdown across the workspace',
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'search_workspace',
                        input: {
                            query: goal,
                            mode: 'workspace_statistics'
                        }
                    }
                });
                break;
            }
            case 'list_dir': {
                tasks.push({
                    id: 'task_2',
                    title: 'List project folders and directory contents',
                    description: 'Examine workspace directory structure',
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'list_dir',
                        input: {
                            folderPath: intent.folderPath || ''
                        }
                    }
                });
                break;
            }
            case 'read_file': {
                tasks.push({
                    id: 'task_2',
                    title: `Read file: ${intent.filePath}`,
                    description: `Retrieve contents of file: ${intent.filePath}`,
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'read_file',
                        input: {
                            filePath: intent.filePath
                        }
                    }
                });
                break;
            }
            case 'file_search': {
                tasks.push({
                    id: 'task_2',
                    title: 'Search workspace files by extension or name',
                    description: 'Locate matching files in the workspace',
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'search_workspace',
                        input: {
                            query: goal,
                            mode: 'file_search',
                            fileType: intent.fileType
                        }
                    }
                });
                break;
            }
            case 'text_search': {
                tasks.push({
                    id: 'task_2',
                    title: `Search text: "${intent.text}"`,
                    description: `Find all text occurrences of "${intent.text}" in workspace files`,
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'search_workspace',
                        input: {
                            query: goal,
                            mode: 'text_search',
                            text: intent.text
                        }
                    }
                });
                break;
            }
            case 'symbol_lookup': {
                tasks.push({
                    id: 'task_2',
                    title: `Lookup symbol: "${intent.symbol}"`,
                    description: `Find definitions and references for symbol "${intent.symbol}"`,
                    status: 'pending',
                    dependencies: ['task_1'],
                    toolCall: {
                        toolId: 'search_workspace',
                        input: {
                            query: goal,
                            mode: 'symbol_lookup',
                            symbol: intent.symbol
                        }
                    }
                });
                break;
            }
            default: {
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
                break;
            }
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