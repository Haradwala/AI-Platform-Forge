import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { IStartupManager } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { StartupManager } from '../startup-manager';

/**
 * StartupModule — registers the real StartupManager (not the stub).
 *
 * StartupManager requires the IDesktopContainer itself so it can:
 * - Call container.validate() in Stage 1
 * - Call container.initializeAll() in Stage 2
 * - Call container.freeze() in Stage 8
 * - Call container.shutdownAll() during shutdown
 *
 * Must be the last module loaded.
 */
export class StartupModule implements IContainerModule {
  readonly name = 'StartupModule';
  readonly dependencies = [
    'CoreModule',
    'IpcModule',
    'WindowModule',
    'WorkspaceModule',
    'ThemeModule',
    'TerminalModule',
    'SessionModule',
    'PerformanceModule',
  ];

  constructor(private readonly container: IDesktopContainer) {}

  register(container: IDesktopContainer): void {
    container.registerSingleton<IStartupManager>({
      token:    T.IStartupManager,
      name:     'IStartupManager',
      lifetime: 'singleton',
      dependencies: [
        T.IDesktopLogger,
        T.IDesktopEventBus,
        T.IIpcRouter,
        T.IWindowService,
        T.IWorkspaceService,
        T.IThemeService,
        T.ITerminalService,
        T.ISessionManager,
        T.IPerformanceMonitor,
      ],
      // The factory receives the container reference captured at construction time,
      // not via resolver — this is intentional. StartupManager must control the
      // full container lifecycle (validate, freeze, shutdownAll).
      factory: () => new StartupManager(this.container),
    });
  }
}
