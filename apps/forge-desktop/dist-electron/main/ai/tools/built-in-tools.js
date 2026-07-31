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
exports.NoOpTool = exports.ToggleTerminalTool = exports.OpenFileTool = exports.RunTerminalCommandTool = exports.SearchWorkspaceTool = exports.ListDirectoryTool = exports.WriteFileTool = exports.ReadFileTool = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
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
        const fullPath = this.resolvePath(input.filePath);
        const content = await this.workspaceService.readFile(fullPath);
        return { content };
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
class SearchWorkspaceTool {
    workspaceService;
    repositoryProvider;
    id = 'search_workspace';
    description = 'Searches the active workspace files recursively based on query intent.';
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'String search query' },
            mode: { type: 'string', description: 'Search mode: symbol_lookup | text_search | file_search | workspace_statistics' },
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
            else if (input.fileType || cleanQuery.includes('typescript') || cleanQuery.includes('.ts') || cleanQuery.includes('file')) {
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
            if (result.success && result.data) {
                const stats = result.data;
                const textSummary = `Total Workspace Files: ${stats.filesCount || 0}, Total Symbols: ${stats.symbolsCount || 0}, Languages: ${(stats.languages || []).join(', ') || 'N/A'}`;
                return {
                    results: [
                        {
                            filePath: 'workspace',
                            line: 1,
                            text: textSummary
                        }
                    ],
                    stats
                };
            }
            return { results: [] };
        }
        if (mode === 'file_search') {
            const results = [];
            const fileType = input.fileType || (cleanQuery.includes('typescript') || cleanQuery.includes('.ts') ? '.ts,.tsx' : '');
            if (fileType.includes('.ts') || fileType.includes('typescript')) {
                const res = await this.repositoryProvider.query({ type: 'findFilesByLanguage', language: 'typescript' });
                if (res.success && Array.isArray(res.data)) {
                    for (const f of res.data) {
                        results.push({
                            filePath: root ? path.relative(root, f) : f,
                            line: 1,
                            text: `TypeScript file: ${root ? path.relative(root, f) : f}`
                        });
                    }
                }
            }
            if (results.length === 0) {
                const searchTerm = (input.query || '').replace(/list|all|files|search|find/gi, '').trim();
                const res = await this.repositoryProvider.query({ type: 'findFile', query: searchTerm });
                if (res.success && Array.isArray(res.data)) {
                    for (const f of res.data) {
                        results.push({
                            filePath: root ? path.relative(root, f) : f,
                            line: 1,
                            text: `Matched file: ${root ? path.relative(root, f) : f}`
                        });
                    }
                }
            }
            return { results: results.slice(0, 50) };
        }
        if (mode === 'text_search') {
            const results = [];
            const searchText = input.text || input.query?.replace(/search|find|grep|for/gi, '').trim() || 'TODO';
            // 1. Symbol query
            const symRes = await this.repositoryProvider.query({ type: 'findSymbol', query: searchText });
            if (symRes.success && Array.isArray(symRes.data)) {
                for (const sym of symRes.data) {
                    results.push({
                        filePath: root ? path.relative(root, sym.file) : sym.file,
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
            return { results: Array.from(uniqueMap.values()).slice(0, 50) };
        }
        // Default mode: symbol_lookup
        const targetSymbol = input.symbol || input.query || '';
        const result = await this.repositoryProvider.query({ type: 'findSymbol', query: targetSymbol });
        if (result.success && Array.isArray(result.data)) {
            const results = result.data.map((sym) => ({
                filePath: root ? path.relative(root, sym.file) : sym.file,
                line: sym.line,
                text: `[${sym.kind}] ${sym.name}`
            }));
            return { results: results.slice(0, 50) };
        }
        return { results: [] };
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
        const root = this.workspaceService?.getRootPath() || '';
        if (this.terminalAppService && root) {
            await this.terminalAppService.runCommand(root, input.command);
            return { pid: 12345 };
        }
        await this.terminalService.create('t1');
        this.terminalService.write('t1', `${input.command}\r`);
        return { pid: 12345 };
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