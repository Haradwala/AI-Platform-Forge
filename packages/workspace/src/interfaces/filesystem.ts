import { IWorkspaceFile } from '@forge/shared';

export interface IIgnoreRuleManager {
  addPatterns(patterns: string[]): void;
  loadGitignore(workspacePath: string): Promise<void>;
  isIgnored(relativePath: string): boolean;
}

export interface IWorkspaceScanner {
  scan(rootPath: string, ignore: IIgnoreRuleManager): AsyncGenerator<IWorkspaceFile, void, unknown>;
}

export interface IFileWatcher {
  startWatching(rootPath: string, ignore: IIgnoreRuleManager): void;
  stopWatching(): Promise<void>;
}
