/**
 * git-application-service.ts — Application Service for Git Source Control Operations
 *
 * Encapsulates Git application use-cases, routing repository state changes
 * through the Action System (ActionExecutor).
 */
import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';
export interface IGitApplicationService {
    getStatus(workspaceRoot: string): Promise<ActionResult>;
    commit(workspaceRoot: string, message: string): Promise<ActionResult>;
    checkout(workspaceRoot: string, branch: string): Promise<ActionResult>;
    getDiff(workspaceRoot: string): Promise<ActionResult>;
    pull(workspaceRoot: string): Promise<ActionResult>;
}
export declare class GitApplicationService implements IGitApplicationService {
    private readonly actionExecutor;
    constructor(actionExecutor: ActionExecutor);
    getStatus(workspaceRoot: string): Promise<ActionResult>;
    commit(workspaceRoot: string, message: string): Promise<ActionResult>;
    checkout(workspaceRoot: string, branch: string): Promise<ActionResult>;
    getDiff(workspaceRoot: string): Promise<ActionResult>;
    pull(workspaceRoot: string): Promise<ActionResult>;
}
