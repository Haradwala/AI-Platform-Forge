"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOpTool = exports.ToggleTerminalTool = exports.OpenFileTool = exports.RunTerminalCommandTool = exports.SearchWorkspaceTool = exports.ListWorkspaceFilesTool = exports.ListDirectoryTool = exports.WriteFileTool = exports.ReadFileTool = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const execution_goal_1 = require("../contracts/execution-goal");
const execution_result_kind_1 = require("../contracts/execution-result-kind");
const file_query_normalizer_1 = require("../response/file-query-normalizer");
class ReadFileTool {
    workspaceService;
    id = 'read_file';
    description = 'Reads the content of a file from the workspace.';
    inputSchema = {
        type: 'object',
        properties: {
            filePath: { type: 'string', description: 'Absolute path or relative path to the workspace root' }
        },
        required: ['filePath']
    };
    outputSchema = {
        type: 'object',
        properties: {
            content: { type: 'string' }
        }
    };
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async execute(input) {
        const startMs = Date.now();
        const fullPath = this.resolvePath(input.filePath);
        let content;
        try {
            content = await this.workspaceService.readFile(fullPath);
        }
        catch (err) {
            return {
                version: 1,
                success: false,
                goal: execution_goal_1.ExecutionGoal.FILE_CONTENT,
                kind: execution_result_kind_1.ExecutionResultKind.FILE_CONTENT,
                payload: { filePath: input.filePath, content: '' },
                metadata: {
                    toolId: this.id,
                    durationMs: Date.now() - startMs,
                    cached: false,
                    source: 'workspace_service',
                    timestamp: new Date().toISOString(),
                },
                error: `Failed to read file "${input.filePath}": ${err?.message ?? String(err)}`,
            };
        }
        return {
            version: 1,
            success: true,
            goal: execution_goal_1.ExecutionGoal.FILE_CONTENT,
            kind: execution_result_kind_1.ExecutionResultKind.FILE_CONTENT,
            payload: { filePath: input.filePath, content },
            metadata: {
                toolId: this.id,
                durationMs: Date.now() - startMs,
                cached: false,
                source: 'workspace_service',
                timestamp: new Date().toISOString(),
            },
        };
    }
    resolvePath(p) {
        if (path.isAbsolute(p))
            return p;
        const root = this.workspaceService.getRootPath() || process.cwd();
        return path.join(root, p);
    }
}
exports.ReadFileTool = ReadFileTool;
class WriteFileTool {
    workspaceService;
    workspaceAppService;
    id = 'write_file';
    description = 'Writes text content to a file in the workspace.';
    inputSchema = {
        type: 'object',
        properties: {
            filePath: { type: 'string', description: 'Path to write to' },
            content: { type: 'string', description: 'Complete file contents' }
        },
        required: ['filePath', 'content']
    };
    outputSchema = {
        type: 'object',
        properties: {
            success: { type: 'boolean' }
        }
    };
    constructor(workspaceService, workspaceAppService) {
        this.workspaceService = workspaceService;
        this.workspaceAppService = workspaceAppService;
    }
    async execute(input) {
        const fullPath = this.resolvePath(input.filePath);
        const root = this.workspaceService.getRootPath() || '';
        if (this.workspaceAppService && root) {
            await this.workspaceAppService.writeFile(root, fullPath, input.content);
            return { success: true };
        }
        await this.workspaceService.writeFile(fullPath, input.content);
        return { success: true };
    }
    resolvePath(p) {
        if (path.isAbsolute(p))
            return p;
        const root = this.workspaceService.getRootPath();
        if (!root)
            throw new Error('No workspace open to resolve relative path.');
        return path.join(root, p);
    }
}
exports.WriteFileTool = WriteFileTool;
class ListDirectoryTool {
    workspaceService;
    repositoryProvider;
    id = 'list_dir';
    description = 'Lists files and folders inside a workspace directory.';
    inputSchema = {
        type: 'object',
        properties: {
            folderPath: { type: 'string', description: 'Optional directory path' }
        }
    };
    outputSchema = {
        type: 'object',
        properties: {
            items: { type: 'array', items: { type: 'string' } }
        }
    };
    constructor(workspaceService, repositoryProvider) {
        this.workspaceService = workspaceService;
        this.repositoryProvider = repositoryProvider;
    }
    async execute(input) {
        const root = this.workspaceService.getRootPath();
        const target = input.folderPath
            ? (path.isAbsolute(input.folderPath) ? input.folderPath : path.join(root || '', input.folderPath))
            : root;
        if (!target)
            throw new Error('No target directory specified or active.');
        const result = await this.repositoryProvider.query({ type: 'findFile', query: '' });
        if (result.success && Array.isArray(result.data)) {
            const relativeTarget = path.relative(root || '', target);
            const items = result.data
                .map((f) => path.relative(target, f))
                .filter((f) => !f.startsWith('..') && f !== '')
                .map((f) => f.split(path.sep)[0]);
            return { items: Array.from(new Set(items)) };
        }
        return { items: [] };
    }
}
exports.ListDirectoryTool = ListDirectoryTool;
function formatRelativeFilePath(f, root) {
    if (!f)
        return '';
    if (path.isAbsolute(f)) {
        return root ? path.relative(root, f) : f;
    }
    return path.normalize(f);
}
class ListWorkspaceFilesTool {
    workspaceService;
    repositoryProvider;
    id = 'list_workspace_files';
    description = 'Lists all file paths present in the active workspace without text filtering.';
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'Optional search query' },
            limit: { type: 'number', description: 'Max number of files to return' }
        }
    };
    outputSchema = {
        type: 'object',
        properties: {
            files: { type: 'array', items: { type: 'string' } },
            total: { type: 'number' }
        }
    };
    constructor(workspaceService, repositoryProvider) {
        this.workspaceService = workspaceService;
        this.repositoryProvider = repositoryProvider;
    }
    async execute(input) {
        const startMs = Date.now();
        const root = this.workspaceService.getRootPath();
        const files = [];
        const res = await this.repositoryProvider.query({ type: 'findFile', query: '' });
        if (res.success && Array.isArray(res.data)) {
            for (const f of res.data) {
                const rel = formatRelativeFilePath(f, root);
                files.push(rel);
            }
        }
        let slice = files;
        if (input?.offset) {
            slice = slice.slice(input.offset);
        }
        if (input?.limit !== undefined) {
            slice = slice.slice(0, input.limit);
        }
        return {
            version: 1,
            success: true,
            goal: execution_goal_1.ExecutionGoal.FILE_LIST,
            kind: execution_result_kind_1.ExecutionResultKind.FILE_LIST,
            payload: {
                files: slice,
                total: files.length,
            },
            metadata: {
                toolId: this.id,
                durationMs: Date.now() - startMs,
                cached: false,
                source: 'repository_provider',
                timestamp: new Date().toISOString(),
            },
        };
    }
}
exports.ListWorkspaceFilesTool = ListWorkspaceFilesTool;
class SearchWorkspaceTool {
    workspaceService;
    repositoryProvider;
    id = 'search_workspace';
    description = 'Searches the active workspace files recursively based on query intent.';
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'String search query' },
            mode: { type: 'string', description: 'Search mode: symbol_lookup | text_search | file_search | workspace_statistics | list_workspace_files' },
            fileType: { type: 'string', description: 'File extensions filter, e.g. .ts,.tsx' },
            text: { type: 'string', description: 'Target text to search' },
            symbol: { type: 'string', description: 'Symbol name to lookup' }
        }
    };
    outputSchema = {
        type: 'object',
        properties: {
            results: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        filePath: { type: 'string' },
                        line: { type: 'number' },
                        text: { type: 'string' }
                    }
                }
            }
        }
    };
    constructor(workspaceService, repositoryProvider) {
        this.workspaceService = workspaceService;
        this.repositoryProvider = repositoryProvider;
    }
    async execute(input) {
        const startMs = Date.now();
        const root = this.workspaceService.getRootPath();
        const queryStr = input.query || '';
        const cleanQuery = queryStr.toLowerCase();
        // 1. Determine search mode
        let mode = input.mode;
        if (!mode) {
            if (cleanQuery.includes('how many files') ||
                cleanQuery.includes('workspace statistics') ||
                cleanQuery.includes('file count') ||
                cleanQuery.includes('workspace stats')) {
                mode = 'workspace_statistics';
            }
            else if (cleanQuery.includes('list files') ||
                cleanQuery.includes('list all files') ||
                cleanQuery.includes('list the files') ||
                cleanQuery.includes('show all files') ||
                cleanQuery.includes('show every file') ||
                cleanQuery.includes('give me their names') ||
                cleanQuery.includes('what files exist') ||
                cleanQuery === 'list workspace files') {
                mode = 'list_workspace_files';
            }
            else if (input.fileType ||
                cleanQuery.includes('typescript') ||
                cleanQuery.includes('.ts') ||
                cleanQuery.includes('.tsx') ||
                cleanQuery.includes('.json') ||
                cleanQuery.includes('.md') ||
                cleanQuery.includes('.js')) {
                mode = 'file_search';
            }
            else if (input.text || cleanQuery.includes('todo') || cleanQuery.startsWith('search ')) {
                mode = 'text_search';
            }
            else {
                mode = 'symbol_lookup';
            }
        }
        // 2. Route based on search mode
        if (mode === 'workspace_statistics') {
            const result = await this.repositoryProvider.query({ type: 'workspaceStatistics' });
            const stats = (result.success && result.data) ? result.data : { filesCount: 0, symbolsCount: 0, circularDependenciesCount: 0, languages: [], projects: [] };
            return {
                version: 1,
                success: true,
                goal: execution_goal_1.ExecutionGoal.WORKSPACE_STATISTICS,
                kind: execution_result_kind_1.ExecutionResultKind.WORKSPACE_STATS,
                payload: {
                    filesCount: stats.filesCount || 0,
                    symbolsCount: stats.symbolsCount || 0,
                    circularDependenciesCount: stats.circularDependenciesCount || 0,
                    languages: stats.languages || [],
                    projects: stats.projects || [],
                },
                metadata: {
                    toolId: this.id,
                    durationMs: Date.now() - startMs,
                    cached: false,
                    source: 'repository_provider',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        if (mode === 'list_workspace_files' || mode === 'file_list' || mode === 'workspace_file_list') {
            const lister = new ListWorkspaceFilesTool(this.workspaceService, this.repositoryProvider);
            return await lister.execute({ query: input.query });
        }
        if (mode === 'file_search') {
            const results = [];
            const fileType = input.fileType || (cleanQuery.includes('typescript') || cleanQuery.includes('.ts') ? '.ts,.tsx' : '');
            if (fileType.includes('.ts') || fileType.includes('typescript')) {
                const res = await this.repositoryProvider.query({ type: 'findFilesByLanguage', language: 'typescript' });
                if (res.success && Array.isArray(res.data)) {
                    for (const f of res.data) {
                        const rel = formatRelativeFilePath(f, root);
                        results.push({
                            filePath: rel,
                            line: 1,
                            text: `TypeScript file: ${rel}`
                        });
                    }
                }
            }
            if (results.length === 0) {
                const norm = file_query_normalizer_1.FileQueryNormalizer.normalize(input.query || '');
                const searchTerm = norm.basename || norm.relativePath || (input.query || '').replace(/list|all|files|search|find|name|give|display|open|them|those|how|many|count|are|there|in|this|project|workspace/gi, '').trim();
                const res = await this.repositoryProvider.query({ type: 'findFile', query: searchTerm });
                if (res.success && Array.isArray(res.data)) {
                    for (const f of res.data) {
                        const rel = formatRelativeFilePath(f, root);
                        results.push({
                            filePath: rel,
                            line: 1,
                            text: `Matched file: ${rel}`
                        });
                    }
                }
            }
            let finalResults = results;
            if (input.offset) {
                finalResults = finalResults.slice(input.offset);
            }
            if (input.limit !== undefined) {
                finalResults = finalResults.slice(0, input.limit);
            }
            return {
                version: 1,
                success: true,
                goal: execution_goal_1.ExecutionGoal.SEARCH,
                kind: execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS,
                payload: {
                    query: input.query || '',
                    results: finalResults,
                    totalMatches: results.length,
                },
                metadata: {
                    toolId: this.id,
                    durationMs: Date.now() - startMs,
                    cached: false,
                    source: 'repository_provider',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        if (mode === 'text_search') {
            const results = [];
            const searchText = input.text || input.query?.replace(/search|find|grep|for/gi, '').trim() || 'TODO';
            // 1. Symbol query
            const symRes = await this.repositoryProvider.query({ type: 'findSymbol', query: searchText });
            if (symRes.success && Array.isArray(symRes.data)) {
                for (const sym of symRes.data) {
                    const rel = formatRelativeFilePath(sym.file, root);
                    results.push({
                        filePath: rel,
                        line: sym.line,
                        text: `[${sym.kind}] ${sym.name}`
                    });
                }
            }
            // 2. Scan workspace files if available
            if (root && fs.existsSync(root)) {
                const scanFiles = async (dir) => {
                    if (results.length >= 50)
                        return;
                    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
                    for (const entry of entries) {
                        if (results.length >= 50)
                            break;
                        const fullPath = path.join(dir, entry.name);
                        if (['node_modules', '.git', 'dist', 'build', '.forge'].includes(entry.name))
                            continue;
                        if (entry.isDirectory()) {
                            await scanFiles(fullPath);
                        }
                        else if (entry.isFile()) {
                            try {
                                const content = await fs.promises.readFile(fullPath, 'utf8');
                                if (content.toLowerCase().includes(searchText.toLowerCase())) {
                                    const lines = content.split('\n');
                                    lines.forEach((lineText, lineIdx) => {
                                        if (lineText.toLowerCase().includes(searchText.toLowerCase()) && results.length < 50) {
                                            results.push({
                                                filePath: path.relative(root, fullPath),
                                                line: lineIdx + 1,
                                                text: lineText.trim()
                                            });
                                        }
                                    });
                                }
                            }
                            catch {
                                // Ignore unreadable files
                            }
                        }
                    }
                };
                try {
                    await scanFiles(root);
                }
                catch {
                    // Ignore scanning error
                }
            }
            // De-duplicate results
            const uniqueMap = new Map();
            for (const r of results) {
                const key = `${r.filePath}:${r.line}:${r.text}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, r);
                }
            }
            return {
                version: 1,
                success: true,
                goal: execution_goal_1.ExecutionGoal.SEARCH,
                kind: execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS,
                payload: {
                    query: searchText,
                    results: Array.from(uniqueMap.values()).slice(0, 50),
                },
                metadata: {
                    toolId: this.id,
                    durationMs: Date.now() - startMs,
                    cached: false,
                    source: 'repository_provider',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        // Default mode: symbol_lookup
        const targetSymbol = input.symbol || input.query || '';
        const result = await this.repositoryProvider.query({ type: 'findSymbol', query: targetSymbol });
        const symResults = (result.success && Array.isArray(result.data))
            ? result.data.map((sym) => ({
                filePath: root ? path.relative(root, sym.file) : sym.file,
                line: sym.line,
                text: `[${sym.kind}] ${sym.name}`
            })).slice(0, 50)
            : [];
        return {
            version: 1,
            success: true,
            goal: execution_goal_1.ExecutionGoal.SEARCH,
            kind: execution_result_kind_1.ExecutionResultKind.SEARCH_RESULTS,
            payload: {
                query: targetSymbol,
                results: symResults,
            },
            metadata: {
                toolId: this.id,
                durationMs: Date.now() - startMs,
                cached: false,
                source: 'repository_provider',
                timestamp: new Date().toISOString(),
            },
        };
    }
}
exports.SearchWorkspaceTool = SearchWorkspaceTool;
class RunTerminalCommandTool {
    terminalService;
    terminalAppService;
    workspaceService;
    id = 'run_terminal_command';
    description = 'Executes a command inside the active shell terminal panel.';
    inputSchema = {
        type: 'object',
        properties: {
            command: { type: 'string', description: 'Shell command text to run' }
        },
        required: ['command']
    };
    outputSchema = {
        type: 'object',
        properties: {
            pid: { type: 'number' }
        }
    };
    constructor(terminalService, terminalAppService, workspaceService) {
        this.terminalService = terminalService;
        this.terminalAppService = terminalAppService;
        this.workspaceService = workspaceService;
    }
    async execute(input) {
        const startMs = Date.now();
        let cmd = (input.command || 'pnpm test').trim();
        const clean = cmd.toLowerCase();
        // Sanitize natural language prompts passed to terminal tool
        if (clean.startsWith('run ') || clean === 'run' || clean === 'run tests' || clean === 'run test') {
            if (clean.includes('cargo'))
                cmd = 'cargo test';
            else if (clean.includes('pytest'))
                cmd = 'pytest';
            else if (clean.includes('go'))
                cmd = 'go test';
            else if (clean.includes('yarn'))
                cmd = 'yarn test';
            else if (clean.includes('npm'))
                cmd = 'npm test';
            else
                cmd = 'pnpm test';
        }
        const root = this.workspaceService?.getRootPath() || '';
        if (this.terminalAppService && root) {
            await this.terminalAppService.runCommand(root, cmd);
            return {
                version: 1,
                success: true,
                goal: execution_goal_1.ExecutionGoal.RUN_TERMINAL,
                kind: execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT,
                payload: { command: cmd, pid: 12345, stdout: `Executed command: ${cmd}` },
                metadata: {
                    toolId: this.id,
                    durationMs: Date.now() - startMs,
                    cached: false,
                    source: 'terminal_app_service',
                    timestamp: new Date().toISOString(),
                },
            };
        }
        await this.terminalService.create('t1');
        this.terminalService.write('t1', `${cmd}\r`);
        return {
            version: 1,
            success: true,
            goal: execution_goal_1.ExecutionGoal.RUN_TERMINAL,
            kind: execution_result_kind_1.ExecutionResultKind.TERMINAL_OUTPUT,
            payload: { command: cmd, pid: 12345, stdout: `Executed command: ${cmd}` },
            metadata: {
                toolId: this.id,
                durationMs: Date.now() - startMs,
                cached: false,
                source: 'terminal_service',
                timestamp: new Date().toISOString(),
            },
        };
    }
}
exports.RunTerminalCommandTool = RunTerminalCommandTool;
class OpenFileTool {
    eventBus;
    workspaceService;
    id = 'open_file';
    description = 'Opens a file tab in the Monaco editor.';
    inputSchema = {
        type: 'object',
        properties: {
            filePath: { type: 'string', description: 'Relative path to open' }
        },
        required: ['filePath']
    };
    outputSchema = {
        type: 'object',
        properties: {
            success: { type: 'boolean' }
        }
    };
    constructor(eventBus, workspaceService) {
        this.eventBus = eventBus;
        this.workspaceService = workspaceService;
    }
    async execute(input) {
        const root = this.workspaceService.getRootPath() || '';
        const fullPath = path.isAbsolute(input.filePath) ? input.filePath : path.join(root, input.filePath);
        if (!fs.existsSync(fullPath)) {
            return { success: false, error: `File does not exist: ${input.filePath}` };
        }
        try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                return { success: false, error: `Path is a directory, cannot open file tab: ${input.filePath}` };
            }
        }
        catch (err) {
            return { success: false, error: `Cannot access path: ${err?.message || String(err)}` };
        }
        console.log('[AI OPEN] emitting', fullPath);
        this.eventBus.emit('ai:execute-command', {
            commandId: 'forge.workspace.openFile',
            args: [fullPath]
        });
        return { success: true };
    }
}
exports.OpenFileTool = OpenFileTool;
class ToggleTerminalTool {
    eventBus;
    id = 'toggle_terminal';
    description = 'Toggles the visibility of the bottom terminal panel.';
    inputSchema = { type: 'object', properties: {} };
    outputSchema = {
        type: 'object',
        properties: {
            success: { type: 'boolean' }
        }
    };
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    async execute() {
        this.eventBus.emit('ai:execute-command', {
            commandId: 'forge.view.toggleTerminal',
            args: []
        });
        return { success: true };
    }
}
exports.ToggleTerminalTool = ToggleTerminalTool;
/**
 * NoOpTool — explicitly planned no-operation for reasoning/reflection steps.
 *
 * This tool is ONLY valid when the planner INTENTIONALLY selects it for a
 * step that produces an LLM response without touching the filesystem. Examples:
 *
 *   - "Think about the architecture"
 *   - "Reflect on the current plan"
 *   - "Summarize findings before writing code"
 *
 * This tool must NEVER be used as a fallback for tasks with missing toolCalls.
 * The ExecutionGraphEngine now throws a PlanningError for those cases so the
 * UI can surface the planner defect rather than silently succeeding.
 */
class NoOpTool {
    id = 'noop';
    description = 'Explicitly planned no-operation for analysis/reasoning steps that produce ' +
        'LLM output without invoking a filesystem or shell tool.';
    inputSchema = { type: 'object', properties: {} };
    outputSchema = {
        type: 'object',
        properties: { success: { type: 'boolean' } },
    };
    async execute() {
        return { success: true };
    }
}
exports.NoOpTool = NoOpTool;
//# sourceMappingURL=built-in-tools.js.map