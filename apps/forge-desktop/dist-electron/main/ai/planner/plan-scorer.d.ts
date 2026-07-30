import { ITaskGraph } from './task-planner';
export interface IPlanScore {
    readonly costEstimate: number;
    readonly riskFactor: 'high' | 'medium' | 'low';
    readonly score: number;
}
export declare class PlanScorer {
    scorePlan(graph: ITaskGraph): IPlanScore;
}
