import { IContextItem } from './context-package';
import { IWorkspaceService, IRepositoryProvider } from '../../container/service-interfaces';
export interface IContextCollector {
    readonly id: string;
    collect(): Promise<IContextItem[]> | IContextItem[];
}
export declare class WorkspaceCollector implements IContextCollector {
    private readonly workspaceService;
    readonly id = "WorkspaceCollector";
    constructor(workspaceService: IWorkspaceService);
    collect(): Promise<IContextItem[]>;
}
export declare class RepositoryCollector implements IContextCollector {
    private readonly repositoryProvider;
    readonly id = "RepositoryCollector";
    constructor(repositoryProvider: IRepositoryProvider);
    collect(): Promise<IContextItem[]>;
}
export declare class EditorCollector implements IContextCollector {
    readonly id = "EditorCollector";
    collect(): IContextItem[];
}
export declare class GitCollector implements IContextCollector {
    readonly id = "GitCollector";
    collect(): IContextItem[];
}
export declare class DiagnosticsCollector implements IContextCollector {
    readonly id = "DiagnosticsCollector";
    collect(): IContextItem[];
}
export declare class TerminalCollector implements IContextCollector {
    readonly id = "TerminalCollector";
    collect(): IContextItem[];
}
export declare class RuntimeCollector implements IContextCollector {
    readonly id = "RuntimeCollector";
    collect(): IContextItem[];
}
export declare class LayoutCollector implements IContextCollector {
    readonly id = "LayoutCollector";
    collect(): IContextItem[];
}
export declare class AIStateCollector implements IContextCollector {
    readonly id = "AIStateCollector";
    collect(): IContextItem[];
}
