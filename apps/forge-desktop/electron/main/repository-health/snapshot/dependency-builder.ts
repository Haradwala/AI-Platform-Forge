import * as path from 'path';
import { ASTNodeInfo } from '../contracts/health-types';

export class DependencyBuilder {
  buildDependencyGraph(
    rootPath: string,
    astNodes: Map<string, ASTNodeInfo>
  ): { dependencyGraph: Map<string, Set<string>>; reverseDependencyGraph: Map<string, Set<string>> } {
    const dependencyGraph = new Map<string, Set<string>>();
    const reverseDependencyGraph = new Map<string, Set<string>>();

    for (const fileKey of astNodes.keys()) {
      dependencyGraph.set(fileKey, new Set<string>());
      reverseDependencyGraph.set(fileKey, new Set<string>());
    }

    for (const [sourceFile, ast] of astNodes.entries()) {
      const sourceDir = path.dirname(sourceFile);

      for (const importPath of ast.importedModules) {
        if (importPath.startsWith('.')) {
          let resolved = path.normalize(path.join(sourceDir, importPath));

          // Try resolving extensions
          let targetKey: string | null = null;
          if (astNodes.has(resolved)) {
            targetKey = resolved;
          } else if (astNodes.has(resolved + '.ts')) {
            targetKey = resolved + '.ts';
          } else if (astNodes.has(resolved + '.tsx')) {
            targetKey = resolved + '.tsx';
          } else if (astNodes.has(path.join(resolved, 'index.ts'))) {
            targetKey = path.join(resolved, 'index.ts');
          }

          if (targetKey && targetKey !== sourceFile) {
            dependencyGraph.get(sourceFile)?.add(targetKey);
            if (!reverseDependencyGraph.has(targetKey)) {
              reverseDependencyGraph.set(targetKey, new Set<string>());
            }
            reverseDependencyGraph.get(targetKey)?.add(sourceFile);
          }
        }
      }
    }

    return { dependencyGraph, reverseDependencyGraph };
  }
}
