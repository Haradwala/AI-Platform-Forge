"use strict";
/**
 * approval-middleware.ts — Phase 29 Approval Gating Middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalMiddleware = void 0;
class ApprovalMiddleware {
    name = 'ApprovalMiddleware';
    pendingApprovals = new Map();
    async execute(req, next) {
        if (req.context?.requiresApproval) {
            const approved = await new Promise((resolve) => {
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
    respondApproval(requestId, approved) {
        const entry = this.pendingApprovals.get(requestId);
        if (entry) {
            entry.resolver(approved);
            this.pendingApprovals.delete(requestId);
            return true;
        }
        return false;
    }
}
exports.ApprovalMiddleware = ApprovalMiddleware;
//# sourceMappingURL=approval-middleware.js.map