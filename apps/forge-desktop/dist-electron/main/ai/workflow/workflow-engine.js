"use strict";
/**
 * workflow-engine.ts — Phase 25-28 Engineering Workflow Engine
 *
 * Converts high-level engineering goals into structured multi-step task workflows.
 * Operates above Intent Analyzer and Runtime Router.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = void 0;
class WorkflowEngine {
    /**
     * Decomposes a user goal into a multi-step workflow pipeline.
     */
    createWorkflow(goal, workspaceRoot) {
        const workflowId = `wf_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const steps = [];
        const normalizedGoal = goal.toLowerCase();
        if (normalizedGoal.includes('build') || normalizedGoal.includes('compile')) {
            steps.push({
                id: `${workflowId}_step_1`,
                name: 'Typecheck',
                description: 'Run TypeScript compiler typecheck validation',
                status: 'PENDING',
                request: {
                    taskId: `${workflowId}_task_1`,
                    intent: 'Check TypeScript compilation for errors',
                    capabilities: ['tools', 'streaming'],
                    priority: 'high',
                    complexity: 'simple',
                    estimatedTokens: 1500,
                    contextSize: 4000,
                    workspaceRoot,
                },
            }, {
                id: `${workflowId}_step_2`,
                name: 'Lint & Verify',
                description: 'Run linter and check code conventions',
                status: 'PENDING',
                dependsOn: [`${workflowId}_step_1`],
                request: {
                    taskId: `${workflowId}_task_2`,
                    intent: 'Run linter and code quality checkers',
                    capabilities: ['tools', 'streaming'],
                    priority: 'normal',
                    complexity: 'simple',
                    estimatedTokens: 1000,
                    contextSize: 4000,
                    workspaceRoot,
                },
            }, {
                id: `${workflowId}_step_3`,
                name: 'Package & Build',
                description: 'Execute production build script',
                status: 'PENDING',
                dependsOn: [`${workflowId}_step_2`],
                request: {
                    taskId: `${workflowId}_task_3`,
                    intent: 'Run production build bundle generation',
                    capabilities: ['tools', 'streaming'],
                    priority: 'critical',
                    complexity: 'moderate',
                    estimatedTokens: 2500,
                    contextSize: 8000,
                    workspaceRoot,
                },
            });
        }
        else if (normalizedGoal.includes('review') || normalizedGoal.includes('audit')) {
            steps.push({
                id: `${workflowId}_step_1`,
                name: 'Workspace Indexing',
                description: 'Analyze repository architecture and symbols',
                status: 'PENDING',
                request: {
                    taskId: `${workflowId}_task_1`,
                    intent: 'Analyze codebase architecture and dependencies',
                    capabilities: ['reasoning', 'streaming'],
                    priority: 'normal',
                    complexity: 'moderate',
                    estimatedTokens: 2000,
                    contextSize: 16000,
                    workspaceRoot,
                },
            }, {
                id: `${workflowId}_step_2`,
                name: 'Generate Code Audit',
                description: 'Detect dead code, hotspots, and security issues',
                status: 'PENDING',
                dependsOn: [`${workflowId}_step_1`],
                request: {
                    taskId: `${workflowId}_task_2`,
                    intent: 'Audit codebase for hotspots, dead code, and TODO items',
                    capabilities: ['reasoning', 'tools', 'streaming'],
                    priority: 'high',
                    complexity: 'complex',
                    estimatedTokens: 4000,
                    contextSize: 32000,
                    workspaceRoot,
                },
            });
        }
        else {
            // Default single-task workflow
            steps.push({
                id: `${workflowId}_step_1`,
                name: 'Execute Goal',
                description: goal,
                status: 'PENDING',
                request: {
                    taskId: `${workflowId}_task_1`,
                    intent: goal,
                    capabilities: ['streaming', 'tools'],
                    priority: 'normal',
                    complexity: 'moderate',
                    estimatedTokens: 2000,
                    contextSize: 8000,
                    workspaceRoot,
                },
            });
        }
        return {
            id: workflowId,
            goal,
            workspaceRoot,
            createdAt: Date.now(),
            steps,
            status: 'IDLE',
        };
    }
}
exports.WorkflowEngine = WorkflowEngine;
//# sourceMappingURL=workflow-engine.js.map