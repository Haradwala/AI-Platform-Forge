import { IGraphNode, IGraphEdge } from '@forge/shared';

export interface ITransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface IGraphStorage {
  initialize(): Promise<void>;
  close(): Promise<void>;
  
  beginTransaction(): Promise<ITransaction>;
  
  upsertNodes(nodes: IGraphNode[]): Promise<void>;
  deleteNodes(nodeIds: string[]): Promise<void>;
  upsertEdges(edges: IGraphEdge[]): Promise<void>;
  deleteEdges(edgeIds: string[]): Promise<void>;
  
  getNode(id: string): Promise<IGraphNode | undefined>;
  getEdge(id: string): Promise<IGraphEdge | undefined>;
  getNeighbors(nodeId: string, direction: 'in' | 'out' | 'both'): Promise<{ node: IGraphNode; edge: IGraphEdge }[]>;
  getAllNodes(): Promise<IGraphNode[]>;
  getAllEdges(): Promise<IGraphEdge[]>;
}
