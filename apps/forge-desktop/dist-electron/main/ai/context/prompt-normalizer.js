"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptNormalizer = void 0;
class PromptNormalizer {
    normalize(prompt, currentContext) {
        let executionMode = 'chat';
        let cleanPrompt = prompt.trim();
        if (cleanPrompt.startsWith('/plan ')) {
            executionMode = 'plan';
            cleanPrompt = cleanPrompt.substring(5).trim();
        }
        else if (cleanPrompt.startsWith('/execute ')) {
            executionMode = 'execute';
            cleanPrompt = cleanPrompt.substring(9).trim();
        }
        else if (cleanPrompt.startsWith('/review ')) {
            executionMode = 'review';
            cleanPrompt = cleanPrompt.substring(8).trim();
        }
        return {
            goal: cleanPrompt,
            context: currentContext,
            memory: {
                conversationId: `conv_${Date.now()}`,
                shortTermFacts: []
            },
            executionMode
        };
    }
}
exports.PromptNormalizer = PromptNormalizer;
//# sourceMappingURL=prompt-normalizer.js.map