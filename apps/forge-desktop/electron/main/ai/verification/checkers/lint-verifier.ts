import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class LintVerifier implements IVerificationChecker {
  readonly name = 'LintVerifier';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[] }> {
    if (!workspaceRoot) {
      return { success: true, errors: [] };
    }

    const errors: IVerificationEvidence[] = [];

    const errorFile = path.join(workspaceRoot, 'lint-error.ts');
    if (fs.existsSync(errorFile)) {
      errors.push({
        file: 'lint-error.ts',
        line: 5,
        column: 2,
        message: 'Linter error: "x" is assigned a value but never used.',
        severity: 'warning',
        source: 'eslint',
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}
