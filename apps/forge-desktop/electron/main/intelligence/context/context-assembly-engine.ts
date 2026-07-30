/**
 * context-assembly-engine.ts — Intelligent Context Ranking & Selection Engine
 *
 * Assembles relevance-ranked context windows for AI Agent execution given prompt
 * goals, symbol cross-references, and token budgets.
 */

import { ContextAssemblyRequest, AssembledContext, KnowledgeNode } from '../contracts/intelligence-types';
import { SemanticSearchEngine } from '../search/semantic-search-engine';
import { EngineeringMemoryStore } from '../memory/engineering-memory-store';
import { TokenBudgetCalculator } from './token-budget-calculator';
import { IntelligenceTimelinePublisher } from '../timeline/intelligence-timeline-publisher';

export class ContextAssemblyEngine {
  private calculator = new TokenBudgetCalculator();

  constructor(
    private readonly searchEngine: SemanticSearchEngine,
    private readonly memoryStore: EngineeringMemoryStore,
    private readonly timelinePublisher?: IntelligenceTimelinePublisher
  ) {}

  /**
   * Intelligently selects and ranks context snippets and memories for an AI prompt.
   */
  async assembleContext(request: ContextAssemblyRequest): Promise<AssembledContext> {
    const maxTokens = request.maxTokens || 8192;
    const allocation = this.calculator.calculateAllocation(request.prompt, maxTokens);

    // 1. Search relevant symbols
    const searchResults = await this.searchEngine.searchSymbols(request.prompt, 10);
    const selectedNodes: KnowledgeNode[] = searchResults.map((r) => r.node);

    // 2. Extract code snippets
    const snippets: string[] = selectedNodes.map(
      (n) => `// File: ${n.filePath}:${n.startLine}\n${n.signature || n.name}`
    );

    // 3. Retrieve relevant memories if requested
    const memories = request.includeMemories !== false
      ? await this.memoryStore.queryMemories(request.prompt)
      : [];

    // Calculate token usage
    const contextText = snippets.join('\n\n');
    const contextTokens = this.calculator.estimateTokens(contextText);
    const memoryTokens = this.calculator.estimateTokens(JSON.stringify(memories));

    const assembled: AssembledContext = {
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

  calculateTokenBudget(modelId: string, maxTokens: number): any {
    return this.calculator.calculateAllocation('', maxTokens);
  }
}
