/**
 * terminal-application-service.ts — Application Service for Terminal & Command Operations
 *
 * Encapsulates terminal execution application use-cases, routing command invocations
 * through the Action System (ActionExecutor) to enforce audit logging and policy checks.
 */
import { ActionExecutor } from '../../ai/actions/action-executor';
import { ActionResult } from '../../ai/actions/action-types';
export interface ITerminalApplicationService {
    runCommand(workspaceRoot: string, command: string): Promise<ActionResult>;
    runTests(workspaceRoot: string, testCommand?: string): Promise<ActionResult>;
    runBuild(workspaceRoot: string, buildCommand?: string): Promise<ActionResult>;
    runLint(workspaceRoot: string, lintCommand?: string): Promise<ActionResult>;
}
export declare class TerminalApplicationService implements ITerminalApplicationService {
    private readonly actionExecutor;
    constructor(actionExecutor: ActionExecutor);
    runCommand(workspaceRoot: string, command: string): Promise<ActionResult>;
    runTests(workspaceRoot: string, testCommand?: string): Promise<ActionResult>;
    runBuild(workspaceRoot: string, buildCommand?: string): Promise<ActionResult>;
    runLint(workspaceRoot: string, lintCommand?: string): Promise<ActionResult>;
}
