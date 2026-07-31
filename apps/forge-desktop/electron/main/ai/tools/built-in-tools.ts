import type { ITool, IWorkspaceService, ITerminalService, IDesktopEventBus, IRepositoryProvider, IWorkspaceApplicationService, ITerminalApplicationService } from '../../container/service-interfaces';
import * as fs from 'fs';
import * as path from 'path';

export class ReadFileTool implements ITool<{ filePath: string }, { content: string }> {
  readonly id = 'read_file';
  readonly description = 'Reads the content of a file from the workspace.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      filePath: { type: 'string', description: 'Absolute path or relative path to the workspace root' }
    },
    required: ['filePath']
  };
  readonly outputSchema = {
    type: 'object',
    properties: {
      content: { type: 'string' }
    }
  };

  constructor(private readonly workspaceService: IWorkspaceService) {}

  async execute(input: { filePath: string }): Promise<{ content: string }> {
    const fullPath = this.resolvePath(input.filePath);
    const content = await this.workspaceService.readFile(fullPath);
    return { content };
  }

  private resolvePath(p: string): string {
    if (path.isAbsolute(p)) return p;
    const root = this.workspaceService.getRootPath();
    if (!root) throw new Error('No workspace open to resolve relative path.');
    return path.join(root, p);
  }
}

export class WriteFileTool implements ITool<{ filePath: string, content: string }, { success: boolean }> {
  readonly id = 'write_file';
  readonly description = 'Writes text content to a file in the workspace.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      filePath: { type: 'string', description: 'Path to write to' },
      content: { type: 'string', description: 'Complete file contents' }
    },
    required: ['filePath', 'content']
  };
  readonly outputSchema = {
    type: 'object',
    properties: {
      success: { type: 'boolean' }
    }
  };

  constructor(
    private readonly workspaceService: IWorkspaceService,
    private readonly workspaceAppService?: IWorkspaceApplicationService
  ) {}

  async execute(input: { filePath: string, content: string }): Promise<{ success: boolean }> {
    const fullPath = this.resolvePath(input.filePath);
    const root = this.workspaceService.getRootPath() || '';
    if (this.workspaceAppService && root) {
      await this.workspaceAppService.writeFile(root, fullPath, input.content);
      return { success: true };
    }
    await this.workspaceService.writeFile(fullPath, input.content);
    return { success: true };
  }

  private resolvePath(p: string): string {
    if (path.isAbsolute(p)) return p;
    const root = this.workspaceService.getRootPath();
    if (!root) throw new Error('No workspace open to resolve relative path.');
    return path.join(root, p);
  }
}

export class ListDirectoryTool implements ITool<{ folderPath?: string }, { items: string[] }> {
  readonly id = 'list_dir';
  readonly description = 'Lists files and folders inside a workspace directory.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      folderPath: { type: 'string', description: 'Optional directory path' }
    }
  };
  readonly outputSchema = {
    type: 'object',
    properties: {
      items: { type: 'array', items: { type: 'string' } }
    }
  };

  constructor(
    private readonly workspaceService: IWorkspaceService,
    private readonly repositoryProvider: IRepositoryProvider
  ) {}

  async execute(input: { folderPath?: string }): Promise<{ items: string[] }> {
    const root = this.workspaceService.getRootPath();
    const target = input.folderPath 
      ? (path.isAbsolute(input.folderPath) ? input.folderPath : path.join(root || '', input.folderPath))
      : root;

    if (!target) throw new Error('No target directory specified or active.');

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

export class SearchWorkspaceTool implements ITool<{ query?: string; mode?: string; fileType?: string; text?: string; symbol?: string }, { results: Array<{ filePath: string; line?: number; text: string }>; stats?: any }> {
  readonly id = 'search_workspace';
  readonly description = 'Searches the active workspace files recursively based on query intent.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'String search query' },
      mode: { type: 'string', description: 'Search mode: symbol_lookup | text_search | file_search | workspace_statistics' },
      fileType: { type: 'string', description: 'File extensions filter, e.g. .ts,.tsx' },
      text: { type: 'string', description: 'Target text to search' },
      symbol: { type: 'string', description: 'Symbol name to lookup' }
    }
  };
  readonly outputSchema = {
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

  constructor(
    private readonly workspaceService: IWorkspaceService,
    private readonly repositoryProvider: IRepositoryProvider
  ) {}

  async execute(input: { query?: string; mode?: string; fileType?: string; text?: string; symbol?: string }): Promise<{ results: Array<{ filePath: string; line?: number; text: string }>; stats?: any }> {
    const root = this.workspaceService.getRootPath();
    const queryStr = input.query || '';
    const cleanQuery = queryStr.toLowerCase();

    // 1. Determine search mode
    let mode = input.mode;
    if (!mode) {
      if (
        cleanQuery.includes('how many files') ||
        cleanQuery.includes('workspace statistics') ||
        cleanQuery.includes('file count') ||
        cleanQuery.includes('workspace stats')
      ) {
        mode = 'workspace_statistics';
      } else if (input.fileType || cleanQuery.includes('typescript') || cleanQuery.includes('.ts') || cleanQuery.includes('file')) {
        mode = 'file_search';
      } else if (input.text || cleanQuery.includes('todo') || cleanQuery.startsWith('search ')) {
        mode = 'text_search';
      } else {
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
      const results: Array<{ filePath: string; line: number; text: string }> = [];
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
      const results: Array<{ filePath: string; line: number; text: string }> = [];
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
        const scanFiles = async (dir: string) => {
          if (results.length >= 50) return;
          const entries = await fs.promises.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (results.length >= 50) break;
            const fullPath = path.join(dir, entry.name);
            if (['node_modules', '.git', 'dist', 'build', '.forge'].includes(entry.name)) continue;

            if (entry.isDirectory()) {
              await scanFiles(fullPath);
            } else if (entry.isFile()) {
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
              } catch {
                // Ignore unreadable files
              }
            }
          }
        };

        try {
          await scanFiles(root);
        } catch {
          // Ignore scanning error
        }
      }

      // De-duplicate results
      const uniqueMap = new Map<string, { filePath: string; line: number; text: string }>();
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
      const results = result.data.map((sym: any) => ({
        filePath: root ? path.relative(root, sym.file) : sym.file,
        line: sym.line,
        text: `[${sym.kind}] ${sym.name}`
      }));
      return { results: results.slice(0, 50) };
    }

    return { results: [] };
  }
}

export class RunTerminalCommandTool implements ITool<{ command: string }, { pid: number }> {
  readonly id = 'run_terminal_command';
  readonly description = 'Executes a command inside the active shell terminal panel.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      command: { type: 'string', description: 'Shell command text to run' }
    },
    required: ['command']
  };
  readonly outputSchema = {
    type: 'object',
    properties: {
      pid: { type: 'number' }
    }
  };

  constructor(
    private readonly terminalService: ITerminalService,
    private readonly terminalAppService?: ITerminalApplicationService,
    private readonly workspaceService?: IWorkspaceService
  ) {}

  async execute(input: { command: string }): Promise<{ pid: number }> {
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

export class OpenFileTool implements ITool<{ filePath: string }, { success: boolean }> {
  readonly id = 'open_file';
  readonly description = 'Opens a file tab in the Monaco editor.';
  readonly inputSchema = {
    type: 'object',
    properties: {
      filePath: { type: 'string', description: 'Relative path to open' }
    },
    required: ['filePath']
  };
  readonly outputSchema = {
    type: 'object',
    properties: {
      success: { type: 'boolean' }
    }
  };

  constructor(
    private readonly eventBus: IDesktopEventBus,
    private readonly workspaceService: IWorkspaceService
  ) {}

  async execute(input: { filePath: string }): Promise<{ success: boolean }> {
    const root = this.workspaceService.getRootPath() || '';
    const fullPath = path.isAbsolute(input.filePath) ? input.filePath : path.join(root, input.filePath);
    
    this.eventBus.emit('ai:execute-command', {
      commandId: 'forge.workspace.openFile',
      args: [fullPath]
    });
    return { success: true };
  }
}

export class ToggleTerminalTool implements ITool<{}, { success: boolean }> {
  readonly id = 'toggle_terminal';
  readonly description = 'Toggles the visibility of the bottom terminal panel.';
  readonly inputSchema = { type: 'object', properties: {} };
  readonly outputSchema = {
    type: 'object',
    properties: {
      success: { type: 'boolean' }
    }
  };

  constructor(private readonly eventBus: IDesktopEventBus) {}

  async execute(): Promise<{ success: boolean }> {
    this.eventBus.emit('ai:execute-command', {
      commandId: 'forge.view.toggleTerminal',
      args: []
    });
    return { success: true };
  }
}

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
export class NoOpTool implements ITool<Record<string, never>, { success: true }> {
  readonly id = 'noop';
  readonly description =
    'Explicitly planned no-operation for analysis/reasoning steps that produce ' +
    'LLM output without invoking a filesystem or shell tool.';
  readonly inputSchema = { type: 'object', properties: {} };
  readonly outputSchema = {
    type: 'object',
    properties: { success: { type: 'boolean' } },
  };

  async execute(): Promise<{ success: true }> {
    return { success: true };
  }
}
