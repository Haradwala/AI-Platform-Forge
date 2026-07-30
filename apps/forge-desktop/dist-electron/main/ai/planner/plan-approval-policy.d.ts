import { IPlanScore } from './plan-scorer';
export type ApprovalAction = 'auto_execute' | 'ask_user' | 'require_explicit_approval';
export declare class PlanApprovalPolicy {
    evaluateApprovalPolicy(score: IPlanScore): ApprovalAction;
}
