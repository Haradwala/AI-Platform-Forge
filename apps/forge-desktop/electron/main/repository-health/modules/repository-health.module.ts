import { RepositoryHealthApplicationService } from '../application/repository-health-application-service';
import { registerHealthIpcHandlers } from '../ipc/health-ipc-handlers';

export class RepositoryHealthModule {
  private healthService: RepositoryHealthApplicationService;

  constructor(eventBus?: any) {
    this.healthService = new RepositoryHealthApplicationService(eventBus);
  }

  getService(): RepositoryHealthApplicationService {
    return this.healthService;
  }

  registerIpc(ipcRouter: any): void {
    registerHealthIpcHandlers(ipcRouter, this.healthService);
  }
}
