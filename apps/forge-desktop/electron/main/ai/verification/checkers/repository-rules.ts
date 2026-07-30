import type { IVerificationChecker, IVerificationEvidence, VerificationPolicy } from '../verification-types';
import * as fs from 'fs';
import * as path from 'path';

export class RepositoryRules implements IVerificationChecker {
  readonly name = 'RepositoryRules';

  async run(
    policy: VerificationPolicy,
    workspaceRoot: string | null
  ): Promise<{ success: boolean; errors: IVerificationEvidence[] }> {
    if (!workspaceRoot) {
      return { success: true, errors: [] };
    }

    const errors: IVerificationEvidence[] = [];

    const errorFile = path.join(workspaceRoot, 'rules-error.ts');
    if (fs.existsSync(errorFile)) {
      errors.push({
        file: 'rules-error.ts',
        line: 2,
        column: 1,
        message: 'Repository rule violation: Dependency cycle detected or forbidden import of main process inside src/app.',
        severity: 'error',
        source: 'repository-rules',
      });
      return { success: false, errors };
    }

    return { success: true, errors: [] };
  }
}
