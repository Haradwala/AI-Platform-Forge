import { IGraphNode, IGraphEdge } from '@forge/shared';

export interface IValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
}

export class GraphValidator {
  validate(nodes: IGraphNode[], edges: IGraphEdge[]): IValidationResult {
    const errors: string[] = [];
    const nodeIds = new Set(nodes.map((n) => n.id));

    const duplicateCheck = new Set<string>();
    for (const node of nodes) {
      if (duplicateCheck.has(node.id)) {
        errors.push(`GraphValidator: Duplicate node ID detected: ${node.id}`);
      }
      duplicateCheck.add(node.id);
    }

    const duplicateEdgeCheck = new Set<string>();
    for (const edge of edges) {
      if (duplicateEdgeCheck.has(edge.id)) {
        errors.push(`GraphValidator: Duplicate edge ID detected: ${edge.id}`);
      }
      duplicateEdgeCheck.add(edge.id);
    }

    for (const edge of edges) {
      if (edge.kind === 'contains' && !nodeIds.has(edge.targetId)) {
        errors.push(`GraphValidator: Containment target node does not exist: ${edge.targetId}`);
      }

      if (edge.sourceId === edge.targetId && (edge.kind === 'calls' || edge.kind === 'extends' || edge.kind === 'implements')) {
        errors.push(`GraphValidator: Invalid self-loop detected: node ${edge.sourceId} cannot link to itself with kind ${edge.kind}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
