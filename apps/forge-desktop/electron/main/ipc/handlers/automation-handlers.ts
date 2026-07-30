/**
 * automation-handlers.ts — IPC Handlers for Engineering Automation Engine
 */

import { IIpcRouter } from '../../container/service-interfaces';
import { IAutomationApplicationService } from '../../application/automation/automation-application-service';

export function registerAutomationHandlers(
  router: IIpcRouter,
  automationAppService: IAutomationApplicationService
): void {
  router.handle('automation:list-workflows', async (ctx: any) => {
    return automationAppService.listWorkflows(ctx.payload?.workspaceRoot);
  });

  router.handle('automation:run-workflow', async (ctx: any) => {
    return automationAppService.runWorkflow(ctx.payload?.workspaceRoot, ctx.payload?.workflowId, ctx.payload?.inputs);
  });

  router.handle('automation:cancel-execution', async (ctx: any) => {
    const success = await automationAppService.cancelExecution(ctx.payload?.executionId);
    return { success };
  });

  router.handle('automation:get-execution', async (ctx: any) => {
    return automationAppService.getExecution(ctx.payload?.workspaceRoot, ctx.payload?.executionId);
  });

  router.handle('automation:list-executions', async (ctx: any) => {
    return automationAppService.listExecutions(ctx.payload?.workspaceRoot);
  });

  router.handle('automation:list-templates', async () => {
    return automationAppService.listTemplates();
  });

  router.handle('automation:get-artifacts', async (ctx: any) => {
    return automationAppService.getArtifacts(ctx.payload?.workspaceRoot, ctx.payload?.executionId);
  });
}
