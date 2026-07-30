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

export type ContextSourceType =
  | 'user_goal'
  | 'active_editor'
  | 'open_tabs'
  | 'workspace_files'
  | 'diagnostics'
  | 'terminal_output'
  | 'git_diff'
  | 'conversation'
  | 'memory'
  | 'symbols';

export interface RawContextItem {
  id: string;
  source: ContextSourceType;
  content: string;
  path?: string;
  recency?: number;
  metadata?: Record<string, any>;
}

export interface GatherOptions {
  userGoal: string;
  activeFilePath?: string | null;
  openFilePaths?: string[];
  selectionText?: string;
  workspaceFiles?: Array<{ path: string; content: string }>;
  diagnostics?: Array<{ file: string; message: string; severity: string }>;
  terminalOutput?: string;
  gitDiff?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  memoryFacts?: string[];
  symbols?: Array<{ name: string; kind: string; filePath: string }>;
  signal?: AbortSignal;
}

export interface IContextSource {
  readonly sourceType: ContextSourceType;
  gather(options: GatherOptions): Promise<RawContextItem[]>;
}

// ─── Concrete Implementations ─────────────────────────────────────────────────

export class UserGoalSource implements IContextSource {
  readonly sourceType = 'user_goal';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.userGoal) return [];
    return [{
      id: 'src:user_goal',
      source: 'user_goal',
      content: options.userGoal,
      recency: Date.now(),
    }];
  }
}

export class ActiveEditorSource implements IContextSource {
  readonly sourceType = 'active_editor';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.activeFilePath) return [];
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

export class OpenTabsSource implements IContextSource {
  readonly sourceType = 'open_tabs';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.openFilePaths || options.openFilePaths.length === 0) return [];
    return options.openFilePaths.map((p) => ({
      id: `src:open_tab:${p}`,
      source: 'open_tabs',
      path: p,
      content: `Open Tab: ${p}`,
      recency: Date.now() - 100,
    }));
  }
}

export class WorkspaceFilesSource implements IContextSource {
  readonly sourceType = 'workspace_files';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.workspaceFiles || options.workspaceFiles.length === 0) return [];
    return options.workspaceFiles.map((f) => ({
      id: `src:workspace_file:${f.path}`,
      source: 'workspace_files',
      path: f.path,
      content: f.content,
      recency: Date.now() - 500,
    }));
  }
}

export class DiagnosticsSource implements IContextSource {
  readonly sourceType = 'diagnostics';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.diagnostics || options.diagnostics.length === 0) return [];
    return options.diagnostics.map((d, idx) => ({
      id: `src:diagnostic:${d.file}:${idx}`,
      source: 'diagnostics',
      path: d.file,
      content: `[${d.severity.toUpperCase()}] ${d.file}: ${d.message}`,
      recency: Date.now(),
    }));
  }
}

export class TerminalOutputSource implements IContextSource {
  readonly sourceType = 'terminal_output';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.terminalOutput) return [];
    return [{
      id: 'src:terminal_output',
      source: 'terminal_output',
      content: options.terminalOutput,
      recency: Date.now() - 50,
    }];
  }
}

export class GitDiffSource implements IContextSource {
  readonly sourceType = 'git_diff';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.gitDiff) return [];
    return [{
      id: 'src:git_diff',
      source: 'git_diff',
      content: options.gitDiff,
      recency: Date.now() - 200,
    }];
  }
}

export class ConversationSource implements IContextSource {
  readonly sourceType = 'conversation';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.conversationHistory || options.conversationHistory.length === 0) return [];
    return options.conversationHistory.map((c, idx) => ({
      id: `src:conversation:${idx}`,
      source: 'conversation',
      content: `${c.role}: ${c.content}`,
      recency: Date.now() - (options.conversationHistory!.length - idx) * 1000,
    }));
  }
}

export class MemorySource implements IContextSource {
  readonly sourceType = 'memory';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.memoryFacts || options.memoryFacts.length === 0) return [];
    return options.memoryFacts.map((fact, idx) => ({
      id: `src:memory:${idx}`,
      source: 'memory',
      content: `Fact: ${fact}`,
      recency: Date.now() - 2000,
    }));
  }
}

export class SymbolsSource implements IContextSource {
  readonly sourceType = 'symbols';
  async gather(options: GatherOptions): Promise<RawContextItem[]> {
    if (!options.symbols || options.symbols.length === 0) return [];
    return options.symbols.map((sym, idx) => ({
      id: `src:symbol:${sym.filePath}:${sym.name}:${idx}`,
      source: 'symbols',
      path: sym.filePath,
      content: `Symbol [${sym.kind}] ${sym.name} in ${sym.filePath}`,
      recency: Date.now(),
    }));
  }
}

/** Returns default instances of all 10 context sources. */
export function getAllContextSources(): IContextSource[] {
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
