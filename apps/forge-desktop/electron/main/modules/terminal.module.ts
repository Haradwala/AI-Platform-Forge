import type { IContainerModule, IDesktopContainer } from '../container/interfaces';
import type { ITerminalService } from '../container/service-interfaces';
import { T } from '../container/tokens';
import { TerminalService } from '../terminal-service';

export class TerminalModule implements IContainerModule {
  readonly name = 'TerminalModule';
  readonly dependencies = ['CoreModule'];

  register(container: IDesktopContainer): void {
    container.registerSingleton<ITerminalService>({
      token:        T.ITerminalService,
      name:         'ITerminalService',
      lifetime:     'singleton',
      dependencies: [T.IDesktopLogger, T.IDesktopEventBus],
      factory:      () => new TerminalService(
        container.resolve(T.IDesktopLogger),
        container.resolve(T.IDesktopEventBus)
      ),
    });
  }
}

