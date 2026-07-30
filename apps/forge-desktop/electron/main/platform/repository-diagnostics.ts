import * as fs from 'fs';
import * as path from 'path';
import { IWorkspaceManifest } from './workspace-discovery';
import { SymbolIndexService } from './symbol-index';
import { DependencyGraphService } from './dependency-graph';

export class RepositoryDiagnosticsService {
  writeDiagnostics(
    rootPath: string,
    manifest: IWorkspaceManifest,
    symbols: SymbolIndexService,
    graph: DependencyGraphService
  ): void {
    const repoDir = path.join(rootPath, '.forge', 'repository');
    try {
      if (!fs.existsSync(repoDir)) {
        fs.mkdirSync(repoDir, { recursive: true });
      }

      fs.writeFileSync(path.join(repoDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
      fs.writeFileSync(path.join(repoDir, 'languages.json'), JSON.stringify(manifest.languages, null, 2));
      fs.writeFileSync(path.join(repoDir, 'projects.json'), JSON.stringify(manifest.projects, null, 2));

      const symData = symbols.getAll().map((s) => ({
        id: s.id,
        name: s.name,
        kind: s.kind,
        file: s.file,
        line: s.line,
        parent: s.parent,
      }));
      fs.writeFileSync(path.join(repoDir, 'symbols.json'), JSON.stringify(symData, null, 2));

      const graphData: Record<string, string[]> = {};
      for (const sym of symbols.getAll()) {
        graphData[sym.file] = graph.getImports(sym.file);
      }
      fs.writeFileSync(path.join(repoDir, 'graph.json'), JSON.stringify(graphData, null, 2));
      fs.writeFileSync(path.join(repoDir, 'dependencies.json'), JSON.stringify(graphData, null, 2));

      const stats = {
        filesCount: manifest.filesCount,
        symbolsCount: symbols.getAll().length,
        circularDependenciesCount: graph.findCircularDependencies().length,
      };
      fs.writeFileSync(path.join(repoDir, 'statistics.json'), JSON.stringify(stats, null, 2));

      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      };
      fs.writeFileSync(path.join(repoDir, 'health.json'), JSON.stringify(health, null, 2));
    } catch (err) {
      console.error('[RepositoryDiagnosticsService] Failed to export diagnostics:', err);
    }
  }
}
