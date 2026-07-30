/**
 * intelligence-handlers.ts — IPC Handlers for Engineering Intelligence Engine
 */

import { IIpcRouter } from '../../container/service-interfaces';
import { IIntelligenceApplicationService } from '../../application/intelligence/intelligence-application-service';

export function registerIntelligenceHandlers(
  router: IIpcRouter,
  intelligenceAppService: IIntelligenceApplicationService
): void {
  router.handle('intelligence:start-indexing', async (ctx: any) => {
    return intelligenceAppService.startIndexing(ctx.payload?.workspaceRoot);
  });

  router.handle('intelligence:get-index-status', async (ctx: any) => {
    return intelligenceAppService.getIndexStatus(ctx.payload?.jobId);
  });

  router.handle('intelligence:search-symbols', async (ctx: any) => {
    return intelligenceAppService.searchSymbols(ctx.payload?.workspaceRoot, ctx.payload?.query);
  });

  router.handle('intelligence:search-code', async (ctx: any) => {
    return intelligenceAppService.searchCodeNaturalLanguage(ctx.payload?.workspaceRoot, ctx.payload?.query);
  });

  router.handle('intelligence:cross-reference-lookup', async (ctx: any) => {
    return intelligenceAppService.crossReferenceLookup(ctx.payload?.workspaceRoot, ctx.payload?.identifier);
  });

  router.handle('intelligence:assemble-context', async (ctx: any) => {
    return intelligenceAppService.assembleContext(ctx.payload);
  });

  router.handle('intelligence:analyze-impact', async (ctx: any) => {
    return intelligenceAppService.analyzeImpact(ctx.payload?.workspaceRoot, ctx.payload?.changedFiles);
  });

  router.handle('intelligence:detect-dead-code', async (ctx: any) => {
    return intelligenceAppService.detectDeadCode(ctx.payload?.workspaceRoot);
  });

  router.handle('intelligence:get-architecture-insights', async (ctx: any) => {
    return intelligenceAppService.getArchitectureInsights(ctx.payload?.workspaceRoot);
  });

  router.handle('intelligence:add-adr', async (ctx: any) => {
    return intelligenceAppService.addADR(ctx.payload?.adr);
  });

  router.handle('intelligence:list-adrs', async (ctx: any) => {
    return intelligenceAppService.listADRs(ctx.payload?.workspaceRoot);
  });
}
