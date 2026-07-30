export interface IGoal {
    readonly id: string;
    readonly description: string;
    readonly scope: 'file' | 'module' | 'workspace';
    readonly targetFiles: string[];
}
export declare class GoalExtractor {
    extractGoal(goalDescription: string, activeFilePath?: string): IGoal;
}
