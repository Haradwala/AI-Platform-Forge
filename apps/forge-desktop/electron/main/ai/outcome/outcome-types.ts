import type { IVerificationReport } from '../verification/verification-types';
import type { IRecoveryReport } from '../recovery/recovery-types';
import type { IReflectionReport } from '../reflection/reflection-engine';

export interface IExecutionOutcome {
  readonly success: boolean;
  readonly planId: string;
  readonly goal: string;
  readonly verification: IVerificationReport;
  readonly recovery: IRecoveryReport | null;
  readonly reflection: IReflectionReport;
  readonly timestamp: string;
}

export interface IAiExperience {
  readonly version: string;
  readonly schemaVersion: string;
  readonly id: string;
  readonly goal: string;
  readonly success: boolean;
  readonly executionTimeMs: number;
  readonly tokensUsedCount: number;
  readonly failuresCount: number;
  readonly decisionReasons: string[];
  readonly recommendations: string[];
}
