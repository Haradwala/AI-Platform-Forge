/**
 * git-trigger-evaluator.ts — Git Lifecycle Trigger Evaluator
 *
 * Evaluates Git push, pull_request, and branch events against workflow trigger conditions.
 */

import { AutomationTriggerCondition } from '../contracts/automation-types';

export interface GitEventPayload {
  type: 'push' | 'pull_request';
  branch?: string;
  filesChanged?: string[];
}

export class GitTriggerEvaluator {
  /**
   * Matches a Git event payload against an automation trigger condition.
   */
  matches(condition: AutomationTriggerCondition, payload: GitEventPayload): boolean {
    if (condition.type !== payload.type) {
      return false;
    }

    if (condition.branches && condition.branches.length > 0 && payload.branch) {
      const match = condition.branches.some(
        (b) => b === payload.branch || b === '*' || (b.endsWith('/*') && payload.branch?.startsWith(b.replace('/*', '')))
      );
      if (!match) return false;
    }

    if (condition.paths && condition.paths.length > 0 && payload.filesChanged) {
      const match = payload.filesChanged.some((file) =>
        condition.paths!.some((p) => file.includes(p) || p === '*')
      );
      if (!match) return false;
    }

    return true;
  }
}
