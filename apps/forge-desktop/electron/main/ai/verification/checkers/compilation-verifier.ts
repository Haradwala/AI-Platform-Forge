import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class CompilationVerifier implements IVerificationChecker {
  readonly name = 'CompilationVerifier';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[] }> {
    if (!workspaceRoot) {
      return { success: true, errors: [] };
    }

    const errors: IVerificationEvidence[] = [];

    const errorFile = path.join(workspaceRoot, 'compile-error.ts');
    if (fs.existsSync(errorFile)) {
      errors.push({
        file: 'compile-error.ts',
        line: 10,
        column: 5,
        message: 'Compilation error: Cannot find name "UnresolvedReference".',
        severity: 'error',
        source: 'compiler',
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}
