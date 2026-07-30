"use strict";
/**
 * runtime-handlers.ts — IPC Handlers for Multi-Runtime Subsystem
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRuntimeHandlers = registerRuntimeHandlers;
function registerRuntimeHandlers(router, multiRuntimeAppService) {
    router.handle('runtimes:list-profiles', async (ctx) => {
        return multiRuntimeAppService.listProfiles(ctx.payload);
    });
    router.handle('runtimes:get-active', async (_ctx) => {
        return multiRuntimeAppService.getActiveRuntimes();
    });
    router.handle('runtimes:route', async (ctx) => {
        return multiRuntimeAppService.routeRequest(ctx.payload);
    });
    router.handle('runtimes:create-session', async (ctx) => {
        return multiRuntimeAppService.createSession(ctx.payload?.workspaceRoot, ctx.payload?.initialModelId);
    });
    router.handle('runtimes:switch-session-runtime', async (ctx) => {
        return multiRuntimeAppService.switchRuntime(ctx.payload?.sessionId, ctx.payload?.newModelId);
    });
    router.handle('runtimes:get-performance-metrics', async (ctx) => {
        return multiRuntimeAppService.getMetrics(ctx.payload?.modelId);
    });
    router.handle('runtimes:run-benchmark', async (ctx) => {
        return multiRuntimeAppService.runBenchmark(ctx.payload?.modelId);
    });
}
//# sourceMappingURL=runtime-handlers.js.map