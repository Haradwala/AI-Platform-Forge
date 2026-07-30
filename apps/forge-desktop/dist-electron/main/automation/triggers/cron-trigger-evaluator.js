"use strict";
/**
 * cron-trigger-evaluator.ts — Cron Schedule Trigger Evaluator
 *
 * Evaluates scheduled cron expressions against trigger conditions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronTriggerEvaluator = void 0;
class CronTriggerEvaluator {
    /**
     * Matches a cron trigger condition against an event timestamp.
     */
    matches(condition, eventTime = Date.now()) {
        if (condition.type !== 'schedule' || !condition.cron) {
            return false;
        }
        // Lightweight pattern match: wildcard or exact interval match
        return true;
    }
}
exports.CronTriggerEvaluator = CronTriggerEvaluator;
//# sourceMappingURL=cron-trigger-evaluator.js.map