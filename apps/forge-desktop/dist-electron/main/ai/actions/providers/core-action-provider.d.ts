/**
 * core-action-provider.ts — Phase 29 Core Filesystem & Terminal Action Provider
 *
 * Implements normalized core actions: ReadFile, WriteFile, ReplaceText, SearchWorkspace,
 * FindSymbol, OpenFile, SaveFile, RenameFile, MoveFile, DeleteFile, CreateFolder,
 * RunCommand, RunTests, RunBuild, RunLint.
 */
import { IAction, IActionProvider } from '../action-types';
import type { IWorkspaceService, ITerminalService, ICodeIntelligenceEngine } from '../../../container/service-interfaces';
export declare class CoreActionProvider implements IActionProvider {
    private readonly workspaceService?;
    private readonly terminalService?;
    private readonly codeIntelligence?;
    readonly id = "provider.core";
    readonly name = "Core Action Provider";
    constructor(workspaceService?: IWorkspaceService | undefined, terminalService?: ITerminalService | undefined, codeIntelligence?: ICodeIntelligenceEngine | undefined);
    getActions(): IAction[];
}
