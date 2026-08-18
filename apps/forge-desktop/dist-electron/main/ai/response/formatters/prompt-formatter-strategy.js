"use strict";
/**
 * prompt-formatter-strategy.ts
 *
 * Strategy implementations converting KnowledgeFact domain objects into
 * structured, prioritized PromptSection objects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorTraceFormatter = exports.GitDiffFormatter = exports.TerminalOutputFormatter = exports.FileContentFormatter = exports.WorkspaceSearchFormatter = exports.FileListFormatter = exports.WorkspaceStatisticsFormatter = void 0;
const context_compressor_1 = require("../../context/context-compressor");
class WorkspaceStatisticsFormatter {
    factKind = 'workspace_statistics';
    format(fact) {
        const lines = [`- Workspace Statistics: ${fact.fileCount} total files in project.`];
        if (fact.languages && fact.languages.length > 0) {
            lines.push(`  Languages: ${fact.languages.join(', ')}`);
        }
        return {
            title: 'Workspace Statistics',
            category: 'grounding',
            priority: 10,
            content: lines.join('\n'),
        };
    }
}
exports.WorkspaceStatisticsFormatter = WorkspaceStatisticsFormatter;
class FileListFormatter {
    factKind = 'file_list';
    format(fact) {
        const lines = [
            `- Workspace File List (${fact.total} files):`,
            `  [${fact.files.slice(0, 100).join(', ')}]`,
        ];
        return {
            title: 'Workspace File List',
            category: 'grounding',
            priority: 20,
            content: lines.join('\n'),
        };
    }
}
exports.FileListFormatter = FileListFormatter;
class WorkspaceSearchFormatter {
    factKind = 'workspace_search';
    format(fact) {
        const lines = [`- Workspace Search (query: "${fact.query}"): Found ${fact.totalMatches} matches.`];
        for (const m of fact.matches.slice(0, 100)) {
            lines.push(`  * ${m.filePath}${m.line ? `:${m.line}` : ''} ${m.text}`);
        }
        return {
            title: 'Workspace Search Results',
            category: 'grounding',
            priority: 30,
            content: lines.join('\n'),
        };
    }
}
exports.WorkspaceSearchFormatter = WorkspaceSearchFormatter;
class FileContentFormatter {
    compressor;
    factKind = 'file_content';
    constructor(compressor = new context_compressor_1.ContextCompressor()) {
        this.compressor = compressor;
    }
    format(fact, goal = '') {
        const compressed = this.compressor.compressFileContent(fact.content, goal, fact.path);
        const lines = [
            `- File Content (${fact.path}):`,
            `\`\`\`\n${compressed}\n\`\`\``,
        ];
        return {
            title: `File Content: ${fact.path}`,
            category: 'grounding',
            priority: 40,
            content: lines.join('\n'),
        };
    }
}
exports.FileContentFormatter = FileContentFormatter;
class TerminalOutputFormatter {
    factKind = 'terminal_output';
    format(fact) {
        const lines = [`- Command executed: "${fact.command}" (Exit Code: ${fact.exitCode ?? 0})`];
        if (fact.stdout) {
            lines.push(`  Output: ${fact.stdout.slice(0, 1000)}`);
        }
        return {
            title: `Terminal Output: ${fact.command}`,
            category: 'grounding',
            priority: 50,
            content: lines.join('\n'),
        };
    }
}
exports.TerminalOutputFormatter = TerminalOutputFormatter;
class GitDiffFormatter {
    factKind = 'git_diff';
    format(fact) {
        const lines = [`- Git Diff:\n\`\`\`diff\n${fact.diff.slice(0, 2000)}\n\`\`\``];
        return {
            title: 'Git Diff',
            category: 'grounding',
            priority: 60,
            content: lines.join('\n'),
        };
    }
}
exports.GitDiffFormatter = GitDiffFormatter;
class ErrorTraceFormatter {
    factKind = 'error_trace';
    format(fact) {
        return {
            title: 'Execution Error',
            category: 'grounding',
            priority: 70,
            content: `- Execution Error Trace: ${fact.error}`,
        };
    }
}
exports.ErrorTraceFormatter = ErrorTraceFormatter;
//# sourceMappingURL=prompt-formatter-strategy.js.map