export enum WorkspaceStatus {
  UNINDEXED = 'UNINDEXED',
  INDEXING = 'INDEXING',
  INDEXED = 'INDEXED',
  ERROR = 'ERROR',
}

export interface IWorkspaceSettings {
  excludedPaths: string[];
  targetPythonVenv?: string;
  llmModelProfile: string;
}

export interface IWorkspaceMetadata {
  createdAt: Date;
  lastOpenedAt: Date;
  sizeInBytes?: number;
}

export interface IWorkspace {
  readonly id: string;
  readonly path: string;
  readonly name: string;
  status: WorkspaceStatus;
  settings: IWorkspaceSettings;
  metadata: IWorkspaceMetadata;
  
  validate(): boolean;
}

export class Workspace implements IWorkspace {
  readonly id: string;
  readonly path: string;
  readonly name: string;
  public status: WorkspaceStatus;
  public settings: IWorkspaceSettings;
  public metadata: IWorkspaceMetadata;

  constructor(
    id: string,
    path: string,
    name: string,
    status: WorkspaceStatus = WorkspaceStatus.UNINDEXED,
    settings: IWorkspaceSettings = { excludedPaths: [], llmModelProfile: 'default' },
    metadata: IWorkspaceMetadata = { createdAt: new Date(), lastOpenedAt: new Date() }
  ) {
    this.id = id;
    this.path = path;
    this.name = name;
    this.status = status;
    this.settings = settings;
    this.metadata = metadata;
  }

  validate(): boolean {
    if (!this.id || typeof this.id !== 'string') return false;
    if (!this.path || typeof this.path !== 'string') return false;
    if (!this.name || typeof this.name !== 'string') return false;
    if (!this.settings || !Array.isArray(this.settings.excludedPaths)) return false;
    return true;
  }
}
