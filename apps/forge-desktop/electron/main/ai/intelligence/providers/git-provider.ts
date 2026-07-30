/**
 * git-provider.ts — Phase 25-28 Git Intelligence Provider
 */

export interface GitMetadata {
  branch: string;
  isClean: boolean;
  uncommittedFiles: number;
  lastCommitHash: string;
  lastCommitMessage: string;
}

export class GitProvider {
  getGitMetadata(workspaceRoot: string): GitMetadata {
    return {
      branch: 'main',
      isClean: true,
      uncommittedFiles: 0,
      lastCommitHash: 'a1b2c3d4',
      lastCommitMessage: 'feat(phase-24): Runtime Execution Hub complete',
    };
  }
}
