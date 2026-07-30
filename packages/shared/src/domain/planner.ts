export enum GoalStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
  Blocked = 'Blocked',
  Cancelled = 'Cancelled'
}

export interface IGoal {
  readonly id: string;
  readonly description: string;
  readonly priority: number;
  readonly constraints: string[];
  readonly successCriteria: (blackboard: any) => boolean;
  readonly status: GoalStatus;
  readonly dependencies: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum PlanStepType {
  Read = 'Read',
  Retrieve = 'Retrieve',
  Reason = 'Reason',
  Tool = 'Tool',
  Validate = 'Validate',
  Reflect = 'Reflect',
  Wait = 'Wait',
  Branch = 'Branch',
  Loop = 'Loop',
  Complete = 'Complete'
}

export interface ICondition {
  readonly type: string;
  readonly payload: Record<string, any>;
}

export interface IPlanStep {
  readonly id: string;
  readonly type: PlanStepType;
  readonly toolId?: string;
  readonly arguments: Record<string, any>;
  readonly preconditions: ICondition[];
  readonly postconditions: ICondition[];
  readonly dependencies: string[];
  readonly status: 'Pending' | 'Queued' | 'Running' | 'Completed' | 'Failed' | 'Skipped';
  readonly retryCount: number;
}

export interface IPlanGraph {
  readonly nodes: Map<string, IPlanStep>;
  readonly edges: Array<{ from: string; to: string }>;
}

export enum ObservationType {
  Fact = 'Fact',
  Evidence = 'Evidence',
  Result = 'Result',
  Decision = 'Decision',
  Diagnostic = 'Diagnostic',
  Warning = 'Warning',
  Failure = 'Failure'
}

export interface IObservation {
  readonly id: string;
  readonly type: ObservationType;
  readonly source: string;
  readonly key: string;
  readonly value: any;
  readonly timestamp: Date;
}

export interface IExecutionSnapshot {
  readonly snapshotId: string;
  readonly planId: string;
  readonly activeStepId?: string;
  readonly observations: IObservation[];
  readonly variables: Record<string, any>;
  readonly timestamp: Date;
}

export interface IBlackboard {
  append(type: ObservationType, source: string, key: string, value: any): void;
  getHistory(): IObservation[];
  createSnapshot(planId: string, activeStepId?: string, variables?: Record<string, any>): IExecutionSnapshot;
}
