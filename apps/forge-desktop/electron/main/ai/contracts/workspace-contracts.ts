/**
 * workspace-contracts.ts — Granular Tool Return Payload Contracts
 */

export interface IWorkspaceFileListResult {
  readonly files: string[];
  readonly total: number;
}

export interface IWorkspaceStatisticsResult {
  readonly filesCount: number;
  readonly symbolsCount: number;
  readonly circularDependenciesCount: number;
  readonly languages: string[];
  readonly projects: string[];
}

export interface IFileContentResult {
  readonly filePath: string;
  readonly content: string;
}

export interface ISearchResultsResult {
  readonly query: string;
  readonly results: Array<{ filePath: string; line: number; text: string }>;
}

export interface ITerminalCommandResult {
  readonly command: string;
  readonly pid: number;
  readonly stdout?: string;
}
