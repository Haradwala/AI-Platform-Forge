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

export class TokenBudgetCalculator {
  /**
   * Calculates token allocation for a given model window limit.
   */
  calculateAllocation(prompt: string, maxTokens: number = 8192): TokenAllocation {
    // Rough estimate: ~4 characters per token
    const promptTokens = Math.ceil(prompt.length / 4);
    const reservedForResponse = 2048;
    const memoryReserve = 512;

    const availableForCode = Math.max(0, maxTokens - promptTokens - reservedForResponse - memoryReserve);

    return {
      promptTokens,
      contextTokens: 0,
      memoryTokens: 0,
      totalTokens: promptTokens,
      maxTokens,
      availableForCode,
    };
  }

  estimateTokens(text: string): number {
    return Math.ceil((text || '').length / 4);
  }
}
