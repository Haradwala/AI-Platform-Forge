"use strict";
/**
 * git-provider.ts — Phase 25-28 Git Intelligence Provider
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitProvider = void 0;
class GitProvider {
    getGitMetadata(workspaceRoot) {
        return {
            branch: 'main',
            isClean: true,
            uncommittedFiles: 0,
            lastCommitHash: 'a1b2c3d4',
            lastCommitMessage: 'feat(phase-24): Runtime Execution Hub complete',
        };
    }
}
exports.GitProvider = GitProvider;
//# sourceMappingURL=git-provider.js.map