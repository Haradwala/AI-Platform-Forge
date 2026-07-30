import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class FormattingChecker implements IVerificationChecker {
  readonly name = 'FormattingChecker';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[]; metadata?: Record<string, any> }> {
    if (!workspaceRoot) {
      return { success: true, errors: [], metadata: { filesUnformatted: [] } };
    }

    const unformatted: string[] = [];
    const errorFile = path.join(workspaceRoot, 'format-error.ts');
    if (fs.existsSync(errorFile)) {
      unformatted.push('format-error.ts');
      return {
        success: false,
        errors: [
          {
            file: 'format-error.ts',
            line: 1,
            column: 1,
            message: 'File is not formatted.',
            severity: 'warning',
            source: 'prettier',
          },
        ],
        metadata: { filesUnformatted: unformatted },
      };
    }

    return { success: true, errors: [], metadata: { filesUnformatted: [] } };
  }
}
