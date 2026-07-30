import { RepositoryHealthApplicationService } from '../application/repository-health-application-service';
export declare class RepositoryHealthModule {
    private healthService;
    constructor(eventBus?: any);
    getService(): RepositoryHealthApplicationService;
    registerIpc(ipcRouter: any): void;
}
