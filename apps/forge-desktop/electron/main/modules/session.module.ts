import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { ISessionManager } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { SessionManager } from '../session-manager';

export class SessionModule implements IContainerModule {
  readonly name = 'SessionModule';
  readonly dependencies = ['CoreModule', 'WorkspaceModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<ISessionManager>({
      token:        T.ISessionManager,
      name:         'ISessionManager',
      lifetime:     'singleton',
      dependencies: [T.IDesktopLogger, T.IWorkspaceService],
      factory:      () => new SessionManager(
        container.resolve(T.IDesktopLogger),
        container.resolve(T.IWorkspaceService)
      ),
    });
  }
}

