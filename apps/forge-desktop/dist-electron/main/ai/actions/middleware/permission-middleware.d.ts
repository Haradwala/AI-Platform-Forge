/**
 * permission-middleware.ts — Phase 29 Permission Pipeline Middleware
 */
import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';
export declare class PermissionMiddleware implements IActionMiddleware {
    readonly name = "PermissionMiddleware";
    execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult>;
}
