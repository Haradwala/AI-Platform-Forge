/**
 * audit-middleware.ts — Phase 29 Audit Middleware
 */
import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';
export declare class AuditMiddleware implements IActionMiddleware {
    private readonly historyLogger?;
    readonly name = "AuditMiddleware";
    constructor(historyLogger?: ((req: ActionRequest, res: ActionResult) => Promise<void>) | undefined);
    execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult>;
}
