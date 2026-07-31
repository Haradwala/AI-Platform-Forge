import type { IPlanner, IPlan, IStructuredContext } from '../../container/service-interfaces';
import { GoalTaskPlanner } from './task-planner';
export declare class TaskPlanner implements IPlanner {
    private readonly goalPlanner;
    constructor(goalPlanner?: GoalTaskPlanner);
    generatePlan(goal: string, context: IStructuredContext): Promise<IPlan>;
}
