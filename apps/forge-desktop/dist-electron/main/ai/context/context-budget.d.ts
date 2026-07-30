/**
 * context-budget.ts
 *
 * Enforces token budgets on ranked context items, ensuring total token count
 * does not exceed configured limits.
 */
import type { ScoredContextItem } from './context-selector';
export interface BudgetResult {
    accepted: ScoredContextItem[];
    totalTokens: number;
    truncated: boolean;
}
export declare class ContextBudget {
    /** Estimate token count for a given text (approx 4 chars per token). */
    estimateTokens(text: string): number;
    enforceBudget(items: ScoredContextItem[], maxTokens?: number): BudgetResult;
}
