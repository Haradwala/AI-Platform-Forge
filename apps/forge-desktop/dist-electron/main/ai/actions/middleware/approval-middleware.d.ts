/**
 * approval-middleware.ts — Phase 29 Approval Gating Middleware
 */
import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';
export declare class ApprovalMiddleware implements IActionMiddleware {
    readonly name = "ApprovalMiddleware";
    private pendingApprovals;
    execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult>;
    respondApproval(requestId: string, approved: boolean): boolean;
}
