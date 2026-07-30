import type { IWorkspaceService, IIpcRouter, IWorkspaceApplicationService } from '../../main/container/service-interfaces';
/**
 * Workspace IPC handlers — binds workspace IPC channels to WorkspaceApplicationService and WorkspaceService.
 */
export declare function registerWorkspaceHandlers(router: IIpcRouter, workspaceService: IWorkspaceService, workspaceAppService?: IWorkspaceApplicationService): void;
