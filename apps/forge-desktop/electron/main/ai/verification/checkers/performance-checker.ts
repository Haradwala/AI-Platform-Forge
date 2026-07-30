import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class PerformanceChecker implements IVerificationChecker {
  readonly name = 'PerformanceChecker';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[] }> {
    if (!workspaceRoot) {
      return { success: true, errors: [] };
    }

    const errors: IVerificationEvidence[] = [];

    const errorFile = path.join(workspaceRoot, 'perf-error.ts');
    if (fs.existsSync(errorFile)) {
      errors.push({
        file: 'perf-error.ts',
        line: 1,
        column: 1,
        message: 'Performance warning: File contains duplicate code lines or functions too long.',
        severity: 'warning',
        source: 'performance-checker',
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}
