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

export interface IWorkspaceFile {
  readonly name: string;
  readonly relativePath: string;
  readonly absolutePath: string;
  readonly extension: string;
  readonly size: number;
  readonly lastModified: Date;
  readonly isDirectory: boolean;
}

export class WorkspaceFile implements IWorkspaceFile {
  constructor(
    public readonly name: string,
    public readonly relativePath: string,
    public readonly absolutePath: string,
    public readonly extension: string,
    public readonly size: number,
    public readonly lastModified: Date,
    public readonly isDirectory: boolean
  ) {}
}
