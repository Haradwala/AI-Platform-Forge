/**
 * ai-foundation.module.ts — Sub-module for AI Foundation & Planning Services
 *
 * Registers ProviderRegistry, RuntimeManager, ConfigurationService, AiProvider,
 * AiSessionService, ContextEngine, TokenBudgetManager, ConversationManager,
 * PromptAssemblyEngine, PlanningGraph, ExecutionOrchestrator, ReasoningEngine, etc.
 */
import type { IDesktopContainer, IServiceResolver } from '../../container/interfaces';
import { ToolRegistry } from '../../ai/tools/tool-registry';
export declare function registerBuiltInTools(registry: ToolRegistry, resolver: IServiceResolver): ToolRegistry;
export declare class AiFoundationModule {
    static register(container: IDesktopContainer): void;
}
