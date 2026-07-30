/**
 * automation-handlers.ts — IPC Handlers for Engineering Automation Engine
 */
import { IIpcRouter } from '../../container/service-interfaces';
import { IAutomationApplicationService } from '../../application/automation/automation-application-service';
export declare function registerAutomationHandlers(router: IIpcRouter, automationAppService: IAutomationApplicationService): void;
