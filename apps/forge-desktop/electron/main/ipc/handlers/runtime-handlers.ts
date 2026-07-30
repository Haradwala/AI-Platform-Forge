/**
 * runtime-handlers.ts — IPC Handlers for Multi-Runtime Subsystem
 */

import { IIpcRouter } from '../../container/service-interfaces';
import { IMultiRuntimeApplicationService } from '../../application/runtime/multi-runtime-application-service';

export function registerRuntimeHandlers(
  router: IIpcRouter,
  multiRuntimeAppService: IMultiRuntimeApplicationService
): void {
  router.handle('runtimes:list-profiles', async (ctx: any) => {
    return multiRuntimeAppService.listProfiles(ctx.payload);
  });

  router.handle('runtimes:get-active', async (_ctx: any) => {
    return multiRuntimeAppService.getActiveRuntimes();
  });

  router.handle('runtimes:route', async (ctx: any) => {
    return multiRuntimeAppService.routeRequest(ctx.payload);
  });

  router.handle('runtimes:create-session', async (ctx: any) => {
    return multiRuntimeAppService.createSession(ctx.payload?.workspaceRoot, ctx.payload?.initialModelId);
  });

  router.handle('runtimes:switch-session-runtime', async (ctx: any) => {
    return multiRuntimeAppService.switchRuntime(ctx.payload?.sessionId, ctx.payload?.newModelId);
  });

  router.handle('runtimes:get-performance-metrics', async (ctx: any) => {
    return multiRuntimeAppService.getMetrics(ctx.payload?.modelId);
  });

  router.handle('runtimes:run-benchmark', async (ctx: any) => {
    return multiRuntimeAppService.runBenchmark(ctx.payload?.modelId);
  });
}
