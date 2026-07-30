"use strict";
/**
 * fact-interpreter.ts
 *
 * FactInterpreter — interprets raw IExecutionResult[] items into
 * structured GroundedContext facts (RepositoryFact, TerminalFact).
 *
 * Responsibilities:
 *  - Separate interpretation logic from ResponseContextBuilder
 *  - Match tool execution results by toolId in a type-safe manner
 *  - Construct immutable RepositoryFact and TerminalFact discriminated unions
 *  - Preserve raw executionResults alongside interpreted facts
 *
 * Canonical Architecture Rule:
 *  Execution layers never produce prompts. Response layers never inspect tools.
 *  GroundedContext is the only contract crossing that boundary.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactInterpreter = void 0;
class FactInterpreter {
    /**
     * Interprets raw IExecutionResult[] items into a structured, immutable GroundedContext.
     */
    interpret(executionResults) {
        const repositoryFacts = [];
        const terminalFacts = [];
        for (const exec of executionResults) {
            if (exec.status !== 'completed' || !exec.result) {
                continue;
            }
            const res = exec.result;
            const toolId = exec.toolId;
            switch (toolId) {
                case 'search_workspace': {
                    const rawResults = Array.isArray(res.results) ? res.results : [];
                    const matches = rawResults.map((r) => ({
                        filePath: r.filePath || r.file || 'unknown',
                        line: typeof r.line === 'number' ? r.line : undefined,
                        text: r.text || r.snippet || '',
                    }));
                    const fact = {
                        kind: 'workspace_search',
                        query: res.query || '',
                        matches,
                        totalMatches: matches.length,
                    };
                    repositoryFacts.push(fact);
                    break;
                }
                case 'read_file': {
                    if (typeof res.content === 'string') {
                        const fact = {
                            kind: 'file_content',
                            path: res.filePath || 'unknown',
                            content: res.content,
                        };
                        repositoryFacts.push(fact);
                    }
                    break;
                }
                case 'list_dir': {
                    const items = Array.isArray(res.items) ? res.items : [];
                    const fact = {
                        kind: 'directory_listing',
                        path: res.folderPath || undefined,
                        items,
                    };
                    repositoryFacts.push(fact);
                    break;
                }
                case 'run_terminal_command': {
                    const fact = {
                        command: res.command || 'terminal_command',
                        stdout: typeof res.output === 'string' ? res.output : JSON.stringify(res),
                        stderr: res.stderr || undefined,
                        exitCode: typeof res.exitCode === 'number' ? res.exitCode : 0,
                    };
                    terminalFacts.push(fact);
                    break;
                }
                default: {
                    // Future tool facts can be handled here cleanly
                    break;
                }
            }
        }
        return {
            executionResults,
            repositoryFacts: Object.freeze(repositoryFacts),
            terminalFacts: Object.freeze(terminalFacts),
        };
    }
}
exports.FactInterpreter = FactInterpreter;
//# sourceMappingURL=fact-interpreter.js.map