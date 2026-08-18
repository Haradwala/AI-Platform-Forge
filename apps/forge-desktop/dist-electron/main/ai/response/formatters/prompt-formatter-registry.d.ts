/**
 * prompt-formatter-registry.ts
 *
 * Open/Closed Registry mapping KnowledgeFact kinds to IPromptFactFormatter strategies.
 * Accepts strategies via Dependency Injection.
 */
import type { KnowledgeFact, PromptSection } from '../response-types';
import type { IPromptFactFormatter } from './prompt-formatter-strategy';
export declare class PromptFormatterRegistry {
    private readonly strategyMap;
    constructor(formatters?: IPromptFactFormatter[]);
    register(formatter: IPromptFactFormatter): void;
    format(fact: KnowledgeFact): PromptSection | null;
}
