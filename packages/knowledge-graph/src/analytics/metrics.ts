import { IGraphStorage } from '../storage/storage';
import { IGraphNode, IGraphEdge } from '@forge/shared';

export interface IGraphMetrics {
  readonly fanIn: number;
  readonly fanOut: number;
  readonly dependencyDensity: number;
}

export class GraphAnalyticsEngine {
  constructor(private readonly storage: IGraphStorage) {}

  async calculateMetrics(nodeId: string): Promise<IGraphMetrics> {
    const inNeighbors = await this.storage.getNeighbors(nodeId, 'in');
    const outNeighbors = await this.storage.getNeighbors(nodeId, 'out');
    
    const fanIn = inNeighbors.length;
    const fanOut = outNeighbors.length;
    
    const allNodesCount = (await this.storage.getAllNodes()).length;
    const dependencyDensity = allNodesCount > 0 ? (fanIn + fanOut) / allNodesCount : 0;

    return { fanIn, fanOut, dependencyDensity };
  }

  async findCircularDependencies(): Promise<string[][]> {
    const cycles: string[][] = [];
    const nodes = await this.storage.getAllNodes();
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = async (nodeId: string, currentPath: string[]) => {
      visited.add(nodeId);
      recStack.add(nodeId);
      currentPath.push(nodeId);

      const neighbors = await this.storage.getNeighbors(nodeId, 'out');
      for (const neighbor of neighbors) {
        const nextId = neighbor.node.id;
        if (!visited.has(nextId)) {
          await dfs(nextId, [...currentPath]);
        } else if (recStack.has(nextId)) {
          const cycleStartIdx = currentPath.indexOf(nextId);
          if (cycleStartIdx !== -1) {
            cycles.push([...currentPath.slice(cycleStartIdx), nextId]);
          }
        }
      }

      recStack.delete(nodeId);
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        await dfs(node.id, []);
      }
    }

    return cycles;
  }

  async findDeadCode(): Promise<string[]> {
    const deadCodeNodeIds: string[] = [];
    const nodes = await this.storage.getAllNodes();

    for (const node of nodes) {
      if (
        node.kind === 'file' ||
        node.kind === 'directory' ||
        node.kind === 'workspace' ||
        node.kind === 'project'
      ) {
        continue;
      }

      const inNeighbors = await this.storage.getNeighbors(node.id, 'in');
      const inCalls = inNeighbors.filter(
        (n) => n.edge.kind === 'calls' || n.edge.kind === 'references'
      );
      if (inCalls.length === 0) {
        deadCodeNodeIds.push(node.id);
      }
    }

    return deadCodeNodeIds;
  }

  async findOrphanSymbols(): Promise<string[]> {
    const orphans: string[] = [];
    const nodes = await this.storage.getAllNodes();

    for (const node of nodes) {
      if (
        node.kind === 'file' ||
        node.kind === 'directory' ||
        node.kind === 'workspace' ||
        node.kind === 'project'
      ) {
        continue;
      }

      const inNeighbors = await this.storage.getNeighbors(node.id, 'in');
      const outNeighbors = await this.storage.getNeighbors(node.id, 'out');
      
      if (inNeighbors.length === 0 && outNeighbors.length === 0) {
        orphans.push(node.id);
      }
    }

    return orphans;
  }
}
