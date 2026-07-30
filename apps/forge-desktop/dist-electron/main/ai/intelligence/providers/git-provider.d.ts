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
export declare class GitProvider {
    getGitMetadata(workspaceRoot: string): GitMetadata;
}
