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
    description = 'Searches the active workspace files recursively for text matches.';
    inputSchema = {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'String search term' }
        },
        required: ['query']
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
        if (!root)
            return { results: [] };
        const result = await this.repositoryProvider.query({ type: 'findSymbol', query: input.query });
        if (result.success && Array.isArray(result.data)) {
            const results = result.data.map((sym) => ({
                filePath: path.relative(root, sym.file),
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