/**
 * prompt-formatter-registry.ts
 *
 * Open/Closed Registry mapping KnowledgeFact kinds to IPromptFactFormatter strategies.
 * Accepts strategies via Dependency Injection.
 */

import type { KnowledgeFact, PromptSection } from '../response-types';
import type { IPromptFactFormatter } from './prompt-formatter-strategy';

export class PromptFormatterRegistry {
  private readonly strategyMap = new Map<string, IPromptFactFormatter>();

  constructor(formatters: IPromptFactFormatter[] = []) {
    for (const formatter of formatters) {
      this.register(formatter);
    }
  }

  register(formatter: IPromptFactFormatter): void {
    this.strategyMap.set(formatter.factKind, formatter);
  }

  format(fact: KnowledgeFact): PromptSection | null {
    if (!fact || !fact.kind) return null;
    const strategy = this.strategyMap.get(fact.kind);
    if (!strategy) return null;
    return strategy.format(fact);
  }
}
