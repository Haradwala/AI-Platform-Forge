import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class SecurityScanner implements IVerificationChecker {
  readonly name = 'SecurityScanner';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[] }> {
    if (!workspaceRoot) {
      return { success: true, errors: [] };
    }

    const errors: IVerificationEvidence[] = [];

    const errorFile = path.join(workspaceRoot, 'security-error.ts');
    if (fs.existsSync(errorFile)) {
      errors.push({
        file: 'security-error.ts',
        line: 1,
        column: 15,
        message: 'Security warning: Unsafe usage of eval() function.',
        severity: 'error',
        source: 'security-scanner',
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}
