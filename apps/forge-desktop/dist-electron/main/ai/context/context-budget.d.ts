import type { ScoredContextItem } from './context-selector';
import { ContextCompressor } from './context-compressor';
export interface BudgetResult {
    accepted: ScoredContextItem[];
    totalTokens: number;
    truncated: boolean;
}
export declare class ContextBudget {
    private readonly compressor;
    constructor(compressor?: ContextCompressor);
    /** Estimate token count for a given text (approx 4 chars per token). */
    estimateTokens(text: string): number;
    enforceBudget(items: ScoredContextItem[], maxTokens?: number, userGoal?: string): BudgetResult;
}
