"use strict";
/**
 * git-trigger-evaluator.ts — Git Lifecycle Trigger Evaluator
 *
 * Evaluates Git push, pull_request, and branch events against workflow trigger conditions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitTriggerEvaluator = void 0;
class GitTriggerEvaluator {
    /**
     * Matches a Git event payload against an automation trigger condition.
     */
    matches(condition, payload) {
        if (condition.type !== payload.type) {
            return false;
        }
        if (condition.branches && condition.branches.length > 0 && payload.branch) {
            const match = condition.branches.some((b) => b === payload.branch || b === '*' || (b.endsWith('/*') && payload.branch?.startsWith(b.replace('/*', ''))));
            if (!match)
                return false;
        }
        if (condition.paths && condition.paths.length > 0 && payload.filesChanged) {
            const match = payload.filesChanged.some((file) => condition.paths.some((p) => file.includes(p) || p === '*'));
            if (!match)
                return false;
        }
        return true;
    }
}
exports.GitTriggerEvaluator = GitTriggerEvaluator;
//# sourceMappingURL=git-trigger-evaluator.js.map