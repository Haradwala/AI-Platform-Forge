import type { IVerificationReport } from '../verification/verification-types';

export type RecoveryState =
  | 'idle'
  | 'detecting'
  | 'analyzing'
  | 'planning'
  | 'waitingApproval'
  | 'recovering'
  | 'retrying'
  | 'rollingBack'
  | 'replanning'
  | 'reexecuting'
  | 'verifying'
  | 'recovered'
  | 'failed'
  | 'escalated'
  | 'cancelled';

export interface RecoveryPolicy {
  readonly maxRetries: number;
  readonly maxRollbackDepth: number;
  readonly allowReplan: boolean;
  readonly allowRegeneration: boolean;
  readonly allowEscalation: boolean;
}

export interface IRecoveryStrategy {
  readonly id: string;
  canRecover(report: IVerificationReport): boolean;
  execute(workspaceRoot: string | null): Promise<{ success: boolean; message: string }>;
}

export interface IRecoveryReport {
  readonly success: boolean;
  readonly attempts: { strategyId: string; success: boolean; durationMs: number }[];
  readonly durationMs: number;
}
