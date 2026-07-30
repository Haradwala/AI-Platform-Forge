"use strict";
/**
 * context-sources.ts
 *
 * 10 Independent context sources for gathering workspace context before AI requests:
 *  - user_goal
 *  - active_editor
 *  - open_tabs
 *  - workspace_files
 *  - diagnostics
 *  - terminal_output
 *  - git_diff
 *  - conversation
 *  - memory
 *  - symbols
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolsSource = exports.MemorySource = exports.ConversationSource = exports.GitDiffSource = exports.TerminalOutputSource = exports.DiagnosticsSource = exports.WorkspaceFilesSource = exports.OpenTabsSource = exports.ActiveEditorSource = exports.UserGoalSource = void 0;
exports.getAllContextSources = getAllContextSources;
// ─── Concrete Implementations ─────────────────────────────────────────────────
class UserGoalSource {
    sourceType = 'user_goal';
    async gather(options) {
        if (!options.userGoal)
            return [];
        return [{
                id: 'src:user_goal',
                source: 'user_goal',
                content: options.userGoal,
                recency: Date.now(),
            }];
    }
}
exports.UserGoalSource = UserGoalSource;
class ActiveEditorSource {
    sourceType = 'active_editor';
    async gather(options) {
        if (!options.activeFilePath)
            return [];
        const selection = options.selectionText ? `\nSelection: ${options.selectionText}` : '';
        return [{
                id: `src:active_editor:${options.activeFilePath}`,
                source: 'active_editor',
                path: options.activeFilePath,
                content: `Active File: ${options.activeFilePath}${selection}`,
                recency: Date.now(),
            }];
    }
}
exports.ActiveEditorSource = ActiveEditorSource;
class OpenTabsSource {
    sourceType = 'open_tabs';
    async gather(options) {
        if (!options.openFilePaths || options.openFilePaths.length === 0)
            return [];
        return options.openFilePaths.map((p) => ({
            id: `src:open_tab:${p}`,
            source: 'open_tabs',
            path: p,
            content: `Open Tab: ${p}`,
            recency: Date.now() - 100,
        }));
    }
}
exports.OpenTabsSource = OpenTabsSource;
class WorkspaceFilesSource {
    sourceType = 'workspace_files';
    async gather(options) {
        if (!options.workspaceFiles || options.workspaceFiles.length === 0)
            return [];
        return options.workspaceFiles.map((f) => ({
            id: `src:workspace_file:${f.path}`,
            source: 'workspace_files',
            path: f.path,
            content: f.content,
            recency: Date.now() - 500,
        }));
    }
}
exports.WorkspaceFilesSource = WorkspaceFilesSource;
class DiagnosticsSource {
    sourceType = 'diagnostics';
    async gather(options) {
        if (!options.diagnostics || options.diagnostics.length === 0)
            return [];
        return options.diagnostics.map((d, idx) => ({
            id: `src:diagnostic:${d.file}:${idx}`,
            source: 'diagnostics',
            path: d.file,
            content: `[${d.severity.toUpperCase()}] ${d.file}: ${d.message}`,
            recency: Date.now(),
        }));
    }
}
exports.DiagnosticsSource = DiagnosticsSource;
class TerminalOutputSource {
    sourceType = 'terminal_output';
    async gather(options) {
        if (!options.terminalOutput)
            return [];
        return [{
                id: 'src:terminal_output',
                source: 'terminal_output',
                content: options.terminalOutput,
                recency: Date.now() - 50,
            }];
    }
}
exports.TerminalOutputSource = TerminalOutputSource;
class GitDiffSource {
    sourceType = 'git_diff';
    async gather(options) {
        if (!options.gitDiff)
            return [];
        return [{
                id: 'src:git_diff',
                source: 'git_diff',
                content: options.gitDiff,
                recency: Date.now() - 200,
            }];
    }
}
exports.GitDiffSource = GitDiffSource;
class ConversationSource {
    sourceType = 'conversation';
    async gather(options) {
        if (!options.conversationHistory || options.conversationHistory.length === 0)
            return [];
        return options.conversationHistory.map((c, idx) => ({
            id: `src:conversation:${idx}`,
            source: 'conversation',
            content: `${c.role}: ${c.content}`,
            recency: Date.now() - (options.conversationHistory.length - idx) * 1000,
        }));
    }
}
exports.ConversationSource = ConversationSource;
class MemorySource {
    sourceType = 'memory';
    async gather(options) {
        if (!options.memoryFacts || options.memoryFacts.length === 0)
            return [];
        return options.memoryFacts.map((fact, idx) => ({
            id: `src:memory:${idx}`,
            source: 'memory',
            content: `Fact: ${fact}`,
            recency: Date.now() - 2000,
        }));
    }
}
exports.MemorySource = MemorySource;
class SymbolsSource {
    sourceType = 'symbols';
    async gather(options) {
        if (!options.symbols || options.symbols.length === 0)
            return [];
        return options.symbols.map((sym, idx) => ({
            id: `src:symbol:${sym.filePath}:${sym.name}:${idx}`,
            source: 'symbols',
            path: sym.filePath,
            content: `Symbol [${sym.kind}] ${sym.name} in ${sym.filePath}`,
            recency: Date.now(),
        }));
    }
}
exports.SymbolsSource = SymbolsSource;
/** Returns default instances of all 10 context sources. */
function getAllContextSources() {
    return [
        new UserGoalSource(),
        new ActiveEditorSource(),
        new OpenTabsSource(),
        new WorkspaceFilesSource(),
        new DiagnosticsSource(),
        new TerminalOutputSource(),
        new GitDiffSource(),
        new ConversationSource(),
        new MemorySource(),
        new SymbolsSource(),
    ];
}
//# sourceMappingURL=context-sources.js.map