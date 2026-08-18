"use strict";
/**
 * knowledge-interpreter-registry.ts
 *
 * Open/Closed Registry mapping ExecutionResultKind to IKnowledgeInterpreter strategies.
 * Accepts strategies via Dependency Injection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeInterpreterRegistry = void 0;
class KnowledgeInterpreterRegistry {
    strategyMap = new Map();
    constructor(interpreters = []) {
        for (const interpreter of interpreters) {
            this.register(interpreter);
        }
    }
    register(interpreter) {
        this.strategyMap.set(interpreter.kind, interpreter);
    }
    interpret(result) {
        if (!result || !result.kind)
            return [];
        const strategy = this.strategyMap.get(result.kind);
        if (!strategy)
            return [];
        return strategy.interpret(result);
    }
}
exports.KnowledgeInterpreterRegistry = KnowledgeInterpreterRegistry;
//# sourceMappingURL=knowledge-interpreter-registry.js.map