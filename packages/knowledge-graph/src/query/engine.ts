import { IGraphStorage } from '../storage/storage';
import { QueryOptimizer } from './optimizer';
import { IGraphNode, IGraphEdge } from '@forge/shared';

export class QueryEngine {
  private readonly optimizer = new QueryOptimizer();

  constructor(private readonly storage: IGraphStorage) {}

  async findSymbol(qualifiedName: string): Promise<IGraphNode[]> {
    const nodes = await this.storage.getAllNodes();
    return nodes.filter((n) => n.qualifiedName === qualifiedName);
  }

  async findReferences(nodeId: string): Promise<IGraphNode[]> {
    const neighbors = await this.storage.getNeighbors(nodeId, 'in');
    return neighbors
      .filter((n) => n.edge.kind === 'references')
      .map((n) => n.node);
  }

  async findCallers(nodeId: string): Promise<IGraphNode[]> {
    const neighbors = await this.storage.getNeighbors(nodeId, 'in');
    return neighbors
      .filter((n) => n.edge.kind === 'calls')
      .map((n) => n.node);
  }

  async findCallees(nodeId: string): Promise<IGraphNode[]> {
    const neighbors = await this.storage.getNeighbors(nodeId, 'out');
    return neighbors
      .filter((n) => n.edge.kind === 'calls')
      .map((n) => n.node);
  }

  async findImplementations(nodeId: string): Promise<IGraphNode[]> {
    const neighbors = await this.storage.getNeighbors(nodeId, 'in');
    return neighbors
      .filter((n) => n.edge.kind === 'implements')
      .map((n) => n.node);
  }

  async findInheritanceChain(nodeId: string): Promise<IGraphNode[]> {
    const chain: IGraphNode[] = [];
    let currentId = nodeId;
    
    for (let depth = 0; depth < 50; depth++) {
      const neighbors = await this.storage.getNeighbors(currentId, 'out');
      const extendsNeighbor = neighbors.find((n) => n.edge.kind === 'extends');
      if (!extendsNeighbor) break;
      chain.push(extendsNeighbor.node);
      currentId = extendsNeighbor.node.id;
    }

    return chain;
  }

  async findDependents(nodeId: string): Promise<IGraphNode[]> {
    const neighbors = await this.storage.getNeighbors(nodeId, 'in');
    return neighbors
      .filter((n) => n.edge.kind === 'imports')
      .map((n) => n.node);
  }

  async findPath(startNodeId: string, endNodeId: string, maxDepth = 10): Promise<IGraphEdge[][]> {
    const paths: IGraphEdge[][] = [];
    const queue: { currentId: string; path: IGraphEdge[] }[] = [{ currentId: startNodeId, path: [] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { currentId, path } = queue.shift()!;
      if (currentId === endNodeId) {
        paths.push(path);
        continue;
      }

      if (path.length >= maxDepth) continue;
      visited.add(currentId);

      const neighbors = await this.storage.getNeighbors(currentId, 'out');
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.node.id)) {
          queue.push({
            currentId: neighbor.node.id,
            path: [...path, neighbor.edge]
          });
        }
      }
    }

    return paths;
  }
}
