import type { IVerificationReport } from '../verification/verification-types';
export interface IFailureAnalysis {
    readonly category: 'syntax' | 'typeError' | 'testFailure' | 'lintError' | 'runtimeError' | 'securityViolation' | 'archViolation' | 'unknown';
    readonly rootCause: string;
    readonly recoverabilityScore: number;
}
export declare class FailureAnalyzer {
    analyze(report: IVerificationReport): IFailureAnalysis;
}
