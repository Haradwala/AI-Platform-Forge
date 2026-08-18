"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBudget = void 0;
const context_compressor_1 = require("./context-compressor");
class ContextBudget {
    compressor;
    constructor(compressor = new context_compressor_1.ContextCompressor()) {
        this.compressor = compressor;
    }
    /** Estimate token count for a given text (approx 4 chars per token). */
    estimateTokens(text) {
        if (!text)
            return 0;
        return Math.ceil(text.length / 4);
    }
    enforceBudget(items, maxTokens = 4096, userGoal) {
        const accepted = [];
        let currentTokens = 0;
        let truncated = false;
        for (const item of items) {
            let itemContent = item.content;
            let itemTokens = this.estimateTokens(itemContent);
            if (currentTokens + itemTokens <= maxTokens) {
                accepted.push({
                    ...item,
                    content: itemContent,
                });
                currentTokens += itemTokens;
            }
            else {
                const remainingTokens = maxTokens - currentTokens;
                if (remainingTokens > 50 && itemContent.length > 200) {
                    // Try intelligent context compression first
                    const compressed = this.compressor.compressFileContent(itemContent, userGoal || '', item.path);
                    if (compressed && compressed.length < itemContent.length) {
                        itemContent = compressed;
                        itemTokens = this.estimateTokens(itemContent);
                    }
                    if (currentTokens + itemTokens <= maxTokens) {
                        accepted.push({
                            ...item,
                            content: itemContent,
                        });
                        currentTokens += itemTokens;
                        continue;
                    }
                    // Fall back to character boundary truncation if compression was not enough to fit
                    const charLimit = remainingTokens * 4;
                    const truncatedContent = itemContent.substring(0, charLimit) + '\n... [truncated]';
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