import { ITaskGraph } from './task-planner';

export interface IValidationResult {
  readonly valid: boolean;
  readonly errors: string[];
}

export class PlanValidator {
  validate(graph: ITaskGraph): IValidationResult {
    const errors: string[] = [];

    // 1. Check for circular cycles using DFS
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const node = graph.nodes.find((n) => n.id === nodeId);
      if (node) {
        for (const dep of node.dependencies) {
          if (hasCycle(dep)) return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of graph.nodes) {
      if (hasCycle(node.id)) {
        errors.push(`Circular dependency loop detected involving task: ${node.id}`);
        break;
      }
    }

    // 2. Check for missing dependencies references
    const nodeIds = new Set(graph.nodes.map((n) => n.id));
    for (const node of graph.nodes) {
      for (const dep of node.dependencies) {
        if (!nodeIds.has(dep)) {
          errors.push(`Task: ${node.id} depends on unregistered task: ${dep}`);
        }
      }
    }

    // 3. Check for missing toolId specification on task nodes
    for (const node of graph.nodes) {
      if (!node.toolId || typeof node.toolId !== 'string' || !node.toolId.trim()) {
        errors.push(`Task: ${node.id} (${node.title}) is missing a valid toolId.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
