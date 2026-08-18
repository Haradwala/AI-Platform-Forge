import { ITaskNode } from '../context/context-package';
import { IGoal } from './goal-extractor';
import { ExecutionGoal } from '../contracts/execution-goal';
export interface ITaskGraph {
    readonly nodes: ITaskNode[];
    readonly edges: Array<{
        from: string;
        to: string;
    }>;
}
export type RepositoryIntent = {
    type: 'workspace_statistics';
    goal: ExecutionGoal.WORKSPACE_STATISTICS;
} | {
    type: 'list_workspace_files';
    goal: ExecutionGoal.FILE_LIST;
    limit?: number;
    offset?: number;
} | {
    type: 'file_search';
    goal: ExecutionGoal.SEARCH;
    fileType?: string;
    targetFile?: string;
} | {
    type: 'text_search';
    goal: ExecutionGoal.SEARCH;
    text: string;
} | {
    type: 'symbol_lookup';
    goal: ExecutionGoal.SEARCH;
    symbol: string;
} | {
    type: 'read_file';
    goal: ExecutionGoal.FILE_CONTENT;
    filePath: string;
    open?: boolean;
} | {
    type: 'list_dir';
    goal: ExecutionGoal.FILE_LIST;
    folderPath?: string;
} | {
    type: 'terminal_command';
    goal: ExecutionGoal.RUN_TERMINAL;
    rawCommand?: string;
} | {
    type: 'general_task';
    goal: ExecutionGoal.UNKNOWN;
};
export declare class GoalTaskPlanner {
    classifyIntent(goalDescription: string, context?: any): RepositoryIntent;
    buildTaskGraph(goal: IGoal): ITaskGraph;
    /**
     * Dynamic Project-Agnostic Terminal Command Resolver.
     * Inspects user prompt and project context to resolve exact test/build command lines
     * without hardcoding (e.g. pnpm test, npm test, cargo test, pytest, go test).
     */
    private resolveTerminalCommand;
}
