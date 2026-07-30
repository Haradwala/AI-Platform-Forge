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

export class PromptAssemblyEngine implements IPromptAssemblyEngine {
  constructor(private readonly toolRegistry?: IToolRegistry) {}

  assemble(options: PromptAssemblyOptions): AssembledPrompt {
    const sections: string[] = [];

    // 1. System Prompt Composition
    let systemPrompt = options.systemPromptOverride ||
      'You are Forge AI, an advanced AI software engineering assistant working directly within the Forge IDE. ' +
      'Follow software engineering best practices, produce clean code, and utilize provided tools efficiently.';

    const tools = options.tools || (this.toolRegistry ? this.toolRegistry.getAll() : []);
    if (tools.length > 0) {
      systemPrompt += '\n\n### Available Tools\n';
      systemPrompt += tools
        .map((t) => `- **${t.id}**: ${t.description}`)
        .join('\n');
      sections.push('Available Tools');
    }

    // 2. User Prompt Composition
    const userPromptLines: string[] = [];

    userPromptLines.push(`## Target Goal\n${options.goal}`);
    sections.push('Target Goal');

    if (options.planInstruction) {
      userPromptLines.push(`\n## Execution Plan / Instruction\n${options.planInstruction}`);
      sections.push('Execution Plan');
    }

    // 3. Retrieved Memories Section
    if (options.memories && options.memories.length > 0) {
      userPromptLines.push('\n## Relevant Persistent Memories');
      for (const mem of options.memories) {
        userPromptLines.push(`- [${mem.type.toUpperCase()}] ${mem.content}`);
      }
      sections.push('Memories');
    }

    // 4. Workspace Context Snapshot Section
    if (options.contextSnapshot && options.contextSnapshot.items.length > 0) {
      userPromptLines.push('\n## Workspace Context & Code Artifacts');
      for (const item of options.contextSnapshot.items) {
        userPromptLines.push(`\n### Context Item: ${item.source} (${item.path || item.id})\n${item.content}`);
      }
      sections.push('Workspace Context');
    }

    const userPrompt = userPromptLines.join('\n');

    // 5. Token Estimation (~4 chars per token)
    const fullLength = systemPrompt.length + userPrompt.length;
    const tokenEstimate = Math.ceil(fullLength / 4);

    return {
      systemPrompt,
      userPrompt,
      tokenEstimate,
      sections,
    };
  }
}
