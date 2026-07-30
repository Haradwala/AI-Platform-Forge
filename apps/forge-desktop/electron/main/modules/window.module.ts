import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IWindowService } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { WindowRegistry } from '../window-registry';
import { WindowService } from '../window-service';

/**
 * WindowModule — registers the WindowRegistry and WindowService in the container.
 *
 * Dependencies:
 * - CoreModule (provides T.IDesktopLogger)
 */
export class WindowModule implements IContainerModule {
  readonly name = 'WindowModule';
  readonly dependencies = ['CoreModule'];

  register(container: IDesktopContainer): void {
    // 1. Register WindowRegistry as a singleton
    container.registerSingleton({
      token:        T.IWindowRegistry,
      name:         'IWindowRegistry',
      lifetime:     'singleton',
      dependencies: [],
      factory:      () => new WindowRegistry(),
    });

    // 2. Register WindowService as a singleton
    container.registerSingleton<IWindowService>({
      token:        T.IWindowService,
      name:         'IWindowService',
      lifetime:     'singleton',
      dependencies: [T.IWindowRegistry, T.IDesktopLogger],
      factory: (resolver) => new WindowService(
        resolver.resolve(T.IWindowRegistry),
        resolver.resolve(T.IDesktopLogger),
      ),
    });
  }
}
