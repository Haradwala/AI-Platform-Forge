"use strict";
/**
 * context-budget.ts
 *
 * Enforces token budgets on ranked context items, ensuring total token count
 * does not exceed configured limits.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBudget = void 0;
class ContextBudget {
    /** Estimate token count for a given text (approx 4 chars per token). */
    estimateTokens(text) {
        if (!text)
            return 0;
        return Math.ceil(text.length / 4);
    }
    enforceBudget(items, maxTokens = 4096) {
        const accepted = [];
        let currentTokens = 0;
        let truncated = false;
        for (const item of items) {
            const itemTokens = this.estimateTokens(item.content);
            if (currentTokens + itemTokens <= maxTokens) {
                accepted.push(item);
                currentTokens += itemTokens;
            }
            else {
                // Option: partial content truncation if item can fit partially (> 50 tokens space left)
                const remainingTokens = maxTokens - currentTokens;
                if (remainingTokens > 50 && item.content.length > 200) {
                    const charLimit = remainingTokens * 4;
                    const truncatedContent = item.content.substring(0, charLimit) + '\n... [truncated]';
                    accepted.push({
                        ...item,
                        content: truncatedContent,
                    });
                    currentTokens += this.estimateTokens(truncatedContent);
                }
                truncated = true;
                break;
            }
        }
        return {
            accepted,
            totalTokens: currentTokens,
            truncated,
        };
    }
}
exports.ContextBudget = ContextBudget;
//# sourceMappingURL=context-budget.js.map