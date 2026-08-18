"use strict";
/**
 * knowledge-interpreter-strategy.ts
 *
 * Modular strategy implementations converting normalized ExecutionResult<T>
 * envelopes into decoupled KnowledgeFact objects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTraceKnowledgeInterpreter = exports.GitDiffKnowledgeInterpreter = exports.TerminalOutputKnowledgeInterpreter = exports.FileContentKnowledgeInterpreter = exports.SearchResultsKnowledgeInterpreter = exports.FileListKnowledgeInterpreter = exports.WorkspaceStatsKnowledgeInterpreter = void 0;
const execution_result_kind_1 = require("../../contracts/execution-result-kind");
class WorkspaceStatsKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS;
    interpret(result) {
        const payload = result.payload || {};
        const filesCount = payload.filesCount ?? payload.stats?.filesCount ?? 0;
        const fact = {
            kind: 'workspace_statistics',
            fileCount: filesCount,
            symbolsCount: payload.symbolsCount ?? 0,
            circularDependenciesCount: payload.circularDependenciesCount ?? 0,
            languages: Array.isArray(payload.languages) ? payload.languages : [],
            projects: Array.isArray(payload.projects) ? payload.projects : [],
        };
        return [fact];
    }
}
exports.WorkspaceStatsKnowledgeInterpreter = WorkspaceStatsKnowledgeInterpreter;
class FileListKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.FILE_LIST;
    interpret(result) {
        const payload = result.payload || {};
        const rawFiles = payload.files || (Array.isArray(payload.results) ? payload.results : []);
        const files = rawFiles.map((f) => (typeof f === 'string' ? f : f?.filePath || f?.file || String(f)));
        const fact = {
            kind: 'file_list',
            files,
            total: payload.total ?? files.length,
        };
        return [fact];
    }
}
exports.FileListKnowledgeInterpreter = FileListKnowledgeInterpreter;
class SearchResultsKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS;
    interpret(result) {
        const payload = result.payload || {};
        const rawResults = Array.isArray(payload.results) ? payload.results : [];
        const matches = rawResults.map((r) => ({
            filePath: r.filePath || r.file || 'unknown',
            line: typeof r.line === 'number' ? r.line : undefined,
            text: r.text || r.snippet || '',
        }));
        const fact = {
            kind: 'workspace_search',
            query: payload.query || '',
            matches,
            totalMatches: matches.length,
        };
        return [fact];
    }
}
exports.SearchResultsKnowledgeInterpreter = SearchResultsKnowledgeInterpreter;
class FileContentKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.FILE_CONTENT;
    interpret(result) {
        const payload = result.payload || {};
        const fact = {
            kind: 'file_content',
            path: payload.filePath || 'unknown',
            content: typeof payload.content === 'string' ? payload.content : JSON.stringify(payload),
        };
        return [fact];
    }
}
exports.FileContentKnowledgeInterpreter = FileContentKnowledgeInterpreter;
class TerminalOutputKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT;
    interpret(result) {
        const payload = result.payload || {};
        const fact = {
            kind: 'terminal_output',
            command: payload.command || 'terminal_command',
            stdout: typeof payload.stdout === 'string' ? payload.stdout : (typeof payload.output === 'string' ? payload.output : JSON.stringify(payload)),
            stderr: payload.stderr || undefined,
            exitCode: typeof payload.exitCode === 'number' ? payload.exitCode : 0,
        };
        return [fact];
    }
}
exports.TerminalOutputKnowledgeInterpreter = TerminalOutputKnowledgeInterpreter;
class GitDiffKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.GIT_DIFF;
    interpret(result) {
        const payload = result.payload || {};
        const fact = {
            kind: 'git_diff',
            diff: typeof payload.diff === 'string' ? payload.diff : '',
        };
        return [fact];
    }
}
exports.GitDiffKnowledgeInterpreter = GitDiffKnowledgeInterpreter;
class ErrorTraceKnowledgeInterpreter {
    kind = execution_result_kind_1.ExecutionResultKind.ERROR_TRACE;
    interpret(result) {
        const payload = result.payload || {};
        const fact = {
            kind: 'error_trace',
            error: payload.error || payload.message || 'Unknown error occurred',
        };
        return [fact];
    }
}
exports.ErrorTraceKnowledgeInterpreter = ErrorTraceKnowledgeInterpreter;
//# sourceMappingURL=knowledge-interpreter-strategy.js.map