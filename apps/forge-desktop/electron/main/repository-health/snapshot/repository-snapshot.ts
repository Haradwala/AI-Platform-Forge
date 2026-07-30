import { RepositorySnapshot } from '../contracts/health-types';
import { WorkspaceScanner } from './workspace-scanner';
import { MetadataCollector } from './metadata-collector';
import { ASTBuilder } from './ast-builder';
import { DependencyBuilder } from './dependency-builder';

export class SnapshotBuilder {
  private scanner = new WorkspaceScanner();
  private metadataCollector = new MetadataCollector();
  private astBuilder = new ASTBuilder();
  private dependencyBuilder = new DependencyBuilder();

  async buildSnapshot(rootPath: string): Promise<RepositorySnapshot> {
    const startTime = Date.now();
    const scanId = `snap-${startTime}`;

    // Stage 1: Workspace Scanner
    const relPaths = await this.scanner.scanDirectory(rootPath);

    // Stage 2: Metadata Collector
    const files = await this.metadataCollector.collect(rootPath, relPaths);

    // Stage 3: AST Builder
    const astNodes = await this.astBuilder.buildASTNodes(rootPath, relPaths);

    // Stage 4: Dependency Builder
    const { dependencyGraph, reverseDependencyGraph } = this.dependencyBuilder.buildDependencyGraph(rootPath, astNodes);

    let totalLOC = 0;
    for (const meta of files.values()) {
      totalLOC += meta.lineCount;
    }

    return {
      id: scanId,
      timestamp: startTime,
      rootPath,
      totalFiles: files.size,
      totalLOC,
      files,
      astNodes,
      dependencyGraph,
      reverseDependencyGraph
    };
  }
}
