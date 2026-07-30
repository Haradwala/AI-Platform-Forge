import { ITaskGraph } from './task-planner';
export interface IValidationResult {
    readonly valid: boolean;
    readonly errors: string[];
}
export declare class PlanValidator {
    validate(graph: ITaskGraph): IValidationResult;
}
