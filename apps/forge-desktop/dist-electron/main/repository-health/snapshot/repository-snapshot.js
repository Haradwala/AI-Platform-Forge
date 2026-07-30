"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotBuilder = void 0;
const workspace_scanner_1 = require("./workspace-scanner");
const metadata_collector_1 = require("./metadata-collector");
const ast_builder_1 = require("./ast-builder");
const dependency_builder_1 = require("./dependency-builder");
class SnapshotBuilder {
    scanner = new workspace_scanner_1.WorkspaceScanner();
    metadataCollector = new metadata_collector_1.MetadataCollector();
    astBuilder = new ast_builder_1.ASTBuilder();
    dependencyBuilder = new dependency_builder_1.DependencyBuilder();
    async buildSnapshot(rootPath) {
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
exports.SnapshotBuilder = SnapshotBuilder;
//# sourceMappingURL=repository-snapshot.js.map