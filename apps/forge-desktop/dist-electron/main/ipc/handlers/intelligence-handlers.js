"use strict";
/**
 * intelligence-handlers.ts — IPC Handlers for Engineering Intelligence Engine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIntelligenceHandlers = registerIntelligenceHandlers;
function registerIntelligenceHandlers(router, intelligenceAppService) {
    router.handle('intelligence:start-indexing', async (ctx) => {
        return intelligenceAppService.startIndexing(ctx.payload?.workspaceRoot);
    });
    router.handle('intelligence:get-index-status', async (ctx) => {
        return intelligenceAppService.getIndexStatus(ctx.payload?.jobId);
    });
    router.handle('intelligence:search-symbols', async (ctx) => {
        return intelligenceAppService.searchSymbols(ctx.payload?.workspaceRoot, ctx.payload?.query);
    });
    router.handle('intelligence:search-code', async (ctx) => {
        return intelligenceAppService.searchCodeNaturalLanguage(ctx.payload?.workspaceRoot, ctx.payload?.query);
    });
    router.handle('intelligence:cross-reference-lookup', async (ctx) => {
        return intelligenceAppService.crossReferenceLookup(ctx.payload?.workspaceRoot, ctx.payload?.identifier);
    });
    router.handle('intelligence:assemble-context', async (ctx) => {
        return intelligenceAppService.assembleContext(ctx.payload);
    });
    router.handle('intelligence:analyze-impact', async (ctx) => {
        return intelligenceAppService.analyzeImpact(ctx.payload?.workspaceRoot, ctx.payload?.changedFiles);
    });
    router.handle('intelligence:detect-dead-code', async (ctx) => {
        return intelligenceAppService.detectDeadCode(ctx.payload?.workspaceRoot);
    });
    router.handle('intelligence:get-architecture-insights', async (ctx) => {
        return intelligenceAppService.getArchitectureInsights(ctx.payload?.workspaceRoot);
    });
    router.handle('intelligence:add-adr', async (ctx) => {
        return intelligenceAppService.addADR(ctx.payload?.adr);
    });
    router.handle('intelligence:list-adrs', async (ctx) => {
        return intelligenceAppService.listADRs(ctx.payload?.workspaceRoot);
    });
}
//# sourceMappingURL=intelligence-handlers.js.map