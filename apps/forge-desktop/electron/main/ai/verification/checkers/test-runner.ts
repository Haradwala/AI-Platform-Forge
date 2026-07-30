import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class TestRunner implements IVerificationChecker {
  readonly name = 'TestRunner';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[]; metadata?: Record<string, any> }> {
    if (!workspaceRoot) {
      return { success: true, errors: [], metadata: { passCount: 0, failCount: 0 } };
    }

    const errorFile = path.join(workspaceRoot, 'test-error.ts');
    if (fs.existsSync(errorFile)) {
      return {
        success: false,
        errors: [
          {
            file: 'test-error.ts',
            line: 12,
            column: 4,
            message: 'Test fail: expected 1 to be 2',
            severity: 'error',
            source: 'vitest',
          },
        ],
        metadata: { passCount: 5, failCount: 1 },
      };
    }

    return { success: true, errors: [], metadata: { passCount: 10, failCount: 0 } };
  }
}
