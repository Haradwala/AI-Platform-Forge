import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IWorkspaceService } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { WorkspaceService } from '../workspace-service';

/**
 * WorkspaceModule — registers the WorkspaceService.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger, T.IDesktopEventBus)
 * - WindowModule (provides T.IWindowRegistry)
 */
export class WorkspaceModule implements IContainerModule {
  readonly name = 'WorkspaceModule';
  readonly dependencies = ['CoreModule', 'WindowModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<IWorkspaceService>({
      token:        T.IWorkspaceService,
      name:         'IWorkspaceService',
      lifetime:     'singleton',
      dependencies: [T.IWindowRegistry, T.IDesktopLogger, T.IDesktopEventBus],
      factory: (resolver) => new WorkspaceService(
        resolver.resolve(T.IWindowRegistry),
        resolver.resolve(T.IDesktopLogger),
        resolver.resolve(T.IDesktopEventBus),
      ),
    });
  }
}
