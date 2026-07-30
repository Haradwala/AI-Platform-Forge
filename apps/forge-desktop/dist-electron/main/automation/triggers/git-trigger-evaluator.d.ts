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
export declare class GitTriggerEvaluator {
    /**
     * Matches a Git event payload against an automation trigger condition.
     */
    matches(condition: AutomationTriggerCondition, payload: GitEventPayload): boolean;
}
