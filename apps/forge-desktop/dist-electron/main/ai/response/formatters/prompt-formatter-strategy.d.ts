/**
 * prompt-formatter-strategy.ts
 *
 * Strategy implementations converting KnowledgeFact domain objects into
 * structured, prioritized PromptSection objects.
 */
import type { KnowledgeFact, PromptSection, WorkspaceStatisticsFact, RepositoryFileListFact, WorkspaceSearchFact, FileContentFact, TerminalFact, GitDiffFact, ErrorTraceFact } from '../response-types';
import { ContextCompressor } from '../../context/context-compressor';
export interface IPromptFactFormatter<T extends KnowledgeFact = any> {
    readonly factKind: string;
    format(fact: T, goal?: string): PromptSection;
}
export declare class WorkspaceStatisticsFormatter implements IPromptFactFormatter<WorkspaceStatisticsFact> {
    readonly factKind = "workspace_statistics";
    format(fact: WorkspaceStatisticsFact): PromptSection;
}
export declare class FileListFormatter implements IPromptFactFormatter<RepositoryFileListFact> {
    readonly factKind = "file_list";
    format(fact: RepositoryFileListFact): PromptSection;
}
export declare class WorkspaceSearchFormatter implements IPromptFactFormatter<WorkspaceSearchFact> {
    readonly factKind = "workspace_search";
    format(fact: WorkspaceSearchFact): PromptSection;
}
export declare class FileContentFormatter implements IPromptFactFormatter<FileContentFact> {
    private readonly compressor;
    readonly factKind = "file_content";
    constructor(compressor?: ContextCompressor);
    format(fact: FileContentFact, goal?: string): PromptSection;
}
export declare class TerminalOutputFormatter implements IPromptFactFormatter<TerminalFact> {
    readonly factKind = "terminal_output";
    format(fact: TerminalFact): PromptSection;
}
export declare class GitDiffFormatter implements IPromptFactFormatter<GitDiffFact> {
    readonly factKind = "git_diff";
    format(fact: GitDiffFact): PromptSection;
}
export declare class ErrorTraceFormatter implements IPromptFactFormatter<ErrorTraceFact> {
    readonly factKind = "error_trace";
    format(fact: ErrorTraceFact): PromptSection;
}
