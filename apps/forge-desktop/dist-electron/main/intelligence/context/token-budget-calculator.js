"use strict";
/**
 * token-budget-calculator.ts — Token Window Budget & Allocation Engine
 *
 * Allocates dynamic token budgets across system prompt, task goals, code symbols,
 * snippets, and workspace memories.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBudgetCalculator = void 0;
class TokenBudgetCalculator {
    /**
     * Calculates token allocation for a given model window limit.
     */
    calculateAllocation(prompt, maxTokens = 8192) {
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
    estimateTokens(text) {
        return Math.ceil((text || '').length / 4);
    }
}
exports.TokenBudgetCalculator = TokenBudgetCalculator;
//# sourceMappingURL=token-budget-calculator.js.map