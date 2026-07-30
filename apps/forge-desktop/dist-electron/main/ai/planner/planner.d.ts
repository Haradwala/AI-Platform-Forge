import type { IPlanner, IPlan, IStructuredContext } from '../../container/service-interfaces';
export declare class TaskPlanner implements IPlanner {
    generatePlan(goal: string, context: IStructuredContext): Promise<IPlan>;
}
