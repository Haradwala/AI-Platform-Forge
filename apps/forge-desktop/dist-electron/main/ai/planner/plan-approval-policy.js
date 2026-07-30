"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanApprovalPolicy = void 0;
class PlanApprovalPolicy {
    evaluateApprovalPolicy(score) {
        if (score.riskFactor === 'high') {
            return 'require_explicit_approval';
        }
        if (score.riskFactor === 'medium') {
            return 'ask_user';
        }
        return 'auto_execute';
    }
}
exports.PlanApprovalPolicy = PlanApprovalPolicy;
//# sourceMappingURL=plan-approval-policy.js.map