"use strict";
/**
 * fact-interpreter.ts
 *
 * FactInterpreter / KnowledgeInterpreter — delegates execution result
 * interpretation to KnowledgeInterpreterRegistry strategy handlers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactInterpreter = void 0;
const knowledge_interpreter_registry_1 = require("./interpreters/knowledge-interpreter-registry");
const knowledge_interpreter_strategy_1 = require("./interpreters/knowledge-interpreter-strategy");
class FactInterpreter {
    registry;
    constructor(registry) {
        this.registry =
            registry ||
                new knowledge_interpreter_registry_1.KnowledgeInterpreterRegistry([
                    new knowledge_interpreter_strategy_1.WorkspaceStatsKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.FileListKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.SearchResultsKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.FileContentKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.TerminalOutputKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.GitDiffKnowledgeInterpreter(),
                    new knowledge_interpreter_strategy_1.ErrorTraceKnowledgeInterpreter(),
                ]);
    }
    /**
     * Interprets normalized ExecutionResult envelopes into GroundedContext facts.
     */
    interpret(executionResults) {
        const repositoryFacts = [];
        const terminalFacts = [];
        const knowledgeFacts = [];
        for (const exec of executionResults) {
            if (exec.status !== 'completed' || !exec.result) {
                continue;
            }
            const envelope = exec.result;
            const interpreted = this.registry.interpret(envelope);
            for (const fact of interpreted) {
                knowledgeFacts.push(fact);
                if (fact.kind === 'terminal_output') {
                    terminalFacts.push(fact);
                }
                else {
                    repositoryFacts.push(fact);
                }
            }
        }
        return {
            executionResults,
            repositoryFacts: Object.freeze(repositoryFacts),
            terminalFacts: Object.freeze(terminalFacts),
            knowledgeFacts: Object.freeze(knowledgeFacts),
        };
    }
}
exports.FactInterpreter = FactInterpreter;
//# sourceMappingURL=fact-interpreter.js.map