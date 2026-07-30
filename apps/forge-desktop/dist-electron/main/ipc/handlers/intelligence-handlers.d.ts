/**
 * intelligence-handlers.ts — IPC Handlers for Engineering Intelligence Engine
 */
import { IIpcRouter } from '../../container/service-interfaces';
import { IIntelligenceApplicationService } from '../../application/intelligence/intelligence-application-service';
export declare function registerIntelligenceHandlers(router: IIpcRouter, intelligenceAppService: IIntelligenceApplicationService): void;
