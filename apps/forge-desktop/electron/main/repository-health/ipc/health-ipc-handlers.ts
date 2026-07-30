import { RepositoryHealthApplicationService } from '../application/repository-health-application-service';

export function registerHealthIpcHandlers(
  ipcRouter: any,
  healthService: RepositoryHealthApplicationService
): void {
  if (!ipcRouter) return;

  ipcRouter.handle('repository:scan', async (rootPath: string) => {
    return healthService.scanRepository(rootPath);
  });

  ipcRouter.handle('repository:health', async () => {
    return healthService.getHealthReport();
  });

  ipcRouter.handle('repository:findings', async (severity?: string, category?: string) => {
    return healthService.getFindings(severity as any, category as any);
  });

  ipcRouter.handle('repository:snapshot', async () => {
    return healthService.getSnapshot();
  });

  ipcRouter.handle('repository:dead-code', async () => {
    return healthService.getFindings(undefined, 'dead-code');
  });

  ipcRouter.handle('repository:duplicates', async () => {
    return healthService.getFindings(undefined, 'duplicate');
  });

  ipcRouter.handle('repository:architecture', async () => {
    return healthService.getFindings(undefined, 'architecture');
  });

  ipcRouter.handle('repository:complexity', async () => {
    return healthService.getFindings(undefined, 'complexity');
  });
}
