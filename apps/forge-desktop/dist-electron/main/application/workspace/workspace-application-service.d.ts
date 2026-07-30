/**
 * workspace-application-service.ts — Application Service for Workspace Operations
 *
 * Encapsulates workspace filesystem application use-cases, routing all mutations
 * through the Action System (ActionExecutor) to enforce permission validation,
 * audit logging, and undo/redo capabilities.
 */
import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';
import type { IWorkspaceService } from '../../container/service-interfaces';
export interface IWorkspaceApplicationService {
    readFile(workspaceRoot: string, filePath: string): Promise<string>;
    writeFile(workspaceRoot: string, filePath: string, content: string): Promise<ActionResult>;
    createFile(workspaceRoot: string, filePath: string): Promise<ActionResult>;
    createFolder(workspaceRoot: string, folderPath: string): Promise<ActionResult>;
    renameEntry(workspaceRoot: string, oldPath: string, newPath: string): Promise<ActionResult>;
    deleteEntry(workspaceRoot: string, filePath: string): Promise<ActionResult>;
}
export declare class WorkspaceApplicationService implements IWorkspaceApplicationService {
    private readonly actionExecutor;
    private readonly workspaceService?;
    constructor(actionExecutor: ActionExecutor, workspaceService?: IWorkspaceService | undefined);
    readFile(workspaceRoot: string, filePath: string): Promise<string>;
    writeFile(workspaceRoot: string, filePath: string, content: string): Promise<ActionResult>;
    createFile(workspaceRoot: string, filePath: string): Promise<ActionResult>;
    createFolder(workspaceRoot: string, folderPath: string): Promise<ActionResult>;
    renameEntry(workspaceRoot: string, oldPath: string, newPath: string): Promise<ActionResult>;
    deleteEntry(workspaceRoot: string, filePath: string): Promise<ActionResult>;
}
