import { ITaskNode } from '../context/context-package';
import { IGoal } from './goal-extractor';

export interface ITaskGraph {
  readonly nodes: ITaskNode[];
  readonly edges: Array<{ from: string; to: string }>;
}

export class GoalTaskPlanner {
  buildTaskGraph(goal: IGoal): ITaskGraph {
    const nodes: ITaskNode[] = [];
    const edges: Array<{ from: string; to: string }> = [];

    // Create first analysis node
    const analyzeNode: ITaskNode = {
      id: 'task_analyze',
      title: 'Analyze goal references',
      description: `Understand details of scope: ${goal.scope}`,
      dependencies: [],
      priority: 'high',
      risk: 'low',
      toolId: 'read_file',
      status: 'pending',
    };
    nodes.push(analyzeNode);

    // Create nodes for targets
    goal.targetFiles.forEach((file, index) => {
      const editId = `task_edit_${index}`;
      const editNode: ITaskNode = {
        id: editId,
        title: `Modify file: ${file}`,
        description: `Apply goal modifications to ${file}`,
        dependencies: ['task_analyze'],
        priority: 'normal',
        risk: 'medium',
        toolId: 'write_file',
        status: 'pending',
      };
      nodes.push(editNode);
      edges.push({ from: 'task_analyze', to: editId });

      const openId = `task_open_${index}`;
      const openNode: ITaskNode = {
        id: openId,
        title: `Open file tab: ${file}`,
        description: `Expose modified file: ${file} on Monaco editor viewport`,
        dependencies: [editId],
        priority: 'low',
        risk: 'low',
        toolId: 'open_file',
        status: 'pending',
      };
      nodes.push(openNode);
      edges.push({ from: editId, to: openId });
    });

    return { nodes, edges };
  }
}
