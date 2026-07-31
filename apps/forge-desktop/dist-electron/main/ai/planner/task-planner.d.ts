import { ITaskNode } from '../context/context-package';
import { IGoal } from './goal-extractor';
export interface ITaskGraph {
    readonly nodes: ITaskNode[];
    readonly edges: Array<{
        from: string;
        to: string;
    }>;
}
export type RepositoryIntent = {
    type: 'workspace_statistics';
} | {
    type: 'file_search';
    fileType?: string;
    targetFile?: string;
} | {
    type: 'text_search';
    text: string;
} | {
    type: 'symbol_lookup';
    symbol: string;
} | {
    type: 'read_file';
    filePath: string;
} | {
    type: 'list_dir';
    folderPath?: string;
} | {
    type: 'general_task';
};
export declare class GoalTaskPlanner {
    classifyIntent(goalDescription: string): RepositoryIntent;
    buildTaskGraph(goal: IGoal): ITaskGraph;
}
