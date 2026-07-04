import { IWorkspaceFile } from '@forge/shared';

export interface IWorkspaceSession {
  readonly id: string;
  readonly path: string;
  readonly status: 'opening' | 'scanning' | 'ready' | 'closed';
  
  getFilesList(): IWorkspaceFile[];
  isIgnored(relativePath: string): boolean;
  dispose(): Promise<void>;
}

export interface IWorkspaceManager {
  openWorkspace(path: string): Promise<IWorkspaceSession>;
  closeWorkspace(workspaceId: string): Promise<void>;
  getActiveSession(): IWorkspaceSession | undefined;
}
