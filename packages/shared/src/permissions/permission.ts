export enum Permission {
  FilesystemRead = 'filesystem.read',
  FilesystemWrite = 'filesystem.write',
  TerminalExecute = 'terminal.execute',
  Network = 'network',
  AI = 'ai',
  WorkspaceSearch = 'workspace.search',
  WorkspaceModify = 'workspace.modify',
  SettingsRead = 'settings.read',
  SettingsWrite = 'settings.write',
  GitRead = 'git.read',
  GitWrite = 'git.write'
}

export type TrustLevel = 'Trusted' | 'Verified' | 'Marketplace' | 'Internal' | 'Development';
