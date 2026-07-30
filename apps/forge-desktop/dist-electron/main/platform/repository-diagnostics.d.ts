import { IWorkspaceManifest } from './workspace-discovery';
import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';
export declare class RepositoryDiagnosticsService {
    writeDiagnostics(rootPath: string, manifest: IWorkspaceManifest, symbols: SymbolIndexService, graph: DependencyGraphService): void;
}
