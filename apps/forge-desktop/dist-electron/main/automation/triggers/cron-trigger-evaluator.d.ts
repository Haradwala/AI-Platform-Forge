/**
 * cron-trigger-evaluator.ts — Cron Schedule Trigger Evaluator
 *
 * Evaluates scheduled cron expressions against trigger conditions.
 */
import { AutomationTriggerCondition } from '../contracts/automation-types';
export declare class CronTriggerEvaluator {
    /**
     * Matches a cron trigger condition against an event timestamp.
     */
    matches(condition: AutomationTriggerCondition, eventTime?: number): boolean;
}
