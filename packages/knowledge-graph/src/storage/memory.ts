import { IGraphStorage, ITransaction } from './storage';
import { IGraphNode, IGraphEdge } from '@forge/shared';

export class MemoryGraphStorage implements IGraphStorage {
  private nodes = new Map<string, IGraphNode>();
  private edges = new Map<string, IGraphEdge>();

  private stagedNodes = new Map<string, IGraphNode>();
  private stagedDeletes = new Set<string>();
  
  private stagedEdges = new Map<string, IGraphEdge>();
  private stagedEdgeDeletes = new Set<string>();

  private activeTransaction: ITransaction | null = null;

  async initialize(): Promise<void> {}
  async close(): Promise<void> {}

  async beginTransaction(): Promise<ITransaction> {
    if (this.activeTransaction) {
      throw new Error('MemoryGraphStorage: A transaction is already active.');
    }

    this.clearStaging();

    const transaction: ITransaction = {
      commit: async () => {
        for (const id of this.stagedDeletes) {
          this.nodes.delete(id);
        }
        for (const [id, node] of this.stagedNodes.entries()) {
          this.nodes.set(id, node);
        }

        for (const id of this.stagedEdgeDeletes) {
          this.edges.delete(id);
        }
        for (const [id, edge] of this.stagedEdges.entries()) {
          this.edges.set(id, edge);
        }

        this.clearStaging();
        this.activeTransaction = null;
      },
      rollback: async () => {
        this.clearStaging();
        this.activeTransaction = null;
      }
    };

    this.activeTransaction = transaction;
    return transaction;
  }

  private clearStaging(): void {
    this.stagedNodes.clear();
    this.stagedDeletes.clear();
    this.stagedEdges.clear();
    this.stagedEdgeDeletes.clear();
  }

  async upsertNodes(nodes: IGraphNode[]): Promise<void> {
    const targetMap = this.activeTransaction ? this.stagedNodes : this.nodes;
    for (const node of nodes) {
      targetMap.set(node.id, node);
      if (this.activeTransaction) {
        this.stagedDeletes.delete(node.id);
      }
    }
  }

  async deleteNodes(nodeIds: string[]): Promise<void> {
    const targetMap = this.activeTransaction ? this.stagedNodes : this.nodes;
    for (const id of nodeIds) {
      if (this.activeTransaction) {
        this.stagedDeletes.add(id);
        this.stagedNodes.delete(id);
      } else {
        targetMap.delete(id);
      }
    }
  }

  async upsertEdges(edges: IGraphEdge[]): Promise<void> {
    const targetMap = this.activeTransaction ? this.stagedEdges : this.edges;
    for (const edge of edges) {
      targetMap.set(edge.id, edge);
      if (this.activeTransaction) {
        this.stagedEdgeDeletes.delete(edge.id);
      }
    }
  }

  async deleteEdges(edgeIds: string[]): Promise<void> {
    const targetMap = this.activeTransaction ? this.stagedEdges : this.edges;
    for (const id of edgeIds) {
      if (this.activeTransaction) {
        this.stagedEdgeDeletes.add(id);
        this.stagedEdges.delete(id);
      } else {
        targetMap.delete(id);
      }
    }
  }

  async getNode(id: string): Promise<IGraphNode | undefined> {
    if (this.activeTransaction) {
      if (this.stagedDeletes.has(id)) return undefined;
      if (this.stagedNodes.has(id)) return this.stagedNodes.get(id);
    }
    return this.nodes.get(id);
  }

  async getEdge(id: string): Promise<IGraphEdge | undefined> {
    if (this.activeTransaction) {
      if (this.stagedEdgeDeletes.has(id)) return undefined;
      if (this.stagedEdges.has(id)) return this.stagedEdges.get(id);
    }
    return this.edges.get(id);
  }

  async getNeighbors(
    nodeId: string,
    direction: 'in' | 'out' | 'both'
  ): Promise<{ node: IGraphNode; edge: IGraphEdge }[]> {
    const results: { node: IGraphNode; edge: IGraphEdge }[] = [];
    const allEdges = this.activeTransaction
      ? new Map([...this.edges.entries(), ...this.stagedEdges.entries()])
      : this.edges;
      
    const activeDeletes = this.stagedEdgeDeletes;

    for (const edge of allEdges.values()) {
      if (this.activeTransaction && activeDeletes.has(edge.id)) continue;

      let targetId: string | null = null;
      if (direction === 'out' && edge.sourceId === nodeId) {
        targetId = edge.targetId;
      } else if (direction === 'in' && edge.targetId === nodeId) {
        targetId = edge.sourceId;
      } else if (direction === 'both') {
        if (edge.sourceId === nodeId) targetId = edge.targetId;
        else if (edge.targetId === nodeId) targetId = edge.sourceId;
      }

      if (targetId) {
        const targetNode = await this.getNode(targetId);
        if (targetNode) {
          results.push({ node: targetNode, edge });
        }
      }
    }

    return results;
  }

  async getAllNodes(): Promise<IGraphNode[]> {
    const all = new Map([...this.nodes.entries(), ...this.stagedNodes.entries()]);
    if (this.activeTransaction) {
      for (const id of this.stagedDeletes) {
        all.delete(id);
      }
    }
    return Array.from(all.values());
  }

  async getAllEdges(): Promise<IGraphEdge[]> {
    const all = new Map([...this.edges.entries(), ...this.stagedEdges.entries()]);
    if (this.activeTransaction) {
      for (const id of this.stagedEdgeDeletes) {
        all.delete(id);
      }
    }
    return Array.from(all.values());
  }
}
