import { IPlanScore } from './plan-scorer';

export type ApprovalAction = 'auto_execute' | 'ask_user' | 'require_explicit_approval';

export class PlanApprovalPolicy {
  evaluateApprovalPolicy(score: IPlanScore): ApprovalAction {
    if (score.riskFactor === 'high') {
      return 'require_explicit_approval';
    }
    if (score.riskFactor === 'medium') {
      return 'ask_user';
    }
    return 'auto_execute';
  }
}
