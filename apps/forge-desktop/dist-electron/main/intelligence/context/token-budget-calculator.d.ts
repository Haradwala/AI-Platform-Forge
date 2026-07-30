/**
 * token-budget-calculator.ts — Token Window Budget & Allocation Engine
 *
 * Allocates dynamic token budgets across system prompt, task goals, code symbols,
 * snippets, and workspace memories.
 */
export interface TokenAllocation {
    promptTokens: number;
    contextTokens: number;
    memoryTokens: number;
    totalTokens: number;
    maxTokens: number;
    availableForCode: number;
}
export declare class TokenBudgetCalculator {
    /**
     * Calculates token allocation for a given model window limit.
     */
    calculateAllocation(prompt: string, maxTokens?: number): TokenAllocation;
    estimateTokens(text: string): number;
}
