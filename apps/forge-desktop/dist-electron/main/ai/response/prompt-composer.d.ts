/**
 * prompt-composer.ts
 *
 * PromptComposer — collects, orders, and formats PromptSection objects into a
 * clean, focused prompt string for the LLM runtime.
 *
 * Enforces pure section collection, priority-based ordering, and string assembly.
 */
import type { ResponseRequest } from './response-types';
import { PromptFormatterRegistry } from './formatters/prompt-formatter-registry';
export declare class PromptComposer {
    private readonly registry;
    constructor(registry?: PromptFormatterRegistry);
    /**
     * Composes a structured ResponseRequest into a clean prompt string for LLM generation.
     */
    compose(request: ResponseRequest): string;
}
