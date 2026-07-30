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
export type ContextSourceType = 'user_goal' | 'active_editor' | 'open_tabs' | 'workspace_files' | 'diagnostics' | 'terminal_output' | 'git_diff' | 'conversation' | 'memory' | 'symbols';
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
    workspaceFiles?: Array<{
        path: string;
        content: string;
    }>;
    diagnostics?: Array<{
        file: string;
        message: string;
        severity: string;
    }>;
    terminalOutput?: string;
    gitDiff?: string;
    conversationHistory?: Array<{
        role: string;
        content: string;
    }>;
    memoryFacts?: string[];
    symbols?: Array<{
        name: string;
        kind: string;
        filePath: string;
    }>;
    signal?: AbortSignal;
}
export interface IContextSource {
    readonly sourceType: ContextSourceType;
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class UserGoalSource implements IContextSource {
    readonly sourceType = "user_goal";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class ActiveEditorSource implements IContextSource {
    readonly sourceType = "active_editor";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class OpenTabsSource implements IContextSource {
    readonly sourceType = "open_tabs";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class WorkspaceFilesSource implements IContextSource {
    readonly sourceType = "workspace_files";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class DiagnosticsSource implements IContextSource {
    readonly sourceType = "diagnostics";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class TerminalOutputSource implements IContextSource {
    readonly sourceType = "terminal_output";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class GitDiffSource implements IContextSource {
    readonly sourceType = "git_diff";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class ConversationSource implements IContextSource {
    readonly sourceType = "conversation";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class MemorySource implements IContextSource {
    readonly sourceType = "memory";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
export declare class SymbolsSource implements IContextSource {
    readonly sourceType = "symbols";
    gather(options: GatherOptions): Promise<RawContextItem[]>;
}
/** Returns default instances of all 10 context sources. */
export declare function getAllContextSources(): IContextSource[];
