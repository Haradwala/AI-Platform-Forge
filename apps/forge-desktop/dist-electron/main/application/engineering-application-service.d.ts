/**
 * engineering-application-service.ts — Master Application Service Facade
 *
 * Combines all domain-specific application services (Workspace, Terminal, Git, Runtime, Agent)
 * into a single unified application boundary interface.
 */
import { IWorkspaceApplicationService } from './workspace/workspace-application-service';
import { ITerminalApplicationService } from './terminal/terminal-application-service';
import { IGitApplicationService } from './git/git-application-service';
import { IRuntimeApplicationService } from './runtime/runtime-application-service';
import { IAgentApplicationService } from './agents/agent-application-service';
import { IAutomationApplicationService } from './automation/automation-application-service';
import { IIntelligenceApplicationService } from './intelligence/intelligence-application-service';
import { RepositoryHealthApplicationService } from '../repository-health/application/repository-health-application-service';
export interface IEngineeringApplicationService {
    readonly workspace: IWorkspaceApplicationService;
    readonly terminal: ITerminalApplicationService;
    readonly git: IGitApplicationService;
    readonly runtime: IRuntimeApplicationService;
    readonly agents: IAgentApplicationService;
    readonly automation?: IAutomationApplicationService;
    readonly intelligence?: IIntelligenceApplicationService;
    readonly health?: RepositoryHealthApplicationService;
}
export declare class EngineeringApplicationService implements IEngineeringApplicationService {
    readonly workspace: IWorkspaceApplicationService;
    readonly terminal: ITerminalApplicationService;
    readonly git: IGitApplicationService;
    readonly runtime: IRuntimeApplicationService;
    readonly agents: IAgentApplicationService;
    readonly automation?: IAutomationApplicationService | undefined;
    readonly intelligence?: IIntelligenceApplicationService | undefined;
    readonly health?: RepositoryHealthApplicationService | undefined;
    constructor(workspace: IWorkspaceApplicationService, terminal: ITerminalApplicationService, git: IGitApplicationService, runtime: IRuntimeApplicationService, agents: IAgentApplicationService, automation?: IAutomationApplicationService | undefined, intelligence?: IIntelligenceApplicationService | undefined, health?: RepositoryHealthApplicationService | undefined);
}
