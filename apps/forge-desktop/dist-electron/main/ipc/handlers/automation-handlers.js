"use strict";
/**
 * automation-handlers.ts — IPC Handlers for Engineering Automation Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAutomationHandlers = registerAutomationHandlers;
function registerAutomationHandlers(router, automationAppService) {
    router.handle('automation:list-workflows', async (ctx) => {
        return automationAppService.listWorkflows(ctx.payload?.workspaceRoot);
    });
    router.handle('automation:run-workflow', async (ctx) => {
        return automationAppService.runWorkflow(ctx.payload?.workspaceRoot, ctx.payload?.workflowId, ctx.payload?.inputs);
    });
    router.handle('automation:cancel-execution', async (ctx) => {
        const success = await automationAppService.cancelExecution(ctx.payload?.executionId);
        return { success };
    });
    router.handle('automation:get-execution', async (ctx) => {
        return automationAppService.getExecution(ctx.payload?.workspaceRoot, ctx.payload?.executionId);
    });
    router.handle('automation:list-executions', async (ctx) => {
        return automationAppService.listExecutions(ctx.payload?.workspaceRoot);
    });
    router.handle('automation:list-templates', async () => {
        return automationAppService.listTemplates();
    });
    router.handle('automation:get-artifacts', async (ctx) => {
        return automationAppService.getArtifacts(ctx.payload?.workspaceRoot, ctx.payload?.executionId);
    });
}
//# sourceMappingURL=automation-handlers.js.map