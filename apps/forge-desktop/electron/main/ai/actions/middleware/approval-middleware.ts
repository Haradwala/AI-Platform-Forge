/**
 * approval-middleware.ts — Phase 29 Approval Gating Middleware
 */

import { ActionRequest, ActionResult, IActionMiddleware } from '../action-types';

export class ApprovalMiddleware implements IActionMiddleware {
  readonly name = 'ApprovalMiddleware';
  private pendingApprovals: Map<string, { req: ActionRequest; resolver: (value: boolean) => void }> = new Map();

  async execute(req: ActionRequest, next: () => Promise<ActionResult>): Promise<ActionResult> {
    if (req.context?.requiresApproval) {
      const approved = await new Promise<boolean>((resolve) => {
        this.pendingApprovals.set(req.id, { req, resolver: resolve });
      });

      if (!approved) {
        return {
          actionId: req.actionId,
          status: 'CANCELLED',
          durationMs: 0,
          error: `Action ${req.actionId} was rejected by user approval.`,
        };
      }
    }

    return await next();
  }

  respondApproval(requestId: string, approved: boolean): boolean {
    const entry = this.pendingApprovals.get(requestId);
    if (entry) {
      entry.resolver(approved);
      this.pendingApprovals.delete(requestId);
      return true;
    }
    return false;
  }
}
