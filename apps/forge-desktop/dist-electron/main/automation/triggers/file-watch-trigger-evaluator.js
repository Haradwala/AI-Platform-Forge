"use strict";
/**
 * file-watch-trigger-evaluator.ts — File Watch Trigger Evaluator
 *
 * Matches file system change events against path filter globs in workflow triggers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWatchTriggerEvaluator = void 0;
class FileWatchTriggerEvaluator {
    /**
     * Matches a file change path against a trigger condition.
     */
    matches(condition, filePath) {
        if (condition.type !== 'file_change') {
            return false;
        }
        if (!condition.paths || condition.paths.length === 0) {
            return true;
        }
        return condition.paths.some((p) => filePath.includes(p) || p === '*');
    }
}
exports.FileWatchTriggerEvaluator = FileWatchTriggerEvaluator;
//# sourceMappingURL=file-watch-trigger-evaluator.js.map