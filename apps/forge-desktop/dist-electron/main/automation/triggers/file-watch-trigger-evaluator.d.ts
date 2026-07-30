/**
 * file-watch-trigger-evaluator.ts — File Watch Trigger Evaluator
 *
 * Matches file system change events against path filter globs in workflow triggers.
 */
import { AutomationTriggerCondition } from '../contracts/automation-types';
export declare class FileWatchTriggerEvaluator {
    /**
     * Matches a file change path against a trigger condition.
     */
    matches(condition: AutomationTriggerCondition, filePath: string): boolean;
}
