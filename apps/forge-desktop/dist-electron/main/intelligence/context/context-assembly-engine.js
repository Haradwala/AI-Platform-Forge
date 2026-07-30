"use strict";
/**
 * context-assembly-engine.ts — Intelligent Context Ranking & Selection Engine
 *
 * Assembles relevance-ranked context windows for AI Agent execution given prompt
 * goals, symbol cross-references, and token budgets.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAssemblyEngine = void 0;
const token_budget_calculator_1 = require("./token-budget-calculator");
class ContextAssemblyEngine {
    searchEngine;
    memoryStore;
    timelinePublisher;
    calculator = new token_budget_calculator_1.TokenBudgetCalculator();
    constructor(searchEngine, memoryStore, timelinePublisher) {
        this.searchEngine = searchEngine;
        this.memoryStore = memoryStore;
        this.timelinePublisher = timelinePublisher;
    }
    /**
     * Intelligently selects and ranks context snippets and memories for an AI prompt.
     */
    async assembleContext(request) {
        const maxTokens = request.maxTokens || 8192;
        const allocation = this.calculator.calculateAllocation(request.prompt, maxTokens);
        // 1. Search relevant symbols
        const searchResults = await this.searchEngine.searchSymbols(request.prompt, 10);
        const selectedNodes = searchResults.map((r) => r.node);
        // 2. Extract code snippets
        const snippets = selectedNodes.map((n) => `// File: ${n.filePath}:${n.startLine}\n${n.signature || n.name}`);
        // 3. Retrieve relevant memories if requested
        const memories = request.includeMemories !== false
            ? await this.memoryStore.queryMemories(request.prompt)
            : [];
        // Calculate token usage
        const contextText = snippets.join('\n\n');
        const contextTokens = this.calculator.estimateTokens(contextText);
        const memoryTokens = this.calculator.estimateTokens(JSON.stringify(memories));
        const assembled = {
            prompt: request.prompt,
            selectedNodes,
            snippets,
            memories,
            tokenUsage: {
                promptTokens: allocation.promptTokens,
                contextTokens,
                totalTokens: allocation.promptTokens + contextTokens + memoryTokens,
                maxTokens,
            },
        };
        if (this.timelinePublisher) {
            this.timelinePublisher.publishContextAssembled(request.workspaceRoot, assembled.tokenUsage);
        }
        return assembled;
    }
    calculateTokenBudget(modelId, maxTokens) {
        return this.calculator.calculateAllocation('', maxTokens);
    }
}
exports.ContextAssemblyEngine = ContextAssemblyEngine;
//# sourceMappingURL=context-assembly-engine.js.map