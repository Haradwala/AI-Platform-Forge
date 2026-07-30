import type { IVerificationReport } from '../verification/verification-types';

export interface IFailureAnalysis {
  readonly category:
    | 'syntax'
    | 'typeError'
    | 'testFailure'
    | 'lintError'
    | 'runtimeError'
    | 'securityViolation'
    | 'archViolation'
    | 'unknown';
  readonly rootCause: string;
  readonly recoverabilityScore: number;
}

export class FailureAnalyzer {
  analyze(report: IVerificationReport): IFailureAnalysis {
    if (!report.compilation.success) {
      return {
        category: 'typeError',
        rootCause: report.compilation.errors[0]?.message || 'Compilation failed',
        recoverabilityScore: 0.8,
      };
    }
    if (!report.lint.success || !report.format.success) {
      return {
        category: 'lintError',
        rootCause: 'Formatting or code style violation',
        recoverabilityScore: 0.95,
      };
    }
    if (!report.test.success) {
      return {
        category: 'testFailure',
        rootCause: report.test.errors[0]?.message || 'Tests execution failed',
        recoverabilityScore: 0.7,
      };
    }
    if (!report.security.success) {
      return {
        category: 'securityViolation',
        rootCause: report.security.issues[0]?.message || 'Security secrets checker warnings',
        recoverabilityScore: 0.5,
      };
    }
    if (!report.architecture.success) {
      return {
        category: 'archViolation',
        rootCause: report.architecture.issues[0]?.message || 'Imports layers rules violation',
        recoverabilityScore: 0.6,
      };
    }
    return {
      category: 'unknown',
      rootCause: 'No clear failure category identified',
      recoverabilityScore: 1.0,
    };
  }
}
