/**
 * context-assembly-engine.ts — Intelligent Context Ranking & Selection Engine
 *
 * Assembles relevance-ranked context windows for AI Agent execution given prompt
 * goals, symbol cross-references, and token budgets.
 */
import { ContextAssemblyRequest, AssembledContext } from '../contracts/intelligence-types';
import { SemanticSearchEngine } from '../search/semantic-search-engine';
import { EngineeringMemoryStore } from '../memory/engineering-memory-store';
import { IntelligenceTimelinePublisher } from '../timeline/intelligence-timeline-publisher';
export declare class ContextAssemblyEngine {
    private readonly searchEngine;
    private readonly memoryStore;
    private readonly timelinePublisher?;
    private calculator;
    constructor(searchEngine: SemanticSearchEngine, memoryStore: EngineeringMemoryStore, timelinePublisher?: IntelligenceTimelinePublisher | undefined);
    /**
     * Intelligently selects and ranks context snippets and memories for an AI prompt.
     */
    assembleContext(request: ContextAssemblyRequest): Promise<AssembledContext>;
    calculateTokenBudget(modelId: string, maxTokens: number): any;
}
