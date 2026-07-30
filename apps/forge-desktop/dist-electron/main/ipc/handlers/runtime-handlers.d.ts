/**
 * runtime-handlers.ts — IPC Handlers for Multi-Runtime Subsystem
 */
import { IIpcRouter } from '../../container/service-interfaces';
import { IMultiRuntimeApplicationService } from '../../application/runtime/multi-runtime-application-service';
export declare function registerRuntimeHandlers(router: IIpcRouter, multiRuntimeAppService: IMultiRuntimeApplicationService): void;
