/**
 * prompt-assembly-engine.ts
 *
 * Phase 8/9 — Prompt Assembly Engine.
 *
 * Single, canonical prompt composition engine that builds every AI runtime request from:
 *  - Goal & task instructions
 *  - Planner output / step plan
 *  - Retrieved memories
 *  - Ranked workspace context
 *  - Diagnostics
 *  - Git diff
 *  - Terminal output
 *  - Available tool definitions & schemas
 *
 * PromptAssemblyEngine is the ONLY component allowed to construct prompts.
 */
import type { IToolRegistry, IToolDefinition } from '../../container/service-interfaces';
import type { ContextSnapshot } from './context-engine';
import type { ScoredMemoryItem } from '../memory/memory-types';
export interface AssembledPrompt {
    systemPrompt: string;
    userPrompt: string;
    tokenEstimate: number;
    sections: string[];
}
export interface PromptAssemblyOptions {
    /** Target user goal or prompt. */
    goal: string;
    /** Optional planner step instruction / plan. */
    planInstruction?: string;
    /** ContextSnapshot from ContextEngine. */
    contextSnapshot?: ContextSnapshot;
    /** Retrieved memories from MemoryEngine. */
    memories?: ScoredMemoryItem[];
    /** Registered tool definitions from ToolRegistry. */
    tools?: IToolDefinition[];
    /** Optional custom system prompt override. */
    systemPromptOverride?: string;
}
export interface IPromptAssemblyEngine {
    assemble(options: PromptAssemblyOptions): AssembledPrompt;
}
export declare class PromptAssemblyEngine implements IPromptAssemblyEngine {
    private readonly toolRegistry?;
    constructor(toolRegistry?: IToolRegistry | undefined);
    assemble(options: PromptAssemblyOptions): AssembledPrompt;
}
