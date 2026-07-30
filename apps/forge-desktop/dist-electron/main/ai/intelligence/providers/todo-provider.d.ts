/**
 * todo-provider.ts — Phase 25-28 TODO / FIXME Scanner Provider
 *
 * Scans workspace files for TODO, FIXME, HACK, and XXX comments.
 */
export interface TodoItem {
    type: 'TODO' | 'FIXME' | 'HACK' | 'XXX';
    message: string;
    filePath: string;
    line: number;
}
export declare class TodoProvider {
    getTodos(workspaceRoot: string): TodoItem[];
}
