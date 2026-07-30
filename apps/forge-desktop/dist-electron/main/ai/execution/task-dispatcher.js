"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDispatcher = void 0;
class TaskDispatcher {
    toolRegistry;
    policyRegistry;
    workspaceService;
    logger;
    constructor(toolRegistry, policyRegistry, workspaceService, logger) {
        this.toolRegistry = toolRegistry;
        this.policyRegistry = policyRegistry;
        this.workspaceService = workspaceService;
        this.logger = logger;
    }
    async dispatch(task, abortSignal, executionId) {
        const rootPath = this.workspaceService.getRootPath();
        // 1. Policy validation check
        const policyCheck = this.policyRegistry.validate(task.executionPolicy, task.toolId, task.input, rootPath);
        if (!policyCheck.allowed) {
            throw new Error(`Execution policy blocked tool run: ${policyCheck.reason}`);
        }
        if (policyCheck.action === 'mock') {
            this.logger.info(`[TaskDispatcher] Dry run/Simulation mock value for task: ${task.id}`);
            return { mock: true, toolId: task.toolId, status: 'simulated' };
        }
        // 2. Build isolated execution context
        const context = {
            traceId: `${executionId}-${task.id}-trace`,
            spanId: `${task.id}-span`,
            executionId,
            conversationId: 'session-id',
            providerId: 'ollama-provider',
            budget: {
                tokenBudget: 500000,
                timeBudget: 600,
                costBudget: 0.1,
                fileBudget: 20,
                retryBudget: 5,
            },
            logger: this.logger,
            abortSignal,
            featureFlags: {},
            rootPath,
            metadata: {},
        };
        // 3. Route execution directly using registry and abort signal Promise.race
        const tool = this.toolRegistry.getById(task.toolId);
        if (!tool) {
            throw new Error(`Tool not found in registry: "${task.toolId}"`);
        }
        if (context.abortSignal.aborted) {
            throw new Error('Tool execution aborted prior to call.');
        }
        const executionPromise = this.toolRegistry.execute(task.toolId, task.input);
        const abortPromise = new Promise((_, reject) => {
            const onAbort = () => {
                context.abortSignal.removeEventListener('abort', onAbort);
                reject(new Error('Tool execution aborted by cancellation request.'));
            };
            context.abortSignal.addEventListener('abort', onAbort);
        });
        return Promise.race([executionPromise, abortPromise]);
    }
}
exports.TaskDispatcher = TaskDispatcher;
//# sourceMappingURL=task-dispatcher.js.map