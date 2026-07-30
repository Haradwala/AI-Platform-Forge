/**
 * file-watch-trigger-evaluator.ts — File Watch Trigger Evaluator
 *
 * Matches file system change events against path filter globs in workflow triggers.
 */

import { AutomationTriggerCondition } from '../contracts/automation-types';

export class FileWatchTriggerEvaluator {
  /**
   * Matches a file change path against a trigger condition.
   */
  matches(condition: AutomationTriggerCondition, filePath: string): boolean {
    if (condition.type !== 'file_change') {
      return false;
    }

    if (!condition.paths || condition.paths.length === 0) {
      return true;
    }

    return condition.paths.some((p) => filePath.includes(p) || p === '*');
  }
}
