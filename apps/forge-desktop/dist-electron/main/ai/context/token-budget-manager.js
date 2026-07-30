"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBudgetManager = void 0;
class TokenBudgetManager {
    defaultBudget;
    constructor(defaultBudget = 4096) {
        this.defaultBudget = defaultBudget;
    }
    allocateAndCompress(items, budget = this.defaultBudget) {
        const seen = new Set();
        const unique = items.filter((item) => {
            if (seen.has(item.id))
                return false;
            seen.add(item.id);
            return true;
        });
        const sorted = [...unique].sort((a, b) => b.score - a.score);
        let currentTokens = 0;
        const accepted = [];
        for (const item of sorted) {
            const approxTokens = Math.ceil(item.content.length / 4);
            if (currentTokens + approxTokens <= budget) {
                currentTokens += approxTokens;
                accepted.push(item);
            }
            else {
                const remainingBudget = budget - currentTokens;
                if (remainingBudget > 50) {
                    const allowedChars = remainingBudget * 4;
                    const chunkedContent = item.content.substring(0, allowedChars) + '\n... [Truncated due to token budget]';
                    accepted.push({
                        ...item,
                        content: chunkedContent,
                        score: item.score - 10,
                    });
                    break;
                }
            }
        }
        return accepted;
    }
}
exports.TokenBudgetManager = TokenBudgetManager;
//# sourceMappingURL=token-budget-manager.js.map