import { IForgeModule, IForgeContext } from '@forge/core-runtime';
import { WorkspaceManager } from './manager';

export class WorkspaceModule implements IForgeModule {
  readonly name = 'WorkspaceModule';
  readonly version = '0.1.0';
  readonly dependencies = [];

  private workspaceManager?: WorkspaceManager;

  async initialize(context: IForgeContext): Promise<void> {
    context.logger.info('WorkspaceModule: Initializing...');
    this.workspaceManager = new WorkspaceManager(context.eventBus);
    context.di.registerInstance('WorkspaceManager', this.workspaceManager);
    context.logger.info('WorkspaceModule: Registered WorkspaceManager in DI.');
  }

  async start(context: IForgeContext): Promise<void> {
    context.logger.info('WorkspaceModule: Starting...');
    const workspaceRoot = context.config.get('WORKSPACE_ROOT');
    if (workspaceRoot && this.workspaceManager) {
      context.logger.info(`WorkspaceModule: Auto-opening workspace root: ${workspaceRoot}`);
      await this.workspaceManager.openWorkspace(workspaceRoot);
    }
  }

  async stop(context: IForgeContext): Promise<void> {
    context.logger.info('WorkspaceModule: Stopping...');
    if (this.workspaceManager) {
      const activeSession = this.workspaceManager.getActiveSession();
      if (activeSession) {
        context.logger.info(`WorkspaceModule: Closing active session: ${activeSession.id}`);
        await this.workspaceManager.closeWorkspace(activeSession.id);
      }
    }
  }

  async checkHealth(): Promise<'healthy' | 'degraded' | 'failed'> {
    return this.workspaceManager ? 'healthy' : 'failed';
  }
}
