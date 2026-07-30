import { ITaskGraph } from './task-planner';

export interface IPlanScore {
  readonly costEstimate: number; // In token counts
  readonly riskFactor: 'high' | 'medium' | 'low';
  readonly score: number; // 0-100 rating
}

export class PlanScorer {
  scorePlan(graph: ITaskGraph): IPlanScore {
    let costEstimate = 0;
    let highRiskCount = 0;

    graph.nodes.forEach((node) => {
      // Base token cost estimate per tool type
      if (node.toolId === 'write_file') costEstimate += 1000;
      else if (node.toolId === 'read_file') costEstimate += 500;
      else costEstimate += 100;

      if (node.risk === 'high') {
        highRiskCount++;
      }
    });

    let riskFactor: IPlanScore['riskFactor'] = 'low';
    if (highRiskCount > 0) riskFactor = 'high';
    else if (graph.nodes.some((n) => n.risk === 'medium')) riskFactor = 'medium';

    // Calculate score (lower cost + lower risk = higher score)
    let score = 100 - Math.min(costEstimate / 100, 40);
    if (riskFactor === 'high') score -= 30;
    else if (riskFactor === 'medium') score -= 15;

    return {
      costEstimate,
      riskFactor,
      score: Math.max(score, 10),
    };
  }
}
