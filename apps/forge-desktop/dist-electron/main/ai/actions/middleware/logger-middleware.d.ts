/**
 * logger-middleware.ts — Phase 29 Action Telemetry & Logger Middleware
 */
import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';
export declare class LoggerMiddleware implements IActionMiddleware {
    readonly name = "LoggerMiddleware";
    execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult>;
}
