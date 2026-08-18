"use strict";
/**
 * prompt-formatter-registry.ts
 *
 * Open/Closed Registry mapping KnowledgeFact kinds to IPromptFactFormatter strategies.
 * Accepts strategies via Dependency Injection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptFormatterRegistry = void 0;
class PromptFormatterRegistry {
    strategyMap = new Map();
    constructor(formatters = []) {
        for (const formatter of formatters) {
            this.register(formatter);
        }
    }
    register(formatter) {
        this.strategyMap.set(formatter.factKind, formatter);
    }
    format(fact) {
        if (!fact || !fact.kind)
            return null;
        const strategy = this.strategyMap.get(fact.kind);
        if (!strategy)
            return null;
        return strategy.format(fact);
    }
}
exports.PromptFormatterRegistry = PromptFormatterRegistry;
//# sourceMappingURL=prompt-formatter-registry.js.map