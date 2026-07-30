export interface IHierarchicalGoal {
  readonly id: string;
  readonly parentGoalId?: string;
  readonly childGoalIds: string[];
  readonly description: string;
  readonly priority: number;
  readonly completionPercentage: number;
  readonly estimatedCostUsd: number;
  readonly estimatedDurationSeconds: number;
}

export interface IReflectionDecision {
  readonly goalCompleted: boolean;
  readonly confidence: number;
  readonly reason: string;
  readonly missingInformation: string[];
  readonly recommendedAction: string;
  readonly continueExecution: boolean;
  readonly requiresHuman: boolean;
  readonly newGoalSuggestions: string[];
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Denied' | 'Expired' | 'Cancelled';

export interface IApprovalItem {
  readonly approvalId: string;
  readonly toolId: string;
  readonly riskLevel: 'low' | 'high';
  readonly description: string;
  readonly status: ApprovalStatus;
  readonly createdAt: Date;
  readonly expiresAt?: Date;
}

export interface ICorrelationMetadata {
  readonly executionId: string;
  readonly traceId: string;
  readonly sessionId: string;
  readonly goalId: string;
}

export interface IAgentPolicy {
  readonly id: string;
  readonly maxAutonomousLoopsCount: number;
  readonly requiresApprovalForDangerousTools: boolean;
  readonly budgetCapUsd: number;
  readonly reflectionStrictness: 'light' | 'strict';
}

export interface IAgentSession {
  readonly sessionId: string;
  readonly goalId: string;
  readonly policy: IAgentPolicy;
  readonly elapsedLoopsCount: number;
  readonly accumulatedCostUsd: number;
  readonly status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
}
