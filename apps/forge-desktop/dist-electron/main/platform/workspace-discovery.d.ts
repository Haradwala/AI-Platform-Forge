export interface IProjectMetadata {
    name: string;
    path: string;
    type: string;
    packageManager: string;
    frameworks: string[];
}
export interface IWorkspaceManifest {
    name: string;
    rootPath: string;
    projects: IProjectMetadata[];
    languages: string[];
    filesCount: number;
}
export declare class WorkspaceDiscoveryService {
    discover(rootPath: string): Promise<IWorkspaceManifest>;
    private detectLanguage;
}
