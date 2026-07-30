import { ITaskNode } from '../context/context-package';
import { IGoal } from './goal-extractor';
export interface ITaskGraph {
    readonly nodes: ITaskNode[];
    readonly edges: Array<{
        from: string;
        to: string;
    }>;
}
export declare class GoalTaskPlanner {
    buildTaskGraph(goal: IGoal): ITaskGraph;
}
