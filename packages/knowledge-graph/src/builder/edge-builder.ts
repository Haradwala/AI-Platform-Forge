import { IParseResult, IGraphEdge, GraphEdgeKind } from '@forge/shared';
import { generateStableNodeId, sha256 } from './node-builder';

export function generateStableEdgeId(sourceId: string, targetId: string, kind: string): string {
  return sha256(`${sourceId}:${targetId}:${kind}`);
}

export class EdgeBuilder {
  buildEdges(
    workspaceId: string,
    filePath: string,
    parseResult: IParseResult,
    nodes: any[]
  ): IGraphEdge[] {
    const edges: IGraphEdge[] = [];
    const timestamp = new Date();

    const fileId = generateStableNodeId(workspaceId, filePath, '');
    const nodesByName = new Map<string, string>();
    for (const node of nodes) {
      if (node.kind !== 'file') {
        nodesByName.set(node.displayName, node.id);
      }
    }

    for (const node of nodes) {
      if (node.id !== fileId) {
        const containsEdgeId = generateStableEdgeId(fileId, node.id, 'contains');
        const containsEdge: IGraphEdge = {
          id: containsEdgeId,
          sourceId: fileId,
          targetId: node.id,
          kind: 'contains',
          confidence: 1.0,
          metadata: {},
          timestamps: { createdAt: timestamp, updatedAt: timestamp }
        };
        edges.push(containsEdge);

        const belongsEdgeId = generateStableEdgeId(node.id, fileId, 'belongs_to');
        const belongsEdge: IGraphEdge = {
          id: belongsEdgeId,
          sourceId: node.id,
          targetId: fileId,
          kind: 'belongs_to',
          confidence: 1.0,
          metadata: {},
          timestamps: { createdAt: timestamp, updatedAt: timestamp }
        };
        edges.push(belongsEdge);
      }
    }

    for (const rel of parseResult.relationships) {
      const sourceId = rel.sourceSymbolId && rel.sourceSymbolId !== filePath
        ? generateStableNodeId(workspaceId, filePath, rel.sourceSymbolId)
        : fileId;

      let targetId = rel.targetSymbolId;
      if (nodesByName.has(rel.targetSymbolId)) {
        targetId = nodesByName.get(rel.targetSymbolId)!;
      } else {
        targetId = generateStableNodeId(workspaceId, filePath, rel.targetSymbolId);
      }

      let kind: GraphEdgeKind = 'references';
      if (rel.type === 'calls') kind = 'calls';
      else if (rel.type === 'extends') kind = 'extends';
      else if (rel.type === 'implements') kind = 'implements';
      else if (rel.type === 'imports') kind = 'imports';
      else if (rel.type === 'exports') kind = 'exports';

      const edgeId = generateStableEdgeId(sourceId, targetId, kind);
      const edge: IGraphEdge = {
        id: edgeId,
        sourceId,
        targetId,
        kind,
        confidence: 1.0,
        metadata: {},
        timestamps: { createdAt: timestamp, updatedAt: timestamp }
      };
      edges.push(edge);
    }

    return edges;
  }
}
